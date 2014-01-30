define('views/settings', 
    ['forms', 'log', 'notification', 'requests', 'urls', 'user', 'z'], 
    function(forms, log, notification, requests, urls, user, z) {
    
    var console = log('settings');

    function handleProfileUpdate(changes) {
        user.update_settings(changes);
        z.page.trigger('reload_chrome');
        require('views').reload().done(function() {
            notification.notification({message: gettext('Your settings have been saved')});
        });
    };
    function updateProfile($this) {
        forms.toggleSubmitFormState($this, false);

        var newEmail = $this.find('[name=email]').val();
        var newUsername = $this.find('[name=username]').val();
        var newData = {
            email: newEmail,
            username: newUsername
        };

        requests.put(urls.api.url('user.profile'), newData).done(function(data) {
            handleProfileUpdate(newData);
        }).fail(function(data) {
            // TODO: Show specific error messages for common error cases (ie. email already in use)
            console.error('Failed to update settings! Error:', data.response);
            notification.notification({message: gettext('Failed to update settings')});
            forms.toggleSubmitFormState($this, true);
        });
    };

    z.body.on('submit', 'form.edit-profile', function(e){
        e.preventDefault();
        updateProfile($(this));
    });

    return function(builder, args) {
        builder.start('settings.html').done(function() {
        });

        builder.z('type', 'leaf settings');
        builder.z('title', gettext('Settings'));
    };
});
