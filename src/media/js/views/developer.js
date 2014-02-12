define('views/developer', ['l10n', 'utils'], function(l10n, utils) {
    return function(builder, args) {
        builder.start('developers/profile.html', {devSlug: args[0]});

        var gettext = l10n.gettext;

        builder.z('type', 'leaf profile');
        builder.z('title', gettext('Loading...'));

        builder.onload('dev-search', function(company) {
            builder.z('title', utils.translate(company.companyName));
        });
        
    };
});
