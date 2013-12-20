define('views/submit',
       ['dropzone', 'l10n', 'routes_api', 'storage', 'utils', 'z'],
       function(dropzone, l10n, routes_api, storage, utils, z) {

    z.body.on('focus', '[pattern], [required], [maxlength]', function() {
        // Add a class so we don't prematurely stylise `:invalid` fields.
        var $this = $(this);
        $this.addClass('focused');
    }).on('focus', 'input[type=url]', function() {
        var $this = $(this);
        if (!$this.val()) {
            $this.val('http://');
        }
    }).on('blur', 'input[type=url]', function() {
        var $this = $(this);
        if ($this.val() === 'http://') {
            $this.val('');
        }
    }).on('blur keyup change paste', '[name=name]', function() {
        var $this = $(this);
        var $slug = $this.closest('form').find('[name=slug]');
        $slug.val(utils.slugify($this.val())).addClass('focused');
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
