define('views/leaderboard', 
	['l10n', 'log', 'utils', 'z', 'urls', 'requests', 'notification'], 
	function(l10n, log, utils, z, urls, requests, notification) {

	function delBoard(game, slug) {
		requests.del(urls.api.url('leaderboard.dev', game), {
			slug: slug
		}).done(function(data) {
			notification.notification({message: gettext('Leaderboard deleted')});
			return console.log(data);
		}).fail(function(data) {
			notification.notification({message: gettext('Failed to delete leaderboard')});
			return console.error(data);
		});
	}

	function createBoard(game, boardName, slug) {
		requests.post(urls.api.url('leaderboard.dev', game), {
			name: boardName,
			slug: slug
		}).done(function(data) {
			notification.notification({message: gettext('Leaderboard Created')});
			return console.log(data);
		}).fail(function(data) {
			notification.notification({message: gettext('Failed to create leaderboard')});
			return console.error(data);
		});	
		window.location.reload(true);
	}

	z.body.on('click', '.board-del', function(e) {
		var $board = $(this).closest('[data-board-slug]');
		var boardName = $board.find(".board-link").text();
		var boardSlug = $board.data("boardSlug");
		var gameSlug = $board.data("gameSlug");
		var alert = gettext('Do you want to remove {boardName}', {boardName: boardName});
		if (window.confirm(alert)) {
			$board.remove();
			delBoard(gameSlug, boardSlug);
		}
	}).on('submit', '.board-create', function(e) {
		e.preventDefault();
		var game = $(this).data("gameSlug");
		var boardName = $(this).find(".name").val();
		var boardSlug = $(this).find(".slug").val();
		createBoard(game, boardName, boardSlug);
	});

    return function(builder, args) {
    	var slug = args[0];

        builder.start('game/leaderboard.html', {slug: slug});
        builder.z('type', 'leaf');
        builder.z('title', gettext('Leaderboard'));
    }
});
