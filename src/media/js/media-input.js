define('media-input',
       ['jquery', 'l10n', 'promise', 'z'],
       function($, l10n, promise, z) {
    var gettext = l10n.gettext;
    var Promise = promise;

    // Read the Aviary docs for reference:
    // http://developers.aviary.com/docs/web/setup-guide
    var featherEditor = new Aviary.Feather({
        apiKey: '18dd09ec2d40f716',
        apiVersion: 3,
        theme: 'dark',
        // TODO: We should probably enforce a minimum size.
        // TODO: `maxSize` will have to be different for screenshots.
        maxSize: 128,
        // TODO: `cropPresets` will have to be different for screenshots.
        cropPresets: [
            ['Square', '1:1']
        ],
        onSave: function(imageID, newURL) {
            var img = document.getElementById(imageID);

            // Replace the contents of the preview box + dimensions.
            preview(img.dataset.type, newURL);
            var $img = $(img);
            $img.parent().addClass('processed');
            $img.show();
            $img.parent().siblings('.media-input').css('visibility', 'hidden');
            // This is the URL that gets POST'd to the API.
            // TODO: As there will be multiple fields for screenshots,
            // we need to update the correct hidden `input` field.
            $img.parent().siblings('.media-input-processed-url').val(newURL);

            // Close the editor.
            featherEditor.close();
        },
        onError: function(errorObj) {
            console.error(errorObj.message);
        }
    });

    function launchEditor(id, src) {
        featherEditor.launch({
            forceCropPreset: [gettext('Crop your icon to a square'), '1:1'],
            forceCropMessage: '&nbsp;',
            image: id,
            url: src
        });
        return false;
    }

    function preview(type, src, launch) {
<<<<<<< HEAD
        var $filePreview = $('.media-preview[data-type="' + type + '"]');
        $filePreview.show();

        var img = $filePreview[0];
        img.src = src;
        img.onload = function() {
            $filePreview.siblings('.media-size').html(
                this.width + 'px &times; ' + this.height + 'px').show();
        };
=======
        if (type === "icons") {
            var $imgPreview = $('.media-preview-container[data-type="' + type + '"]').children();
            var img = $imgPreview[0];
            img.src = src;
            img.id = 'icon-128';
        } else {
            var span = document.createElement('span');
            span.innerHTML = ['<img src="', src, '"/>'].join('');
            document.getElementById('sc-list').insertBefore(span, null);
        }
>>>>>>> Handle deletion of icon

        if (launch) {
            // If we've exited the editor, for example,
            // we don't we want to relaunch the editor.
            launchEditor(img.id, img.src);
        }
    }

    function createInput($section) {
        $section.append($('<input>', {
            'class': 'media-input',
            'data-type': $section.data('type'),
            'type': 'url',
            'placeholder': $section.data('placeholder'),
            'pattern': 'https?://.*'
        }));
    }

    function getFileDataURI(input, callback) {
        return new Promise(function(resolve, reject) {
            if (input.files && input.files[0]) {
                // This is so we can get the data URI of the image uploaded.
                var reader = new FileReader();
                reader.onload = function (e) {
                    resolve(e.target.result);
                };
                reader.onerror = function (err) {
                    reject(err.getMessage());
                };
                reader.readAsDataURL(input.files[0]);
            }
        });
    }

    z.page.on('loaded', function() {
        $('.fallback').each(function() {
            var $this = $(this);
            createInput($this);
        });

        $('.videos input').each(function() {
            // Load iframes for existing videos
            loadVideo($(this));
        });
    }).on('input', 'input[type=url].media-input', function(e) {
        // var $input = $(e.target);
        // var $allInputs = $input.parent().children('input[type=url]');
        // var $emptyInputs = $allInputs.filter(function() {
        //     return !$(this).val();
        // });
        // // TODO: Have a better check for the icons input field
        // if ($input.val() && $emptyInputs.length === 0 && $input.data('type') === 'screenshots') {
        //     createInput($input.parent());
        // } else {
        //     // So that at any point in time, there will be exactly
        //     // ONE empty input field for user to enter more URLs.
        //     $emptyInputs.slice(1).remove();
        // }
    }).on('keypress', 'input[type=url].media-input', function(e) {
        var $this = $(this);
        if (this.checkValidity() && e.keyCode === 13) {
            // After it's been blurred, the editor will get launched.
            return this.blur();
        }
    }).on('blur', 'input[type=url].media-input', function(e) {
        var $this = $(this);
        // Launch editor only when input is blurred.
        if ($this.val() !== 'http://') {
            // Launch on non-empty inputs.
            preview($this.data('type'), $this.val(), true);
        }
    }).on('click', '.media-preview-container', function(e) {
        // Open the file upload dialog when user clicks on dropzone.
        // Only happens if there's no image inside the preview container.
        if (!$(this).hasClass('processed')) {
            $(this).children('input[type=file]')[0].click();
        }
    }).on('click', '.media-preview', function(e) {
        // Clicking on the image preview should open the image for re-processing.
        // Only happens if image is loaded inside preview container.
        if ($(this).parent().hasClass('processed')) {
            launchEditor($(this).id,
                $(this).siblings('.media-input-processed-url').val());
        }
    }).on('blur change', 'input[type=file].media-input', function(e) {
        // TODO: Allow images to be dragged and dropped to the file input.
        var input = this;
        input.blur();
<<<<<<< HEAD

=======
        // getFileDataURI(input);
>>>>>>> Handle deletion of icon
        getFileDataURI(input).then(function (data) {
            preview(input.dataset.type, data, true);
        }).catch(function (err) {
            return console.error(err);
        });
<<<<<<< HEAD
=======
    }).on('click', '.media-delete', function(e) {
        e.stopPropagation();
        $(this).siblings('.media-preview').hide();
        $(this).siblings('input[type=file].media-input').val('');

        var $mediaPreviewContainer = $(this).parent();
        $mediaPreviewContainer.removeClass('processed');
        $mediaPreviewContainer.siblings('.media-input').css('visibility','visible');
        $mediaPreviewContainer.siblings('.media-input').val('');
        $mediaPreviewContainer.siblings('.media-input-processed-url').val('');
    }).on('blur', '.videos input', function() {
        // Videos section
        if ($(this).val()) {
            loadVideo($(this));
        } else {
            // Clear the loaded iframe
            $(this).siblings('.media-preview').html('');
        }
>>>>>>> Handle deletion of icon
    });
});
