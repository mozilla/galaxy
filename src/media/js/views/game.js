define('views/game', ['l10n', 'utils', 'z'], function(l10n, utils, z) {

    z.body.on('click', '.play', function(e) {
        e.preventDefault();
        window.open('http://localhost:8000');
    });

    var gettext = l10n.gettext;

    return function(builder) {
        builder.start('game/main.html').done(function() {
        });

        // builder.onload('game-data', function(game) {
        //     builder.z('title', utils.translate(game.name));
        // });

        builder.z('type', 'game');
        // builder.z('title', gettext('Loading...'));
        builder.z('title', gettext('Bastaball'));
        builder.z('pagetitle', gettext('App Details'));
    };
});
