define('routes_api', [], function() {
    return {
        'leaderboard': '/game/{0}/board',
        'login': '/user/login',
        'feedback': '/feedback',
        'game': '/game/{0}/detail',
        'game.edit': '/game/edit',
        'game.list': '/game/list',
        'game.moderate': '/game/{0}/{1}',
        'game.submit': '/game/submit',
        'game.submit.media': '/game/submit/media',
        'user.search': '/user/search',
        'user.friends': '/user/friends',
        'user.friends.request': '/user/friends/request',
        'user.friends.requests': '/user/friends/requests',
        'user.friends.accept': '/user/friends/accept',
        'user.friends.ignore': '/user/friends/ignore',
        'user.friends.unfriend': '/user/friends/unfriend',
        'user.profile': '/user/profile',
        'user.purchase': '/user/purchase'
    };
});
