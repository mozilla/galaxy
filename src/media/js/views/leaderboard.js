define('views/leaderboard', ['l10n', 'log', 'utils', 'z'], function(l10n, log, utils, z) {

    return function(builder, args) {
    	var slug = args[0];

        builder.start('game/leaderboard.html', {slug: slug});
        builder.z('title', gettext('Leaderboard'));
    }
});
