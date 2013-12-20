define('views/friends',
       ['cache', 'l10n', 'log', 'notification', 'requests', 'templates', 'urls', 'utils', 'z'],
       function(cache, l10n, console, notification, requests, nunjucks, urls, utils, z) {

    var console = require('log')('friends');
    var gettext = l10n.gettext;

    function searchUser($this) {
        var $q = $this.find('[name=q]');
        var $results = $('.user-results');

        $q.data('searched', $q.val());

        requests.get(utils.urlparams(urls.api.url('user.search'), {
            q: $q.val()
        })).done(function(data) {
            if (data.error) {
                $results.html('');
                return;
            }
            $results.html(
                nunjucks.env.render('friends/search-results.html', {data: data})
            );
        }).fail(function() {
            $results.html('');
        });
    }

    function requestFriend(user_id) {
        requests.post(urls.api.url('user.friends.request'), {
            recipient: user_id
        }).done(function(data) {
            if (!data || data.error) {
                var msg = gettext('Failed to submit friend request');
                notification.notification({message: msg});
                return console.error(data.error);
            }
            z.page.trigger('reload_chrome');
            return console.log(data);
        }).fail(function(data) {
            var msg = gettext('Failed to submit friend request');
            notification.notification({message: msg});
            return console.error(data);
        });
    }

    function acceptFriend(user_id) {
        requests.post(urls.api.url('user.friends.accept'), {
            acceptee: user_id
        }).done(function(data) {
            if (!data || data.error) {
                var msg = gettext('Failed to accept friend request');
                notification.notification({message: msg});
                return console.error(data.error);
            }
            // TODO: Rewrite cache to just add single friend.
            cache.bust(urls.api.url('user.friends'));
            // TODO: Rewrite cache to just remove single friend.
            cache.bust(urls.api.url('user.friends.requests'));
            z.body.trigger('reload');
            return console.log(data);
        }).fail(function(data) {
            var msg = gettext('Failed to accept friend request');
            notification.notification({message: msg});
            return console.error(data);
        });
    }

    function ignoreFriend(user_id) {
        requests.post(urls.api.url('user.friends.ignore'), {
            acceptee: user_id
        }).done(function(data) {
            if (!data || data.error) {
                var msg = gettext('Failed to ignore friend request');
                notification.notification({message: msg});
                return console.error(data.error);
            }
            // TODO: Rewrite cache to just remove single friend.
            cache.bust(urls.api.url('user.friends.requests'));
            z.body.trigger('reload');
            return console.log(data);
        }).fail(function(data) {
            var msg = gettext('Failed to ignore friend request');
            notification.notification({message: msg});
            return console.error(data);
        });
    }

    function unfriendFriend(user_id) {
        requests.post(urls.api.url('user.friends.unfriend'), {
            exfriend: user_id
        }).done(function(data) {
            if (!data || data.error) {
                var msg = gettext('Failed to remove friend');
                notification.notification({message: msg});
                return console.error(data.error);
            }
            // TODO: Rewrite cache to just remove single friend.
            cache.bust(urls.api.url('user.friends'));
            z.body.trigger('reload');
            return console.log(data);
        }).fail(function(data) {
            var msg = gettext('Failed to remove friend');
            notification.notification({message: msg});
            return console.error(data);
        });
    }

    z.body.on('paste', 'input[name=q]', function(e) {
        setTimeout(function() {
            $('.user-search').trigger('submit', false);
        }, 0);
    }).on('change keyup', 'input[name=q]', function(e) {
        var $this = $(this);
        if ($this.val() !== $this.data('searched')) {
            $('.user-results').html('');
        }
        setTimeout(function() {
            $('.user-search').trigger('submit', false);
        }, 500);
    }).on('submit', '.user-search', function(e, blur) {
        e.preventDefault();
        if (blur !== false) {
            $('input[name=q]').trigger('blur');
        }
        searchUser($(this));
    }).on('click', '.add-friend', function() {
        var $friend = $(this).closest('[data-user-id]');
        var username = $friend.find('.profile-link').text();
        var msg = gettext('Friend requested: {username}', {username: username});
        notification.notification({message: msg});
        requestFriend($friend.data('userId'));
        $friend.remove();
    }).on('click', '.accept-friend', function() {
        var $friend = $(this).closest('[data-user-id]');
        var username = $friend.find('.profile-link').text();
        var msg = gettext('Friend request accepted: {username}', {username: username});
        notification.notification({message: msg});
        acceptFriend($friend.data('userId'));
        $friend.remove();
    }).on('click', '.ignore-friend', function() {
        var $friend = $(this).closest('[data-user-id]');
        var username = $friend.find('.profile-link').text();
        var msg = gettext('Friend request ignored: {username}', {username: username});
        notification.notification({message: msg});
        ignoreFriend($friend.data('userId'));
        $friend.remove();
    }).on('click', '.unfriend-friend', function() {
        // TODO: Add logic when the API endpoint lands
        var $friend = $(this).closest('[data-user-id]');
        var username = $friend.find('.profile-link').text();
        var msg = gettext('Friend removed: {username}', {username: username});
        notification.notification({message: msg});
        unfriendFriend($friend.data('userId'));
        $friend.remove();
    });

    return function(builder) {
        builder.start('friends/main.html').done(function() {
        });

        builder.z('type', 'leaf friends');
        builder.z('title', gettext('Friends'));
    };
});
