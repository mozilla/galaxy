define('views/review', 
    ['format', 'log', 'notification', 'requests', 'urls', 'z'], 
    function(format, log, notification, requests, urls, z) {
    
    var console = log('review');

    function submitReview($game, accepted) {
        var gameSlug = $game.data('gameSlug');
        var statusVerb = accepted ? 'approve' : 'reject';
        requests.post(urls.api.url('game.moderate', [gameSlug, statusVerb]), {})
                .done(function(data) {
                    reviewSubmitted(true);
                }).fail(function(err) {
                    console.error('Failed to submit review; error:', err);
                    reviewSubmitted(false);
                });

        function reviewSubmitted(success) {
            var gameTitle = $game.data('gameTitle');
            var message;
            if (success) {
                var status = gettext(accepted ? 'approved' : 'rejected');
                message = format.format(gettext('{game} was successfully {status}'), {game: gameTitle, status: status});
            } else {
                message = format.format(gettext('Failed to {statusVerb} {game}'), {game: gameTitle, statusVerb: statusVerb});
            }
            notification.notification({message: message});

            if (success) {
                // TODO: Animate this ($.slideUp()?)
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
