define('views/user', [], function() {
    return function(builder) {
        builder.start('users/profile.html').done(function() {
        });

        builder.z('type', 'leaf user');
        builder.z('title', gettext('User Profile'));
    };
});
