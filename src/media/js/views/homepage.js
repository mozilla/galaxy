define('views/homepage', ['featured-games'], function(fg) {

    return function(builder) {
        builder.start('homepage.html');

        builder.z('type', 'root');
        builder.z('title', null);
        fg.attachScrollEvents();
    };
});
