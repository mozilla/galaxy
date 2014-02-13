define('views/edit_game', 
        ['l10n', 'utils', 'log', 'z'], 
        function(l10n, utils, log, z) {

    var gettext = l10n.gettext;

    return function(builder, args) {
        var slug = args[0];
        builder.start('game/edit.html', {slug: slug}).done(function() {
            
        });
        
        builder.z('type', 'leaf game');

        builder.onload('game-data', function(game) {
            builder.z('title', utils.translate(game.name));
        });
    };
});
