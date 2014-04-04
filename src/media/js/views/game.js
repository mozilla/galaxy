define('views/game',
       ['jquery', 'l10n', 'featured-games', 'requests', 'user', 'utils', 'urls', 'z'],
       function($, l10n, featured_games, requests, user, utils, urls, z) {

    var gettext = l10n.gettext;

    function updatePlay(gameSlug) {
        requests.post(urls.api.url('user.purchase'), {game: gameSlug});
    };

    z.body.on('click', '.btn-play', function(e) {
        var $this = $(this);
        e.preventDefault();
        window.open($this.data('appUrl'));
    }).on('click', '.btn-install', function(e) {
        var $this = $(this);
        if (user.logged_in()) {
            updatePlay($this.data('gameSlug'));
            $this.removeClass('btn-install');
        }
    });

    z.win.on('hashchange', function() {
        // TODO: allow builder to accept hash.
        var hash = window.location.hash.substr(1);
        if (!hash) {
            return true;
        }
        var $el = $('.toggly-section#' + hash);
        if (!$el.length) {
            return true;
        }
        $('.toggly a.current:not(#' + hash + ')').removeClass('current');
        $('.toggly a[href="#' + hash + '"]').addClass('current');
        window.scrollTo($el[0], 0);
        $('.toggly-section.current:not(#' + hash + ')').removeClass('current');
        $el.addClass('current');
    });

    z.body.on('click', '.featured-games-section li', function(e) {
        $('.featured-games-section li').removeClass('selected');
        $(this).addClass('selected');
        // TODO: Update game detail section with selected game details.
    })

    z.body.on('click', '.game-media', function() {
        $('.game-media').removeClass('selected');
        var $this = $(this);
        $this.addClass('selected');
        var mediaSrc = $this.attr('src');
        if (mediaSrc.search(/youtube|vimeo/) > -1) {
            if (mediaSrc.indexOf('youtube') > -1) {
                var youtubeId = mediaSrc.split('/')[4];
                var $mediaObject = $('<iframe>', {
                    autoplay: 1,
                    frameborder: 0,
                    src: '//www.youtube.com/embed/' + youtubeId
                });
            } else {
                // TODO: Vimeo
            }
        } else {
            var $mediaObject = $('<img>', { src: mediaSrc });
        }
        $mediaObject.attr('height', 300);
        $mediaObject.attr('width', 480);
        $('.game-current-media').html($mediaObject);
    });

    z.body.on('click', '.game-details-media .arrow', function() {
        // TODO: Scroll media gallery section downwards
    });

    return function(builder, args) {
        var slug = args[0];

        builder.start('game/main.html', {
            slug: slug, 
            page_url: window.location.href,
            featured_games: featured_games.getFeaturedGames()
        });

        builder.z('type', 'game');
        builder.z('title', gettext('Loading...'));
        builder.z('pagetitle', gettext('App Details'));
        builder.onload('game-data', function(game) {
            builder.z('title', utils.translate(game.name));
            twttr.widgets.load(); // Needed for loaded twitter widget scripts
            featured_games.attachScrollEvents();
        });
    };
});
