define('routes_api', [], function() {
    return {
        'leaderboards': '/game/{0}/boards',
        'leaderboard.manage': '/game/{0}/board',
        'login': '/user/login',
        'game': '/game/{0}/detail',
        'game.submit': '/game/submit',
        'game.edit': '/game/edit',
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
