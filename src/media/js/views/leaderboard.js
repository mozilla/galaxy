define('views/leaderboard', ['l10n', 'utils', 'z'], function(l10n, utils, z) {

    return function(builder, args) {
        builder.start('game/leaderboard.html');
        builder.z('title', gettext('Leaderboard'));
    }
});
