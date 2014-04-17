define('views/developer_dashboard', 
    ['log', 'notification', 'requests', 'urls', 'z'], 
    function(log, notification, requests, urls, z) {
    
    var console = log('developer-dashboard');

    function moderateGame($game, $button, deleted) {
        function setSpinning(spinning) {
            var newVisibility = spinning ? 'hidden' : 'visible';
            $button.children('.btn-text').css('visibility', newVisibility);
            if (spinning) {
                $button.append('<div class="spinner"></div>');
            } else {
                $button.children('.spinner').remove();
            }
        }
        setSpinning(true);

        var gameSlug = $game.data('gameSlug');
        var statusVerb = deleted ? 'delete' : 'disable';
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
                if (deleted) {
                    message = gettext('Deleted game: {game}', params);
                } else {
                    message = gettext('Disabled game: {game}', params);
                }
            } else {
                if (deleted) {
                    message = gettext('Failed to delete game: {game}', params);
                } else {
                    message = gettext('Failed to disable game: {game}', params);
                }
            }
            notification.notification({message: message});

            setSpinning(false);
            if (success) {
                // TODO: Animate this
                $game.remove();

                var $table = $('.developer-dashboard-table');
                if (!$table.find('tbody > tr').length) {
                    $table.hide();
                    $('#empty-message').show();
                }
            }
        }
    }

    z.body.on('click', '.developer-dashboard-delete', function() {
        var $this = $(this);
        var $game = $this.closest('[data-game-slug]');
        moderateGame($game, $this, true);
    }).on('click', '.developer-dashboard-disable', function() {
        var $this = $(this);
        var $game = $this.closest('[data-game-slug]');
        moderateGame($game, $this, false);
    });

    z.page.on('fragment_load_failed fragment_loaded', function(e) {
        var data = e.originalEvent.detail;
        if ((data.signature.id === 'gameList') &&
            (data.context.ctx.error === 403)) {
                $('#submit-new-game-btn').hide()
        }
    });

    return function(builder, args) {
        builder.start('developers/developer-dashboard.html');

        builder.z('type', 'leaf developer-dashboard');
        builder.z('title', gettext('My Games'));
    };
});
