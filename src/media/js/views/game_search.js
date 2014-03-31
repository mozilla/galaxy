define('views/game_search', ['promise',  'urls', 'search_worker'], function(promise, urls, worker) {

    

    return function(builder) {

        indexed.then(function() {

            builder.start('game/search.html');

            builder.z('type', 'leaf');
            builder.z('title', gettext('Search'));

        });
    };
});
