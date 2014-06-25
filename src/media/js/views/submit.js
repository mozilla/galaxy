define('views/submit',
       ['dropzone', 'l10n', 'notification', 'requests', 'routes_api', 'storage', 'urls', 'underscore', 'utils', 'z'],
       function(dropzone, l10n, notification, requests, routes_api, storage, urls, _, utils, z) {

    var gettext = l10n.gettext;

    function submitGame(data) {
        requests.post(urls.api.url('game.submit'), data).done(function(data) {
            notification.notification({message: gettext('Game successfully submitted')});
            z.page.trigger('navigate', urls.reverse('game', [data.slug]));
        }).fail(function(data) {
            notification.notification({message: gettext('Failed to submit game')});
        });
    }

    function editGame(data) {
        var slug = data.slug;
        data = {data: JSON.stringify(data)};
        requests.put(urls.api.url('game.edit', [slug]), data).done(function(data) {
            notification.notification({message: gettext('Game details updated')});
            require('views').reload();
        }).fail(function(data) {
            notification.notification({message: gettext('Failed to update game details')});
        });
    }

    var delay = (function(){
        var timer = 0;
        return function(callback, duration){
            clearTimeout(timer);
            timer = setTimeout(callback, duration);
        };
    })();

    z.body.on('blur input', 'input[name=name]', function(e) {
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
    }).on('keyup', 'textarea[name=description]', function(e) {
        var value = $(this).val();
        var togglePreview = $('.toggle-preview-container');
        togglePreview.hide();
        delay(function() {
            if (value.length) {
                togglePreview.show();
            }
        }, 300);
        
    }).on('click', '.toggle-preview-container', function(e) {
        e.preventDefault();
        console.log('click')
        var $textarea = $('textarea[name=description]');
        var $descriptionPreview = $('.description-preview');
        $descriptionPreview.html(marked($textarea.val()));
        $(this).children('.fa').toggleClass('fa-eye-slash');
        $textarea.toggle();
        $descriptionPreview.toggle();

    }).on('submit', '.game-form', function(e) {
        e.preventDefault();
        var $this = $(this);

        var data = {
            name: $this.find('[name=name]').val(),
            slug: $this.find('[name=slug]').val(),
            app_url: $this.find('[name=app_url]').val(),
            description: $this.find('[name=description]').val(),
            number_of_players: $this.find('[name=number_of_players]:checked').val(),
            privacy_policy_url: $this.find('[name=privacy_policy_url]').val(),
            genre: $this.find('[name=genre]:checked').val(),
            icons: [],
            screenshots: [{ 
                '4_3': [], 
                '16_9': []
            }],
            videos: []
        };

        var $iconInput = $this.find('[name=icon_final_url]');

        data.icons.push({ 
            src: $iconInput.val(), 
            height: $iconInput.data('height'),
            width: $iconInput.data('width')
        });

        $('.screenshots-list').each(function() {
            var $this = $(this);
            var type = $this.data('screenshot-type');
            $this.find('[name=screenshot_final_url]').each(function() {
                var $screenshotInput = $(this);
                var src = $screenshotInput.val();
                var height = $screenshotInput.data('height');
                var width = $screenshotInput.data('width');
                if (src && height && width) {
                    data.screenshots[0][type].push({
                        src: src,
                        height: height,
                        width: width
                    });
                }
            });
        });

        // Handle URLs for videos.
        $('.videos input[type=hidden]').each(function() {
            var $this = $(this);
            var id = $this.val();
            var videoType = $this.data('video-type');
            var thumbnail = $this.data('video-thumbnail');

            if (id && videoType && thumbnail) {
                data.videos.push({
                    id: id,
                    type: videoType,
                    thumbnail: thumbnail,
                });
            }
        })

        if ($this.data('formtype') === 'submit') {
            submitGame(data);
        } else if ($this.data('formtype') === 'edit') {
            editGame(data);
        }
    });

    return function(builder) {

        builder.start('submit.html');
        builder.z('type', 'leaf submit');
        builder.z('title', gettext('Submit a Game'));
    };
});
