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
    }).on('blur change', 'input[type=file]', function(e) {
        // TODO: Replace with drag-and-drop library.
        var input = this;
        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var $filePreview = $(input).closest('.form-field').find('.file-preview');
                    $filePreview.show().css('background-image', 'url(' + e.target.result + ')');
                    var img = new Image();
                    img.src = e.target.result;
                    img.onload = function() {
                        $filePreview.siblings('.file-size').html(this.width + 'px &times; ' + this.height + 'px').show();
                    };
                };
                reader.readAsDataURL(input.files[0]);
            }
        }
        input.blur();
        readURL(this);
        // TODO: Allow user to delete/replace (and possibly resize/crop) images.
        // TODO: Allow previewing of videos.
        // TODO: Allow multiple icons/screenshots/videos.
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
