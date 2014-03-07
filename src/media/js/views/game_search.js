
define('views/game_search', ['search'], function(search) {

	var indexed = index();

	function index() {
		var promise = new Promise(function(resolve, reject) {
			addEventListener('message', function(e) {
				switch (e.data.type) {
					case 'indexed':
						return resolve();
					case 'results':
						// TODO: Render results
						return resolve();
				}
			});
			
			postMessage({
				type: 'index',
				data: {
					url: 'game.list',
					fields: {
						app_url: {boost: 25},
						slug: {boost: 20},
						name: {boost: 20}
					},
					ref: 'slug'
				}
			}, '*');
		});
		
		return promise;
	}

    return function(builder) {

    	indexed.then(function() {

    		builder.start('game/search.html');

        	builder.z('type', 'leaf game');
        	builder.z('title', null);
    	});
    };
});


