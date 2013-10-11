define('views/homepage', ['l10n'], function(l10n) {

    var gettext = l10n.gettext;

    return function(builder) {
        builder.start('homepage.html');

        builder.z('type', 'root');
        builder.z('title', gettext('Home'));
    };
});
