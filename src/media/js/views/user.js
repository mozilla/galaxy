define('views/user', ['z'], function(z) {

    function requestFriend(user_id) {
        requests.post(urls.api.url('user.friends.request'), {
            recipient: user_id
        }).done(function(data) {
            notification.notification({message: gettext('Friend request sent')});
            return console.log(data);
        }).fail(function(data) {
            notification.notification({message: gettext('Failed to submit friend request')});
            return console.error(data);
        });
    }

    z.body.on('click', '.add-friend', function() {
        var $friend = $(this).closest('[data-user-id]');
        var username = $friend.find('.profile-link').text();
        var msg = gettext('Friend requested: {username}', {username: username});
        notification.notification({message: msg});
        requestFriend($friend.data('userId'));
        $friend.remove();
    });

    return function(builder, args) {
        var user_id = args[0];
        builder.start('users/profile.html', {user_id: user_id}).done(function() {
        });

        builder.z('type', 'leaf profile');
        builder.z('title', gettext('User Profile'));
    };
});
