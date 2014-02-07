define('views/leaderboard', 
	['l10n', 'log', 'utils', 'z', 'urls', 'requests', 'notification'], 
	function(l10n, log, utils, z, urls, requests, notification) {

	var console = log("leaderboard");

	function delboard(slug) {
		console.log(slug);
		console.log(urls.api.url('leaderboard.dev'));

		requests.del(urls.api.url('leaderboard.dev'), {
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
		console.log(boardSlug);
		var alert = gettext('Do you want to remove {boardName}', {boardName: boardName});
		if (window.confirm(alert)) {
			delboard(boardSlug);
		}
	});

    return function(builder, args) {
    	var slug = args[0];

        builder.start('game/leaderboard.html', {slug: slug});
        builder.z('title', gettext('Leaderboard'));
    }
});
