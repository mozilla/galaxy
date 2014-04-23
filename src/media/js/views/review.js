define('views/review', 
    ['format', 'log', 'notification', 'requests', 'urls', 'utils', 'z'],
    function(format, log, notification, requests, urls, utils, z) {
    
    var console = log('review');

    function successMessage(statusVerb, game) {
        var params = {game: game};
        switch (statusVerb) {
            case 'approve': return gettext('Approved game: {game}', params);
            case 'reject':  return gettext('Rejected game: {game}', params);
            case 'disable': return gettext('Disabled game: {game}', params);
            case 'delete':  return gettext('Deleted game: {game}', params);
            default:        return '';
        }
    }
    function failureMessage(statusVerb, game) {
        var params = {verb: statusVerb, game: game};
        if (statusVerb) {
            return gettext('Failed to {verb} game: {game}', params);
        }
        return '';
    }
    function invalidMessage(statusVerb, game) {
        var params = {verb: statusVerb, game: game};
        if (statusVerb) {
            return gettext('{game} is already {verb}d', params); 
        }
        return '';
    }

    function submitStatusChange($game, $button, statusVerb) {
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
                    statusSubmitted(true);
                }).fail(function(xhr, err, statusCode, resp) {
                    console.error('Failed to submit review; error:', resp.error);
                    statusSubmitted(false);
                });

        function statusSubmitted(success) {
            var gameTitle = $game.data('gameTitle');
            var message = (success ? successMessage : failureMessage)(statusVerb, gameTitle);
            notification.notification({message: message});

            setSpinning(false);
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

    z.body.on('click', '.review-buttons [data-status-verb]', function() {
        var $this = $(this);
        var $game = $this.closest('[data-game-slug]');
        var statusVerb = $this.data('statusVerb');
        var currentStatus = $('#select-status').val();
        if (currentStatus.indexOf(statusVerb) > -1) {
            var message = invalidMessage(statusVerb, $game.data('gameTitle'));
            notification.notification({message: message});
        } else {
            submitStatusChange($game, $this, statusVerb);
        }
    }).on('change', '#select-status', function() {
        var params = {status: this.value};
        z.page.trigger('navigate', utils.urlparams(urls.reverse('review'), params));
    });

    z.page.on('fragment_load_failed fragment_loaded', function(e) {
        var data = e.originalEvent.detail;
        if (data.signature.id === 'gameList') {
            var $select = $('#select-status');
            var unauthorized = data.context.ctx.error === 403;
            unauthorized ? $select.hide() : $select.show();
        }
    });

    return function(builder, args) {
        var status = utils.getVars().status || 'pending';
        builder.start('admin/review.html', {status: status})
            .done(updateStatus)
            .fail(updateStatus);

        function updateStatus() {
            $('#select-status').val(status);
        }

        builder.z('type', 'leaf review');
        builder.z('title', gettext('Reviewer Dashboard'));
    };
});
