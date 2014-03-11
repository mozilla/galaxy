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
    }).on('submit', '.game-form', function(e) {
        e.preventDefault();
        var $this = $(this);

        function stringifyURLs(type) {
            var inputs = $this.find('.' + type + '.media input').get();
            return inputs.map(function(e) {
                return $(e).val();
            }).filter(_.identity);
        }

        var data = {
            name: $this.find('[name=name]').val(),
            slug: $this.find('[name=slug]').val(),
            app_url: $this.find('[name=app_url]').val(),
            description: $this.find('[name=description]').val(),
            privacy_policy_url: $this.find('[name=privacy_policy_url]').val(),
            genre: $this.find('[name=genre]:checked').val(),
            icons: [],
            screenshots: [],
        };

        // Handle URLs for icons, screenshots, and videos.
        $('.media-final-url').each(function () {
            var $this = $(this);
            var item = {src: $this.val()};

            var height = $this.data('height');
            if (height) {
                item.height = height;
            }

            var width = $this.data('width');
            if (width) {
                item.width = width;
            }

            data[$this.data('type')].push(item);
        });

        if ($this.data('formtype') === 'submit') {
            submitGame(data);
        } else if ($this.data('formtype') === 'edit') {
            editGame(data);
        }
    });

    return function(builder) {
        builder.start('submit.html').done(function() {
            // new dropzone('#test-zone', {
            //     url: "#",
            //     clickable: true,
            //     maxFilesize: 10,
            //     uploadMultiple: true,
            //     addRemoveLinks: true,
            //     accept: function(file, done) {
            //         console.log(file);
            //         if (file.name !== "justinbieber.jpg") {
            //           console.log("Naha, you don't.");
            //         } else { 
            //             done(); 
            //         }
            //     }
            // });
        });

        builder.z('type', 'leaf submit');
        builder.z('title', gettext('Submit a Game'));
    };
});
