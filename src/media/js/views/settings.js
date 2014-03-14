define('views/settings', 
    ['forms', 'log', 'notification', 'requests', 'urls', 'user', 'utils', 'z'], 
    function(forms, log, notification, requests, urls, user, utils, z) {
    
    var console = log('settings');

    function handleProfileUpdate(changes) {
        var newData = {
            username: changes.username,
            companyName: changes.teamName,
            companySlug: changes.teamSlug,
            homepage: changes.homepage
        };

        user.update_settings(newData);
        z.page.trigger('reload_chrome');
        require('views').reload().done(function() {
            notification.notification({message: gettext('Your settings have been saved')});
        });
    };
    function updateProfile($this) {
        forms.toggleSubmitFormState($this, false);

        var newUsername = $this.find('[name=username]').val();
        var newTeamname = $this.find('[name=teamname]').val();
        var newTeamURL = $this.find('[name=teamurl]').val();
        var newTeamslug = $this.find('[name=teamslug]').val();

        var newData = {
            username: newUsername,
            teamName: newTeamname,
            teamSlug: newTeamslug,
            homepage: newTeamURL
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

    z.body.on('submit', 'form.edit-profile', function(e) {
        e.preventDefault();
        updateProfile($(this));
    }).on('blur change keyup paste', 'input[name=teamname]', function(e) {
        var $this = $(this);
        var $slug = $this.closest('form').find('input[name=teamslug]');
        $slug.val(utils.slugify($this.val()));
        $slug.attr('tabIndex', this.checkValidity() ? '-1' : '');
        $slug.toggleClass('focused', !!$this.val());
    });

    return function(builder, args) {
        builder.start('settings.html');

        builder.z('type', 'leaf settings');
        builder.z('title', gettext('Settings'));
    };
});
