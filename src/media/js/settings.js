define('settings', ['l10n', 'settings_local', 'underscore'], function(l10n, settings_local, _) {
    var gettext = l10n.gettext;

    var origin = window.location.origin || (
        window.location.protocol + '//' + window.location.host);

    return _.defaults(settings_local, {
        app_name: 'galaxy',
        init_module: 'main',
        default_locale: 'en-US',
        api_url: origin,  // No trailing slash, please.
        media_url: origin + '/media',

        storage_version: '0',

        param_whitelist: ['q', 'sort'],

        // The list of models and their primary key mapping. Used by caching.
        model_prototypes: {
            'game': 'slug',
            'genre': 'slug'
        },

        genres: {
            'action': gettext('Action'),
            'adventure': gettext('Adventure'),
            'rpg': gettext('RPG'),
            'simulation': gettext('Simulation'),
            'sports': gettext('Sports'),
            'strategy': gettext('Strategy')
        },

        fragment_error_template: 'errors/fragment.html',
        pagination_error_template: 'errors/pagination.html',

        tracking_id: null,

        persona_unverified_issuer: 'login.persona.org',

        title_suffix: 'Mozilla Galaxy'
    });
});
