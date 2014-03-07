define('views/developer_dashboard', ['z'], function(z) {

	z.body.on('click', '.myGames-delete', function() {
        var $this = $(this);
        var $game = $this.closest('[data-game-slug]');
        console.log('delete ' + $game.data('gameSlug'));
    }).on('click', '.myGames-disable', function() {
        var $this = $(this);
        var $game = $this.closest('[data-game-slug]');
        console.log('disable ' + $game.data('gameSlug'));
    });

    return function(builder, args) {
        var user_id = args[0];
        builder.start('developers/developer-dashboard.html');

        builder.z('type', 'leaf developer-dashboard');
        builder.z('title', gettext('My Games'));
    };
});
