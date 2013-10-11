define('settings', ['l10n', 'settings_local', 'underscore'], function(l10n, settings_local, _) {
    var gettext = l10n.gettext;

    return _.defaults(settings_local, {
        app_name: 'galaxy',
        init_module: 'main',
        default_locale: 'en-US',
        api_url: 'http://' + window.location.hostname,  // No trailing slash, please.

        storage_version: '0',

        param_whitelist: ['q', 'sort'],

        model_prototypes: {},

        fragment_error_template: 'errors/fragment.html',
        pagination_error_template: 'errors/pagination.html',

        tracking_id: null,

        persona_unverified_issuer: 'login.persona.org',

        title_suffix: 'Mozilla Galaxy'
    });
});
