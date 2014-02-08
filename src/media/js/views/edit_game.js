define('views/edit_game', ['l10n', 'utils'], function(l10n, utils) {

    var gettext = l10n.gettext;

    return function(builder, args) {
    	var slug = args[0];
        builder.start('game/edit.html', {slug: slug});

        builder.z('type', 'leaf game');
        builder.z('title', gettext('Edit Game'));

        builder.onload('game-data', function(game) {
        	var title = 'Edit' + utils.translate(game.name);
            builder.z('title', title);
        });
    };
});
