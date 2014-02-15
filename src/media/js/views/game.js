define('views/game',
       ['jquery', 'l10n', 'utils', 'z'],
       function($, l10n, utils, z) {

    z.body.on('click', '.play', function(e) {
        var $this = $(this);
        e.preventDefault();
        window.open($this.data('appUrl'));
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
        console.log($el[0])
        window.scrollTo($el[0], 0);
        $('.toggly-section.current:not(#' + hash + ')').removeClass('current');
        $el.addClass('current');
    });

    var gettext = l10n.gettext;

    return function(builder, args) {
        var slug = args[0];
    
        builder.start('game/main.html', {slug: slug, page_url: utils.urlencode(window.location.href)});

        builder.z('type', 'game');
        builder.z('title', gettext('Loading...'));
        builder.z('pagetitle', gettext('App Details'));

        builder.onload('game-data', function(game) {
            builder.z('title', utils.translate(game.name));
            twttr.widgets.load(); // Needed for loaded twitter widget scripts
        });
    };
});
