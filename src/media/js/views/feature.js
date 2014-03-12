define('views/feature', 
    ['l10n', 'log', 'notification', 'templates', 'requests', 'urls', 'z', 'nunjucks.compat'], 
    function(l10n, log, notification, nunjucks, requests, urls, z) {
    
    var gettext = l10n.gettext,
    errorMsg = "An error occured. Please try again.";

    // Send request to featured endpoint to unfeature
    function unFeatureGame() {
        var gameSlug = $(this).parent().data('slug');

        requests.del(urls.api.url('game.featured', [], {
            game: gameSlug
        })).done(function(data) {
            notification.notification({message: gettext("Game unfeatured.")});
            removeGameRow(gameSlug);
        }).fail(function() {
            notification.notification({message: gettext(errorMsg)});
        });
    }

    //TODO: Hook up with Front-end
    function FeatureGame() {
        var gameSlug = $(this).parent().data('slug');

        requests.post(urls.api.url('game.featured'), {
            game: gameSlug
        }).done(function(data) {
            notification.notification({message: gettext("Game featured.")});
            addGameRow(gameSlug);
        }).fail(function() {
            notification.notification({message: gettext(errorMsg)});
        });
    }

    //Send request to moderate endpoint for deletion
    function deleteGame() {
        var gameSlug = $(this).parent().data('slug');

        if (window.confirm(gettext("Are you sure you want to delete this game?"))) { 
            requests.post(urls.api.url('game.moderate', [gameSlug, 'delete'])).done(function(data) {
                notification.notification({message: gettext("Game deleted.")});
                removeGameRow(gameSlug);
            }).fail(function() {
                notification.notification({message: gettext(errorMsg)});
            });
        }
    }

    // Send request to moderate endpoint
    function moderateGame($this, action) {
        var gameSlug = $this.parent().data('slug');

        requests.post(urls.api.url('game.moderate', [gameSlug, action])).done(function(data) {
            notification.notification({message: gettext("Game status successfully changed.")});
            if (action === 'disable') {
                //change status to disabled
                $(".game-status[data-slug="+ gameSlug +"]").text("Disabled")
                .removeClass('public-game-status').addClass('private-game-status');
                // change button
                $this.removeClass('curation-disable').addClass('curation-enable').text(gettext('Enable'));
            } else if (action === 'approve') {
                //change status to disabled
                $(".game-status[data-slug="+ gameSlug +"]").text("Public")
                .removeClass('private-game-status').addClass('public-game-status');
                // change button
                $this.removeClass('curation-enable').addClass('curation-disable').text(gettext('Disable'));
            }
        }).fail(function() {
            notification.notification({message: gettext(errorMsg)});
        });
    }

    // Remove table representing game with specified slug
    function removeGameRow(slug) {
        var $row = $('tr[data-slug=' + slug + ']');
        $row.remove();
        
        // If no more games, hide table and show message
        if ($('.curation-table tr').length === 0) {
            $('#empty-message').show();
            $('.curation-table').hide();
        }
    }

    function addGameRow(slug) {
        // Get Game Details
        // TODO: Maybe modify /featured endpoint to return newly featured game's game object so as to not make two requests
        requests.get(urls.api.url('game', [slug]))
        .done(function(gameData) {
            nunjucks.env.cache = nunjucks.templates;
            var rowToAdd = nunjucks.env.render('admin/_curation-row.html', {game: gameData});
            $('.curation-table tbody').append(rowToAdd);
        });

        $('#empty-message').hide();        
    }

    z.body.on('click', '.curation-unfeature', unFeatureGame)
    .on('click', '.curation-delete', deleteGame)
    .on('click', '.curation-disable', function() {
        moderateGame($(this), 'disable');
    }).on('click', '.curation-enable', function() {
        moderateGame($(this), 'approve');
    });

    return function(builder, args) {
        builder.start('admin/feature.html');

        builder.z('type', 'leaf curation');
        builder.z('title', gettext('Curation Dashboard'));

    };
});
