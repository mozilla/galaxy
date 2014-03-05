define('views/user', 
    ['notification', 'requests', 'urls', 'z'], 
    function(notification, requests, urls, z) {

    function requestFriend(user_id) {
        return requests.post(urls.api.url('user.friends.request', {
            recipient: user_id
        })).then(function(data) {
            notification.notification({message: gettext('Friend request sent')});
        }, function(data) {
            notification.notification({message: gettext('Failed to submit friend request')});
            console.error(data);
        }).promise();
    }

    z.body.on('click', '.request-friend', function() {
        var $this = $(this);
        $this.hide();
        requestFriend($this.data('userId')).then(function() {
            $this.remove();
        }, function() {
            $this.show();
        });
    });

    return function(builder, args) {
        var user_id = args[0];
        builder.start('users/profile.html', {user_id: user_id});

        builder.z('type', 'leaf profile');
        builder.z('title', gettext('User Profile'));
    };
});
