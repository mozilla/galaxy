define('views/submit',
       ['dropzone', 'l10n', 'routes_api', 'storage', 'utils', 'z'],
       function(dropzone, l10n, routes_api, storage, utils, z) {

    z.body.on('blur change keyup paste', 'input[name=name]', function(e) {
        // NOTE: We're using `keyup` instead of `keypress` to detect when
        // the user tabs within this field.
        var $this = $(this);
        var $slug = $this.closest('form').find('[name=slug]');

        $slug.val(utils.slugify($this.val()));

        // If the name is valid, the slug is valid so let the user tab over it.
        $slug.attr('tabIndex', this.checkValidity() ? '-1' : '');

        // Upon presence/absence of name, toggle the `focused` class so
        // :valid/:invalid styles get set on slug.
        $slug.toggleClass('focused', !!$this.val());
    });

    return function(builder) {
        builder.start('submit.html').done(function() {
            // new dropzone('.submit-form', {
            //     uploadMultiple: true
            // });
        });

        builder.z('type', 'leaf submit');
        builder.z('title', gettext('Submit a Game'));
    };
});
