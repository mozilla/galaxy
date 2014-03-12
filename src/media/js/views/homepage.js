define('views/homepage', [], function() {

    return function(builder) {
        builder.start('homepage.html');

        builder.z('type', 'root');
        builder.z('title', null);
    };
});
