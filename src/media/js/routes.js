(function() {

// Please leave quotes around keys! They're needed for Space Heater.
var routes = [
    {'pattern': '^/$', 'view_name': 'homepage'},
    {'pattern': '^/submit$', 'view_name': 'submit'},
    {'pattern': '^/friends$', 'view_name': 'friends'},
    {'pattern': '^/game/([^/<>"\']+)/?$', 'view_name': 'game'},
    {'pattern': '^/genre/([^/<>"\']+)/?$', 'view_name': 'genre'},
    {'pattern': '^/user/([^/<>"\']+)/?$', 'view_name': 'user'},
    {'pattern': '^/settings$', 'view_name': 'settings'},

    {'pattern': '^/tests$', 'view_name': 'tests'},
    {'pattern': '^/debug$', 'view_name': 'debug'}
];
window.routes = routes;

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
