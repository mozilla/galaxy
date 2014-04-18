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
            $mediaItem.children('.media-input-processed-url').val(newURL);
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
        if (type === 'icons') {
            var message = gettext('Crop your icon to a square');
            var ratio = '1:1';
            var size = 128;
        } else {
            var message = gettext('Crop your icon to a 4:3 rectangle');
            var ratio = '4:3';
            var size = 1024;
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
            var files = input.files;
            if (files && files[0]) {
                // Loop through the files and render image files.
                for (var i = 0, f; f = files[i]; i++) {
                    // This is so we can get the data URI of the image uploaded.
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        resolve(e.target.result);
                        // preview(input.dataset.type, e.target.result, false);
                    };
                    reader.onerror = function (err) {
                        reject(err.getMessage());
                    };
                    reader.readAsDataURL(input.files[i]);
                }
            }
        });
    }

    function loadVideo($input) {
        var mediaSrc = $input.val();
        // TODO: Handle case of invalid video URLs.
        if (mediaSrc.search(/youtube|vimeo/) > -1) {
            // TODO: Handle all formats of youtube and vimeo URLs.
            if (mediaSrc.indexOf('youtube') > -1) {
                var youtubeId = mediaSrc.split('/')[4];
                var $mediaObject = $('<iframe>', {
                    autoplay: 1,
                    frameborder: 0,
                    src: '//www.youtube.com/embed/' + youtubeId
                });
            } else {
                var vimeoId = mediaSrc.split('/')[3];
                var $mediaObject = $('<iframe>', {
                    frameborder: 0,
                    src: '//player.vimeo.com/video/' + vimeoId
                });
            }
        } else {
            return;
        }
        $mediaObject.attr('height', 210);
        $mediaObject.attr('width', 280); 
        // TODO: Replace $mediaObject with media parser's returned iframe
        $input.siblings('.media-item').children('.media-preview-container').html($mediaObject);
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
            preview($this.siblings('.media-preview-container'), $this.val(), true);
        }
    }).on('click', '.media-preview-container', function(e) {
        // Open the file upload dialog when user clicks on dropzone.
        // Only happens if there's no image inside the preview container.
        if ($(this).closest('.media-item').hasClass('processed')) {
            var src = $(this).siblings('.media-input-processed-url').val();
            var $img = $(this).children('.media-preview');
            $img[0].id = 'aviary-img';
            launchEditor($img[0].id, src, $(this).data('type'));
        } else {
            $(this).children('input[type=file]')[0].click();
        }
    }).on('drop', '.media-preview-container', function(e) {
        e.preventDefault();
        var $this = $(this);
        $(this).toggleClass('dragenter', false);
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
        $(this).siblings('input[type=file].media-input').val('');

        var $mediaList = $(this).closest('.media-list');
        if ($mediaList.children('.media-item').length == 1) {
            var $mediaPreviewContainer = $(this).parent();
            $mediaPreviewContainer.closest('.media-item').removeClass('processed');
            $mediaPreviewContainer.siblings('.media-input').val('');
            $mediaPreviewContainer.siblings('.media-input-processed-url').val('');
        } else {
            $(this).closest('.media-item').remove();
        }
    }).on('blur', '.videos input', function() {
        // Videos section
        var $this = $(this);
        if ($this.val()) {
            loadVideo($this);
        } else {
            // Clear the loaded iframe.
            $this.siblings('.media-preview-container').html('');
        }

    }).on('dragover dragenter', function(e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.hasClass('media-preview-container')) {
            e.originalEvent.dataTransfer.dropEffect = 'copy';
            $this.toggleClass('dragenter', true);
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
