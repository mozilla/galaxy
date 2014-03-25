define('views/feature', 
    ['l10n', 'log', 'notification', 'templates', 'requests', 'urls', 'utils', 'z'], 
    function(l10n, log, notification, nunjucks, requests, urls, utils, z) {

    var gettext = l10n.gettext;

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
        // TODO: Maybe modify /featured endpoint to return newly featured game's game object so as to not make two requests
        requests.get(urls.api.url('game', [slug]))
        .done(function(gameData) {
            var rowToAdd = nunjucks.env.render('admin/_curation-row.html', {game: gameData});
            $('.curation-table tbody').append(rowToAdd);
        });

        $('#empty-message').hide();        
    }

    function showSearchResults(games) {
        $('.game-results').html(
            nunjucks.env.render('admin/game-results.html', {games: games})
        );
    }

    z.body.on('click', '.curation-unfeature', unfeatureGame)
    .on('click', '.curation-delete', deleteGame)
    .on('click', '.curation-disable', function() {
        moderateGame($(this), 'disable');
    }).on('click', '.curation-enable', function() {
        moderateGame($(this), 'approve');
    }).on('click', '.curation-feature', function() {
        $('.modal').addClass('show');
        $(this).addClass('show');
        z.body.trigger('decloak');
    }).on('mouseover', '.game-results li', function() {
        var $button = $(this).children('a.feature_game');
        $button.addClass('show');
    }).on('mouseout', '.game-results li', function() {
        var $button = $(this).children('a.feature_game');
        $button.removeClass('show');
    }).on('change keyup', 'input[name=game-search]', function(e) {
        // TODO: hook this up with local game searching index
    }).on('click', 'a.feature_game', function() {
        var $this = $(this);
        var $game = $this.closest('li');
        var gameSlug = $game.data('gameSlug');
        featureGame(gameSlug).then(function() {
            z.body.trigger('cloak');
            addGameRow(gameSlug);
        }, function() {});
    });

    return function(builder, args) {
        builder.start('admin/feature.html');

        builder.z('type', 'leaf curation');
        builder.z('title', gettext('Curation Dashboard'));

        builder.onload('featured-games', function(data) {
            data.forEach(function(game) {
                var rowToAdd = nunjucks.env.render('admin/_curation-row.html', {game: game});
                $('.curation-table tbody').append(rowToAdd);
            });
        });
    };
});
