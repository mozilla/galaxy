define('views/submit',
       ['dropzone', 'l10n', 'routes_api', 'storage', 'utils', 'z'],
       function(dropzone, l10n, routes_api, storage, utils, z) {

    z.body.on('blur change keyup paste', '[name=name]', function(e) {
        var $this = $(this);
        var $slug = $this.closest('form').find('[name=slug]');

        $slug.val(utils.slugify($this.val()));

        // If the name is valid, the slug is valid so let the user tab over it.
        $slug.attr('tabIndex', this.checkValidity() ? '-1' : '');

        // Upon blur of name, add the `focused` class so :valid/:invalid
        // styles get set on slug.
        if (e.type === 'blur' || e.type === 'focusout') {
            $slug.addClass('focused');
        }
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
