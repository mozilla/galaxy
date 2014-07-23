(function() {

// Please leave quotes around keys! They're needed for Space Heater.
var routes = [
    {'pattern': '^/$', 'view_name': 'homepage'},
    {'pattern': '^/submit$', 'view_name': 'submit'},
    {'pattern': '^/feedback$', 'view_name': 'feedback'},
    {'pattern': '^/friends$', 'view_name': 'friends'},
    {'pattern': '^/game/([^/<>"\']+)/detail/?$', 'view_name': 'game'},
    {'pattern': '^/game/([^/<>"\']+)/edit/?$', 'view_name': 'edit_game'},
    {'pattern': '^/genre/([^/<>"\']+)/?$', 'view_name': 'genre'},
    {'pattern': '^/user/([^/<>"\']+)/?$', 'view_name': 'user'},
    {'pattern': '^/settings$', 'view_name': 'settings'},
    {'pattern': '^/leaderboard/([^/<>"\']+)/?$', 'view_name': 'leaderboard'},
    {'pattern': '^/developer/([^/<>"\']+)/?$', 'view_name': 'developer'},
    {'pattern': '^/review$', 'view_name': 'review'},
    {'pattern': '^/featured$', 'view_name': 'feature'},
    {'pattern': '^/developerDashboard$', 'view_name': 'developer_dashboard'},

    {'pattern': '^/debug$', 'view_name': 'debug'}
];
window.routes = routes;

// Only `require.js` has `window.require.defined`, so we can use this to
// sniff for whether we're using the minified bundle or not. (In production
// we use commonplace's `amd.js`.)
if (window.require.hasOwnProperty('defined')) {
    // The minified JS bundle doesn't need some dev-specific JS views.
    // Those go here.
    routes = routes.concat([
        {'pattern': '^/tests$', 'view_name': 'tests'}
    ]);
}


define(
    'routes',
    routes.map(function(i) {return 'views/' + i.view_name;}),
    function() {
        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var view = require('views/' + route.view_name);
            route.view = view;
        }
        return routes;
    }
);

})();
