define('views/settings', [], function() {
    return function(builder, args) {
        builder.start('settings.html').done(function() {
        });

        builder.z('type', 'leaf settings');
        builder.z('title', gettext('Settings'));
    };
});
