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

        // Error template paths. Used by builder.js.
        fragment_error_template: 'errors/fragment.html',
        pagination_error_template: 'errors/pagination.html',

        // Switches for features.
        tracking_enabled: false,
        action_tracking_enabled: true,
        potatolytics_enabled: false,

        // The GA tracking ID for this app.
        ga_tracking_id: null,
        ua_tracking_id: null,
        tracking_section: 'Consumer',
        tracking_section_index: 3,

        // The Persona unverified issuer origin. Used by login.js.
        persona_unverified_issuer: 'login.persona.org',

        // The string to suffix page titles with. Used by builder.js.
        title_suffix: 'Mozilla Galaxy'
    });
});
