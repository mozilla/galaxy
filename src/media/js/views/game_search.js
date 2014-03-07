define('views/game_search', ['requests', 'urls'], function(requests, urls) {

	/* Load game data on first request */
	requests.get(urls.api.url('game.list')).done(function (data) {
		// TODO: Compress results
		// TODO: Cache results
		// TODO: Index results
	});

    return function(builder) {
        builder.start('game/search.html');

        builder.z('type', 'leaf game');
        builder.z('title', null);
    };
});


