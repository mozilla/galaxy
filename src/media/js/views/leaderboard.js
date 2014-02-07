define('views/leaderboard', 
	['l10n', 'log', 'utils', 'z', 'urls', 'requests', 'notification'], 
	function(l10n, log, utils, z, urls, requests, notification) {

	var console = log("leaderboard");

	function delboard(game, slug) {
		console.log(slug);
		console.log(urls.api.url('leaderboard.dev', game));

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

	z.body.on('click', '.board-del', function(e) {
		var $board = $(this).closest('[data-board-slug]');
		var boardName = $board.find(".board-link").text();
		var boardSlug = $board.data("boardSlug");
		var gameSlug = $board.data("gameSlug");
		console.log(gameSlug);
		var alert = gettext('Do you want to remove {boardName}', {boardName: boardName});
		if (window.confirm(alert)) {
			delboard(gameSlug, boardSlug);
		}
	});

    return function(builder, args) {
    	var slug = args[0];

        builder.start('game/leaderboard.html', {slug: slug});
        builder.z('type', 'leaf friends');
        builder.z('title', gettext('Leaderboard'));
    }
});
