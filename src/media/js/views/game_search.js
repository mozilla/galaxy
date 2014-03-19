define('views/game_search', ['promise',  'urls', 'worker'], function(promise, urls, worker) {

    var indexed = index();

    function index() {
        return new Promise(function(resolve, reject) {
            worker.addEventListener('message', function(e) {
                switch (e.data.type) {
                    case 'indexed':
                        console.log("Games indexed.");
                        return resolve();
                    case 'results':
                        // TODO: Render Results
                        return resolve();
                }
            });

            worker.postMessage({
                type: 'index',
                data: {
                    url: urls.api.url('game.list'),
                    fields: {
                        app_url: {boost: 25},
                        slug: {boost: 20},
                        name: {boost: 30}
                    },
                    ref: 'slug'
                }
            });
        });
    }

    return function(builder) {

        indexed.then(function() {

            builder.start('game/search.html');

            builder.z('type', 'leaf');
            builder.z('title', gettext('Search'));

        });
    };
});
