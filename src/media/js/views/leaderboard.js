define('views/leaderboard', 
    ['cache', 'l10n', 'log', 'notification', 'requests', 'utils', 'urls', 'z'], 
    function(cache, l10n, log, notification, requests, utils, urls, z) {

    function delBoard(game, slug) {
        return requests.del(urls.api.url('leaderboard', game, {
            slug: slug
        })).then(function(data) {
            notification.notification({message: gettext('Leaderboard deleted')});
        }, function(data) {
            notification.notification({message: gettext('Failed to delete leaderboard')});
            console.error(data);
        }).promise();
    }

    function createBoard(game, boardName, slug) {
        requests.post(urls.api.url('leaderboard', game), {
            name: boardName,
            slug: slug
        }).then(function(data) {
            notification.notification({message: gettext('Leaderboard created')});
            var boardUrl =  urls.api.url('leaderboard', [game]);
            cache.attemptRewrite(function(url) {
                return url === boardUrl;
            }, function(item) {
                item.push(data);
            });
            require('views').reload();
        }, function(data) {
            notification.notification({message: gettext('Failed to create leaderboard')});
            console.error(data);
        }); 
    }

    z.body.on('click', '.board-del', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $board = $this.closest('[data-board-slug]');
        var boardName = $board.find('.board-name').text();
        var boardSlug = $board.data('boardSlug');
        var gameSlug = $this.closest('[data-game-slug]').data('gameSlug');
        var msg = gettext('Do you want to remove {boardName}?', {boardName: boardName});
        if (window.confirm(msg)) {
            $board.hide();
            delBoard(gameSlug, boardSlug).then(function() {
                $board.remove();
            }, function() {
                $board.show();
            });
        }
    }).on('blur change keyup paste', '#leaderboard-create input[name=name]', function(e) {
        // NOTE: We're using `keyup` instead of `keypress` to detect when
        // the user tabs within this field.
        var $this = $(this);
        var $slug = $this.closest('form').find('[name=slug]');

        $slug.val(utils.slugify($this.val()));
    }).on('click', '.board-create', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $form = $this.closest('[data-game-slug]');
        var game = $form.data('gameSlug');
        var boardName = $form.find('[name=name]').val();
        var boardSlug = $form.find('[name=slug]').val();
        createBoard(game, boardName, boardSlug);
    });

    return function(builder, args) {
        var slug = args[0];
        builder.start('game/leaderboard.html', {slug: slug});

        builder.z('type', 'leaf');
        builder.z('title', gettext('Leaderboards'));
    }
});
