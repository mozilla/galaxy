define('views/developer_dashboard', 
    ['notification', 'requests', 'urls', 'z'], function(notification, requests, urls, z) {

    function moderateGame($game, deleted) {
        var gameSlug = $game.data('gameSlug');
        var statusVerb = deleted ? 'delete' : 'disable';
        requests.post(urls.api.url('game.moderate', [gameSlug, statusVerb]))
                .done(function(data) {
                    actionSubmitted(true);
                }).fail(function(err) {
                    console.error('Failed to submit review; error:', err);
                    actionSubmitted(false);
                });

        function actionSubmitted(success) {
            var gameTitle = $game.data('gameTitle');
            var message;
            var params = {game: gameTitle};
            if (success) {
                if (deleted) {
                    message = gettext('Deleted game: {game}', params);
                } else {
                    message = gettext('Disabeled game: {game}', params);
                }
            } else {
                if (deleted) {
                    message = gettext('Failed to delete game: {game}', params);
                } else {
                    message = gettext('Failed to disable game: {game}', params);
                }
            }
            notification.notification({message: message});

            if (success && deleted) {
                $game.remove();

                var $table = $('.my-games-table');
                if (!$table.find('tbody > tr').length) {
                    $table.hide();
                    $('#empty-message').show();
                }
            }
        }
    }

    z.body.on('click', '.my-games-delete', function() {
        var $this = $(this);
        var $game = $this.closest('[data-game-slug]');
        moderateGame($game, true);
    }).on('click', '.my-games-disable', function() {
        var $this = $(this);
        var $game = $this.closest('[data-game-slug]');
        moderateGame($game, false);
    });

    return function(builder, args) {
        var user_id = args[0];
        builder.start('developers/developer-dashboard.html');

        builder.z('type', 'leaf developer-dashboard');
        builder.z('title', gettext('My Games'));
    };
});
