define('views/developer_dashboard', [], function() {
    return function(builder, args) {
        var user_id = args[0];
        builder.start('developers/developer-dashboard.html');

        builder.z('type', 'leaf developer-dashboard');
        builder.z('title', gettext('My Games'));
    };
});
