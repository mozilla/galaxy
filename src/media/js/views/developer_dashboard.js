define('views/developer_dashboard', 
    ['log', 'notification', 'requests', 'urls', 'z'], 
    function(log, notification, requests, urls, z) {
    
    var console = log('developer-dashboard');

    function moderateGame($game, $button, statusVerb) {
        function setSpinning(spinning) {
            var newVisibility = spinning ? 'hidden' : 'visible';
            $button.children('.btn-text').css('visibility', newVisibility);

            var isBtn = $button.hasClass('btn');
            if (!isBtn) {
                // Need to use spinner-container class to get spinner to be
                // positioned and sized correctly
                $button.toggleClass('spinner-container', spinning);
            }

            if (spinning) {
                // Use alternate (dark) spinner for non-bordered buttons
                var spinnerClasses = 'spinner' + (isBtn ? '' : ' alt');
                $button.append('<div class="'+ spinnerClasses + '"></div>');
            } else {
                $button.children('.spinner').remove();
            }
        }
        setSpinning(true);

        var gameSlug = $game.data('gameSlug');
        requests.post(urls.api.url('game.moderate', [gameSlug, statusVerb]))
                .done(function(data) {
                    gameModerated(true);
                }).fail(function(err) {
                    console.error('Failed to moderate game; error:', err);
                    gameModerated(false);
                });

        function gameModerated(success) {
            var gameTitle = $game.data('gameTitle');
            var message;
            var params = {game: gameTitle};
            if (success) {
                if (statusVerb === 'delete') {
                    message = gettext('Deleted game: {game}', params);
                } else {
                    message = gettext('Disabled game: {game}', params);
                }
            } else {
                if (statusVerb === 'delete') {
                    message = gettext('Failed to delete game: {game}', params);
                } else {
                    message = gettext('Failed to disable game: {game}', params);
                }
            }
            notification.notification({message: message});

            setSpinning(false);
            if (success) {
                // TODO: Animate this
                if (statusVerb === 'delete') {
                    $game.remove();
                } else {
                    rawr = $game
                    $game.children(".cell-container")
                        .not(".status-container").remove();
                    $game.children(".status-container").attr("colspan", "3");
                }

                var $table = $('.developer-dashboard-table');
                if (!$table.find('tbody > tr').length) {
                    $table.hide();
                    $('#empty-message').show();
                }
            }
        }
    }

    z.body.on('click', '.developer-dashboard-buttons [data-status-verb]', function() {
        var $this = $(this);
        var $game = $this.closest('[data-game-slug]');
        var statusVerb = $this.data('statusVerb');
        moderateGame($game, $this, statusVerb);
    });

    z.page.on('fragment_load_failed fragment_loaded', function(e) {
        var data = e.originalEvent.detail;
        if ((data.signature.id === 'gameList') &&
            (data.context.ctx.error === 403)) {
                $('#submit-new-game-btn').hide();
        }
    });

    return function(builder, args) {
        builder.start('developers/developer-dashboard.html');

        builder.z('type', 'leaf developer-dashboard');
        builder.z('title', gettext('My Games'));
    };
});
