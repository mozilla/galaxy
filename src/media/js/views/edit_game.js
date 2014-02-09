define('views/edit_game', 
        ['l10n', 'utils', 'log', 'z', 'resize-textarea'], 
        function(l10n, utils, log, z, rt) {

    var gettext = l10n.gettext;
    
    return function(builder, args) {
        var slug = args[0];
        builder.start('game/edit.html', {slug: slug}).done(function() {
            rt.attach();
        });
        
        builder.z('type', 'leaf game');

        builder.onload('game-data', function(game) {
            builder.z('title', utils.translate(game.name));
        });
    };
});
