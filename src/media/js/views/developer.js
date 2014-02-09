define('views/developer', ['l10n', 'utils'], function(l10n, utils) {
    return function(builder, args) {
        var dev_slug = args[0];
        builder.start('developers/profile.html', {dev_slug: dev_slug}).done(function() {
        });

        var gettext = l10n.gettext;

        builder.z('type', 'leaf profile');
        builder.z('title', gettext('Loading...'));

        builder.onload('dev-search', function(company) {
            builder.z('title', utils.translate(company.companyName));
        });
        
    };
});
