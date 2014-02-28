define('views/review', 
    ['format', 'log', 'notification', 'requests', 'urls', 'z'], 
    function(format, log, notification, requests, urls, z) {
    
    var console = log('review');

    function submitReview($game, accepted) {
        var gameSlug = $game.data('gameSlug');
        var statusVerb = accepted ? 'approve' : 'reject';
        requests.post(urls.api.url('game.moderate', [gameSlug, statusVerb]))
                .done(function(data) {
                    reviewSubmitted(true);
                }).fail(function(err) {
                    console.error('Failed to submit review; error:', err);
                    reviewSubmitted(false);
                });

        function reviewSubmitted(success) {
            var gameTitle = $game.data('gameTitle');
            var message;
            var fmt = format.format;
            if (success) {
                var status = gettext(accepted ? 'approved' : 'rejected');
                var locMessage = gettext('{game} was successfully {status}');
                message = fmt(locMessage, {game: gameTitle, status: status});
            } else {
                var locMessage = gettext('Failed to {statusVerb} {game}');
                message = fmt(locMessage, {game: gameTitle, statusVerb: statusVerb});
            }
            notification.notification({message: message});

            if (success) {
                // TODO: Animate this
                $game.remove();

                var $table = $('.review-table');
                if (!$table.find('tbody > tr').length) {
                    $table.hide();
                    $('#empty-message').show();
                }
            }
        }
    }

    z.body.on('click', '.review-accept', function() {
        var $game = $(this).closest('[data-game-slug]');
        submitReview($game, true);
    }).on('click', '.review-reject', function() {
        var $game = $(this).closest('[data-game-slug]');
        submitReview($game, false);
    });

    return function(builder, args) {
        builder.start('admin/review.html').done(function() {
        });

        builder.z('type', 'leaf review');
        builder.z('title', gettext('Review'));
    };
});
