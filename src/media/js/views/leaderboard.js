define('views/leaderboard', 
    ['l10n', 'log', 'utils', 'z', 'urls', 'requests', 'notification'], 
    function(l10n, log, utils, z, urls, requests, notification) {

    function delBoard(game, slug) {
        requests.del(urls.api.url('leaderboard.manage', game, {
            slug: slug
        })).done(function(data) {
            notification.notification({message: gettext('Leaderboard deleted')});
            return console.log(data);
        }).fail(function(data) {
            notification.notification({message: gettext('Failed to delete leaderboard')});
            return console.error(data);
        });
    }

    function createBoard(game, boardName, slug) {
        requests.post(urls.api.url('leaderboard.manage', game), {
            name: boardName,
            slug: slug
        }).done(function(data) {
            notification.notification({message: gettext('Leaderboard created')});
            return console.log(data);
        }).fail(function(data) {
            notification.notification({message: gettext('Failed to create leaderboard')});
            return console.error(data);
        }); 
        window.location.reload(true);
    }

    z.body.on('click', '.board-del', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $board = $this.closest('[data-board-slug]');
        var boardName = $board.find('.board-link').text();
        var boardSlug = $board.data('boardSlug');
        var gameSlug = $board.data('gameSlug');
        var msg = gettext('Do you want to remove {boardName}?', {boardName: boardName});
        if (window.confirm(msg)) {
            $board.remove();
            delBoard(gameSlug, boardSlug);
        }
    }).on('click', '.board-create', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $form = $this.closest('[data-game-slug]');
        var game = $form.data('gameSlug');
        var boardName = $form.find('.name').val();
        var boardSlug = $form.find('.slug').val();
        console.log(gettext("game: {game}; boardName: {boardName}; boardSlug: {boardSlug}", {
            game: game,
            boardName: boardName,
            boardSlug: boardSlug
        }))
        createBoard(game, boardName, boardSlug);
    });

    return function(builder, args) {
        var slug = args[0];

        builder.start('game/leaderboard.html', {slug: slug});
        builder.z('type', 'leaf');
        builder.z('title', gettext('Leaderboard'));
    }
});
