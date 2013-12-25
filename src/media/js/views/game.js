define('views/game', ['l10n', 'utils', 'z'], function(l10n, utils, z) {

    z.body.on('click', '.play', function(e) {
        var $this = $(this);
        e.preventDefault();
        window.open($this.data('appUrl'));
    });

    var gettext = l10n.gettext;

    return function(builder, args) {
        var slug = args[0];
        builder.start('game/main.html', {slug: slug});

        builder.onload('game-data', function(game) {
            builder.z('title', utils.translate(game.name));
        });

        builder.z('type', 'game');
        builder.z('title', gettext('Loading...'));
        builder.z('pagetitle', gettext('App Details'));
    };
});
