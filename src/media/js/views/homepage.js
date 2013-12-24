define('views/homepage', [], function() {

    return function(builder) {
        builder.start('homepage.html').done(function() {
        });

        builder.z('type', 'root');
        // builder.z('title', gettext('Home'));
    };
});
