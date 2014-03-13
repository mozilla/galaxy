define('views/game_search', ['promise', 'search'], function(promise, search) {

    var indexed = index();

    function index() {
        return new Promise(function(resolve, reject) {
            window.addEventListener('message', function(e) {
                switch (e.data.type) {
                    case 'indexed':
                        return resolve();
                    case 'results':
                        // TODO: Render results
                        return resolve();
                }
            });
            
            window.postMessage({
                type: 'index',
                data: {
                    url: 'game.list',
                    fields: {
                        app_url: {boost: 25},
                        slug: {boost: 20},
                        name: {boost: 30}
                    },
                    ref: 'slug'
                }
            }, '*');
        });
    }

    return function(builder) {

        indexed.then(function() {

            builder.start('game/search.html');

            builder.z('type', 'leaf');
            builder.z('title', null);

            gettext('Search');
        });
    };
});
