define('views/user', [], function() {
    return function(builder, args) {
        var user_id = args[0];
        builder.start('users/profile.html', {user_id: user_id});

        builder.z('type', 'leaf profile');
        builder.z('title', gettext('User Profile'));
    };
});
