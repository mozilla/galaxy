define('views/genre', ['l10n', 'settings', 'utils', 'z'], function(l10n, settings, utils, z) {

    var gettext = l10n.gettext;

    return function(builder, args) {
        var slug = args[0];
        builder.start('genre/main.html', {slug: slug});

        builder.z('type', 'genre');
        builder.z('title', settings.genres[slug]);
        builder.z('pagetitle', gettext('Genre'));
    };
});
