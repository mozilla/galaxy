define('views/developer_dashboard', [], function() {
    return function(builder, args) {
        var user_id = args[0];
        builder.start('developers/developer-dashboard.html', {user_id: user_id}).done(function() {
        });

        builder.z('type', 'leaf profile');
        builder.z('title', gettext('User Profile'));
    };
});
