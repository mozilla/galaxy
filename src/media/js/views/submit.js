define('views/submit', ['l10n', 'storage', 'z'], function(l10n, storage, z) {

    return function(builder) {
        builder.start('submit.html').done(function() {
        });

        builder.z('type', 'root');
        builder.z('title', gettext('Home'));
    };
});
