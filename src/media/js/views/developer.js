define('views/developer', [], function() {
    return function(builder, args) {
        var dev_slug = args[0];
        builder.start('developers/profile.html', {dev_slug: dev_slug}).done(function() {
        });

        builder.z('type', 'leaf profile');
        builder.z('title', gettext('Developer Profile'));
    };
});
