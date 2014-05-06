define('media-input',
       ['jquery', 'l10n', 'promise', 'video-utils', 'z'],
       function($, l10n, promise, video_utils, z) {
    var gettext = l10n.gettext;
    var Promise = promise;

    // Read the Aviary docs for reference:
    // http://developers.aviary.com/docs/web/setup-guide
    var featherEditor = new Aviary.Feather({
        apiKey: '18dd09ec2d40f716',
        apiVersion: 3,
        theme: 'dark',
        cropPresets: [
            ['Square', '1:1']
        ],
        onSave: function(imageID, newURL) {
            var img = document.getElementById(imageID);

            // Replace the contents of the preview box + dimensions.
            var $img = $(img);
            preview($img.closest('.media-preview-container'), newURL);

            // At any one time, there should only be one image with the 'aviary-image' id
            $img.removeAttr('id');
            
            var $mediaItem = $img.closest('.media-item');

            if ($mediaItem.data('type') !== 'icons') {
                var $clone = $mediaItem.clone();
                $mediaItem.before($clone);
                cleanUpTemplate($mediaItem);
                $mediaItem = $clone;
            } 
            // This is the URL that gets POST'd to the API.
            var $processedInput = $mediaItem.children('.media-input-processed-url');
            $processedInput.val(newURL);

            img.onload = function() {
                $processedInput.attr('data-height', img.naturalHeight);
                $processedInput.attr('data-width', img.naturalWidth);
            };

            $mediaItem.removeClass('add-item').addClass('processed');

            // Close the editor.
            featherEditor.close();
        },
        onError: function(errorObj) {
            console.error(errorObj.message);
        }
    });

    function cleanUpTemplate($mediaItem) {
        // To reset all input fields and img src in a media-item-template
        $mediaItem.removeClass('add-item').addClass('media-item-template');
        $mediaItem.children('.media-preview').removeAttr('src');
        $mediaItem.children('.media-input').val('');
    }

    function launchEditor(id, src, type) {

        switch (type) {
            case 'icons':
                var message = gettext('Crop your icon to a square');
                var ratio = '1:1';
                var size = 128;
                break;
            case 'screenshots-4-3':
                var message = gettext('Crop your icon to a 4:3 rectangle');
                var ratio = '4:3';
                var size = 1024;
                break;
            case 'screenshots-16-9':
                var message = gettext('Crop your icon to a 16:9 rectangle');
                var ratio = '16:9';
                var size = 1280;
                break;
        }

        featherEditor.launch({
            forceCropPreset: [message, ratio],
            forceCropMessage: '&nbsp;',
            maxSize: size,
            image: id,
            url: src
        });
        return false;
    }

    function preview($obj, src, launch) {
        var img = $obj.children('.media-preview')[0];
        img.src = src;
        
        if (launch) {
            var type = $obj.data('type');
            img.id = 'aviary-img';
            // If we've exited the editor, for example,
            // we don't we want to relaunch the editor.
            launchEditor(img.id, img.src, type);
        }
    }

    function getFileDataURI(input, callback) {
        return new Promise(function(resolve, reject) {
            var files = input.files;
            if (files) {
                // Loop through the files and render image files.
                files.forEach(function (file) {
                    // This is so we can get the data URI of the image uploaded.
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        resolve(e.target.result);
                        // preview(input.dataset.type, e.target.result, false);
                    };
                    reader.onerror = function (err) {
                        reject(err.getMessage());
                    };
                    reader.readAsDataURL(file);
                });
            }
        });
    }

    function loadVideo($input, type) {
        if ($input.val()) {
            var $mediaPreview = $input.siblings('.media-preview-container');
            $mediaPreview.find('.media-iframe')
                .html(video_utils.createVideoFromId($input.val(), type));
            $mediaPreview.parent('.media-item').addClass('processed');
        }
    }

    z.page.on('loaded', function() {
        $('.videos input[type=hidden]').each(function() {
            // Load iframes for existing videos
            var $this = $(this);
            loadVideo($this, $this.data('video-type'));
        });

    }).on('keypress', 'input[type=url].media-input', function(e) {
        var $this = $(this);
        if (this.checkValidity() && e.keyCode === 13) {
            // After it's been blurred, the editor will get launched.
            return this.blur();
        }

    }).on('blur', 'input[type=url].media-input', function(e) {
        var $this = $(this);
        if ($this.data('type') === 'videos') {
            return;
        }
        // Launch editor only when input is blurred.
        if ($this.val() !== 'http://') {
            // Launch on non-empty inputs.
            preview($this.siblings('.media-preview-container'), $this.val(), true);
        }

    }).on('click', '.media-preview-container', function(e) {
        // Open the file upload dialog when user clicks on dropzone.
        // Only happens if there's no image inside the preview container.
        var $this = $(this);
        if ($this.closest('.media-item').hasClass('processed')) {
            var src = $this.siblings('.media-input-processed-url').val();
            var $img = $this.children('.media-preview');
            $img[0].id = 'aviary-img';
            launchEditor($img[0].id, src, $this.data('type'));
        } else {
            $this.children('input[type=file]')[0].click();
        }

    }).on('drop', '.media-preview-container', function(e) {
        e.preventDefault();
        var $this = $(this);
        $this.toggleClass('dragenter', false);
        if (!$this.closest('.media-item').hasClass('processed')) {
            e = e.originalEvent;
            getFileDataURI(e.dataTransfer).then(function(data) {
                preview($this, data, true);
            }).catch(function(err) {
                return console.error(err);
            });
        }

    }).on('blur change', 'input[type=file].media-input', function(e) {
        var input = this;
        input.blur();
        var $this = $(this);
        getFileDataURI(input).then(function (data) {
            preview($this.closest('.media-preview-container'), data, true);
        }).catch(function (err) {
            return console.error(err);
        });

    }).on('click', '.media-delete', function(e) {
        e.stopPropagation();
        var $this = $(this);
        $this.siblings('input[type=file].media-input').val('');
        var $mediaList = $this.closest('.media-list');
        if ($mediaList.children('.media-item').length === 1) {
            var $mediaPreviewContainer = $this.parent();
            $mediaPreviewContainer.closest('.media-item').removeClass('processed');
            $mediaPreviewContainer.siblings('.media-input').val('');
            $mediaPreviewContainer.siblings('.media-input-processed-url').val('');
            $mediaPreviewContainer.children('.media-iframe').html('');
            $mediaPreviewContainer.siblings('input[type=hidden]').
                val('').attr('data-video-type', '').attr('data-video-thumbnail', '');
        } else {
            $this.closest('.media-item').remove();
        }

    }).on('blur', '.videos input[type=url]', function() {
        // Videos section
        var $this = $(this);
        var $hidden = $this.siblings('input[type=hidden]');
        if ($this.val() && $this.val() !== 'http://') {
            var videoObject = video_utils.parseVideo($this.val());
            $hidden.val(videoObject.id).attr('data-video-type', videoObject.type);
            video_utils.getVideoThumbnailFromId(videoObject.id, videoObject.type, function(thumbnail) {
                $hidden.attr('data-video-thumbnail', thumbnail);
            });
            loadVideo($hidden, videoObject.type);
        } else {
            // Clear the loaded iframe.
            $this.siblings('.media-preview-container').children('.media-iframe').html('');
            $hidden.val('').attr('data-video-type', '').attr('data-video-thumbnail', '');
        }

    }).on('dragover dragenter', function(e) {
        e.preventDefault();
        var $target = $(e.target);
        if ($target.hasClass('media-preview-container')) {
            e.originalEvent.dataTransfer.dropEffect = 'copy';
            $target.toggleClass('dragenter', true);
        } else {
            e.originalEvent.dataTransfer.dropEffect = 'none';
        }
        return false;

    }).on('dragleave dragend', '.media-preview-container', function(e) {
        $(this).toggleClass('dragenter', false);
        return false;

    }).on('click', '.add-button', function(e) {
        $(this).siblings('.media-item-template').removeClass('media-item-template').addClass('add-item');

    });

});
