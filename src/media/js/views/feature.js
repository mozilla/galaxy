define('views/feature',
    ['l10n', 'log', 'notification', 'templates', 'requests', 'search_worker', 'urls', 'z'],
    function(l10n, log, notification, nunjucks, requests, worker, urls, z) {

    var gettext = l10n.gettext;

    var indexed = index();

    function index() {
        return new Promise(function(resolve, reject) {
            worker.addEventListener('message', function(e) {
                switch (e.data.type) {
                    case 'indexed':
                        return resolve();
                    case 'results':
                        showSearchResults(e.data.data.results, e.data.data.query);
                        return resolve();
                }
            });

            worker.postMessage({
                type: 'index',
                data: {
                    url: urls.api.url('game.list'),
                    fields: {
                        app_url: {boost: 25},
                        slug: {boost: 20},
                        name: {boost: 30},
                        description: {boost: 15}
                    },
                    ref: 'slug'
                }
            });
        });
    }

    function controlSpinner($button, addSpinner, newText) {
        var $textSpan = $button.children('span');
        if (addSpinner) {
            $textSpan.hide();
            $button.append('<div class="spinner btn-replace"></div>');
        } else {
            $textSpan.text(newText ? newText : $textSpan.text());
            $textSpan.show();
            $button.children('.spinner').remove();
        }
    }

    // Send request to featured endpoint to unfeature.
    function unfeatureGame() {
        var $this = $(this);
        var gameSlug = $this.parent().data('slug');

        controlSpinner($this, true);

        requests.del(urls.api.url('game.featured', [], {
            game: gameSlug
        })).done(function(data) {
            notification.notification({message: gettext('Game unfeatured')});
            removeGameRow(gameSlug);
        }).fail(function() {
            notification.notification({message: gettext('Error: A problem occured while unfeaturing this game. Please try again.')});
            controlSpinner($this, false);
        });
    }

    // TODO: Hook up with curation modal (#126).
    function featureGame(gameSlug) {
        return requests.post(urls.api.url('game.featured'), {
            game: gameSlug
        }).then(function(data) {
            notification.notification({message: gettext('Game featured')});
        }, function(data) {
            notification.notification({message: gettext('Error: A problem occured while featuring this game. Please try again.')});
            console.error(data);
        }).promise();
    }

    // Send request to moderate endpoint for deletion.
    function deleteGame() {
        var $this = $(this);
        var gameSlug = $this.parent().data('slug');

        controlSpinner($this, true);

        notification.confirmation({message: gettext('Are you sure you want to delete this game?')}).done(function() {
            requests.post(urls.api.url('game.moderate', [gameSlug, 'delete'])).done(function(data) {
                notification.notification({message: gettext('Game deleted')});
                removeGameRow(gameSlug);
            }).fail(function() {
                notification.notification({message: gettext('Error: A problem occured while deleting this game. Please try again.')});
                controlSpinner($this, false);
            });
        }).fail(function() {
            // Add back text.
            controlSpinner($this, false);
        });
    }

    // Send request to moderate endpoint.
    function moderateGame($this, action) {
        var gameSlug = $this.parent().data('slug');

        controlSpinner($this, true);

        requests.post(urls.api.url('game.moderate', [gameSlug, action])).done(function(data) {
            notification.notification({message: gettext('Game status successfully changed')});
            if (action === 'disable') {
                var $statusSpan = $('.game-status[data-slug='+ gameSlug +']');
                var previousStatus = $statusSpan.text().toLowerCase();

                // Change status to disabled.
                $statusSpan.text(gettext('Disabled')).removeClass('status-' + previousStatus).addClass('status-disabled');
                // Change button.
                $this.removeClass('curation-disable btn-disable').addClass('btn-enable curation-enable');
                controlSpinner($this, false, gettext('Enable'));
            } else if (action === 'approve') {
                var $statusSpan = $('.game-status[data-slug='+ gameSlug +']');
                var previousStatus = $statusSpan.text().toLowerCase();

                // Change status to enabled.
                $statusSpan.text('Public').removeClass('status-'+ previousStatus).addClass('status-approved');
                // Change button.
                $this.removeClass('curation-enable btn-enable').addClass('btn-disable curation-disable');
                controlSpinner($this, false, gettext('Disable'));
            }


        }).fail(function() {
            notification.notification({message: gettext('Error: A problem occured while changing the game status. Please try again.')});
            controlSpinner($this, false);
        });
    }

    // Remove table representing game with specified slug.
    function removeGameRow(slug) {
        var $row = $('tr[data-slug=' + slug + ']');
        $row.remove();

        // If no more games, hide table and show message.
        if (!$('.curation-table tr').length) {
            $('#empty-message').show();
            $('.curation-table').hide();
        }
    }

    function addGameRow(slug) {
        // Get Game Details
        requests.get(urls.api.url('game', [slug]))
        .done(function(gameData) {
            var rowToAdd = nunjucks.env.render('admin/_curation-row.html', {game: gameData});
            $('.curation-table tbody').append(rowToAdd);
            $('.curation-table').show();
            $('#empty-message').hide();
        });
    }

    function showSearchResults(games, query) {
        $('.game-results').html(
            nunjucks.env.render('admin/game-results.html', {games: games})
        );
        $('.game-results').find('.game-result-name').each(function () {
            $this = $(this);
            $text = $this.text();
            var matchStart = $text.toLowerCase().indexOf(query.toLowerCase());
            if (matchStart !== -1) {
                var matchEnd = matchStart + query.length - 1;
                var beforeMatch = $text.slice(0, matchStart);
                var matchText = $text.slice(matchStart, matchEnd + 1);
                var afterMatch = $text.slice(matchEnd + 1);
                $this.html(beforeMatch + '<span class="highlight">' + matchText + '</span>' + afterMatch);
            }
        });
    }

    function reorderGame(slug, rank) {
        return requests.post(urls.api.url('game.featured'), {
            game: slug,
            rank: rank
        }).then(function(data) {
            notification.notification({message: gettext('Game order saved')});
        }, function(data) {
            notification.notification({message: gettext('Error: A problem occured while changing the order of this game. Please try again.')});
        }).promise();
    }

    var prevRowIndex;

    z.body.on('click', '.curation-unfeature', unfeatureGame)
    .on('click', '.curation-delete', deleteGame)
    .on('click', '.curation-disable', function() {
        moderateGame($(this), 'disable');
    }).on('click', '.curation-enable', function() {
        moderateGame($(this), 'approve');
    }).on('click', '.curation-feature', function() {
        $('.feature-game').addClass('show');
        $(this).addClass('show');
        z.body.trigger('decloak');
    }).on('mouseover', '.game-results li', function() {
        var $button = $(this).children('.feature-btn');
        $button.addClass('show');
    }).on('mouseout', '.game-results li', function() {
        var $button = $(this).children('.feature-btn');
        $button.removeClass('show');
    }).on('keyup', 'input[name=game-search]', function(e) {
        var $query = $(this).val();
        indexed.then(function(val) {
            worker.postMessage({
                type: 'search',
                data: $query
            });
        });
    }).on('click', '.feature-btn', function() {
        var $game = $(this).closest('li');
        var gameSlug = $game.data('gameSlug');
        featureGame(gameSlug).then(function() {
            z.body.trigger('cloak');
            addGameRow(gameSlug);
        }, function() {});
    }).on('dragstart', '.curation-entry', function() {
        prevRowIndex = $('.curation-entry').index(this);
    });

    return function(builder, args) {
        builder.start('admin/feature.html');

        builder.z('type', 'leaf curation');
        builder.z('title', gettext('Curation Dashboard'));

        builder.onload('featured-games', function(data) {
            if (data.length === 0) {
                $('#empty-message').show();
            }
            data.forEach(function(game) {
                var rowToAdd = nunjucks.env.render('admin/_curation-row.html', {game: game});
                $('.curation-table tbody').append(rowToAdd);
            });

            //enable drag and drop
            var sortable = new Sortable(document.querySelector('.curation-table tbody'), {
                handle: '.curation-draggable',

                onUpdate: function (evt){
                    var $movedRow = $(evt.item);
                    var slug = $movedRow.data('slug');
                    var rank = $('.curation-entry[data-slug="' + slug + '"]').index();

                    reorderGame(slug, rank).fail(function() {
                        $movedRow.detach();
                        //nth-child is not zero-based
                        if (prevRowIndex === 0) {
                            $('.curation-entry:nth-child(1)').before($movedRow);
                        } else {
                            var rowToInsertAfter = $('.curation-entry:nth-child(' + prevRowIndex + ')');
                            rowToInsertAfter.after($movedRow);
                        }
                    });
                }
            });
        });
    };
});
