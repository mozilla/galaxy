define('routes_api', [], function() {
    return {
        'login': '/user/login',
        'game': '/data/game/{0}.json',
        'game.submit.media': '/game/submit/media',
        'user.search': '/user/search',
        'user.friends': '/user/friends',
        'user.friends.request': '/user/friends/request',
        'user.friends.requests': '/user/friends/requests',
        'user.friends.accept': '/user/friends/accept',
        'user.friends.ignore': '/user/friends/ignore',
        'user.friends.unfriend': '/user/friends/unfriend',
        'user.profile': '/user/profile'
    };
});
