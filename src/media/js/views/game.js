define('views/game',
       ['jquery', 'l10n', 'featured-games', 'requests', 'templates', 'user', 'utils', 'urls', 'video-utils', 'z'],
       function($, l10n, featured_games, requests, nunjucks, user, utils, urls, video_utils, z) {

    var gettext = l10n.gettext;

    function updatePlay(gameSlug) {
        requests.post(urls.api.url('user.purchase'), {game: gameSlug});
    };

    function showSelectedMedia(media) {
        var $media = $(media);
        $('.game-media').removeClass('selected');
        if ($media.data('video-type')) {
            // Video type
            var $mediaObject = video_utils.createVideoFromId($media.data('video-id'), $media.data('video-type'), 480, 300);
        } else {
            // Screenshot type
            var $mediaObject = $('<div>', {height: 304, width: 480});
            $mediaObject.css('background-image', 'url(\'' + $media[0].src + '\')');
        }
        
        $media.addClass('selected');
        $('.game-current-media').html($mediaObject);
    }

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

    z.body.on('click', '.btn-play', function(e) {
        e.preventDefault();
        window.open($(this).data('appUrl'));

    }).on('click', '.btn-install', function(e) {
        var $this = $(this);
        if (user.logged_in()) {
            updatePlay($this.data('gameSlug'));
            $this.removeClass('btn-install');
        }

    }).on('click', '.featured-games-section li', function(e) {
        $('.featured-games-section li').removeClass('selected');
        $(this).addClass('selected');
        var slug = $(this).data('game-slug');
        requests.get(urls.api.url('game', [slug])).done(function(gameData) {
            $('.game-details-container').html(nunjucks.env.render('game/detail.html', {game: gameData}));
            showSelectedMedia($('.game-media')[0]);
            history.pushState({}, '', urls.reverse('game', [slug]));
            z('title', utils.translate(game.name));
            // TODO: Navigate to pages in history when user clicks back button.
        });

    }).on('click', '.game-media', function() {
        showSelectedMedia($(this));

    }).on('click', '.game-details-media .arrow', function() {
        // TODO: Scroll media gallery section downwards.
    });

    return function(builder, args) {
        var slug = args[0];

        builder.start('game/main.html', {
            slug: slug, 
            page_url: window.location.href
        });

        builder.z('type', 'game');
        builder.z('title', gettext('Loading...'));
        builder.z('pagetitle', gettext('App Details'));
        builder.onload('game-data', function(game) {
            builder.z('title', utils.translate(game.name));
            showSelectedMedia($('.game-media')[0]);
            $('.featured-games-section li[data-game-slug="' + game.slug + '"]').addClass('selected');
            // TODO: Scroll to that particular game in the featured games listings.
            
            twttr.widgets.load(); // Needed for loaded twitter widget scripts
            featured_games.attachScrollEvents();
        });
    };
});
