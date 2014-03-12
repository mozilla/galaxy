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
        window.scrollTo($el[0], 0);
        $('.toggly-section.current:not(#' + hash + ')').removeClass('current');
        $el.addClass('current');
    });

    z.body.on('click', '.featured-games-section li', function(e) {
        $('.featured-games-section li').removeClass('selected');
        $(this).addClass('selected');
        // TODO: Update game detail section with selected game details.
    })

    var gettext = l10n.gettext;

    return function(builder, args) {
        var slug = args[0];
        var featured_games = [
        {
            title: 'Hex GL',
            developer: 'Thibaut Despoulain',
            icon: 'hexgl.png'
        },
        {
            title: 'Batman: Arkham Origins',
            developer: 'Armature Studio',
            icon: 'batman.png'
        },
        {
            title: 'Bastion',
            developer: 'Supergiant Games',
            icon: 'bastion.png'
        },
        {
            title: 'Windborne',
            developer: 'Hidden Path Entertainment',
            icon: 'windborne.png'
        },
        {
            title: 'Orion',
            developer: 'Spiral Game Studios',
            icon: 'orion.png'
        },
        {
            title: 'Banished',
            developer: 'Shining Rock Software',
            icon: 'banished.png'
        },
        {
            title: 'Hex GL',
            developer: 'Thibaut Despoulain',
            icon: 'hexgl.png'
        },
        {
            title: 'Batman: Arkham Origins',
            developer: 'Armature Studio',
            icon: 'batman.png'
        },
        {
            title: 'Bastion',
            developer: 'Supergiant Games',
            icon: 'bastion.png'
        },
        {
            title: 'Windborne',
            developer: 'Hidden Path Entertainment',
            icon: 'windborne.png'
        },
        {
            title: 'Orion',
            developer: 'Spiral Game Studios',
            icon: 'orion.png'
        },
        {
            title: 'Banished',
            developer: 'Shining Rock Software',
            icon: 'banished.png'
        }
        ];

        builder.start('game/main.html', {
            slug: slug, 
            page_url: window.location.href, 
            featured_games: featured_games
        });

        builder.z('type', 'game');
        builder.z('title', gettext('Loading...'));
        builder.z('pagetitle', gettext('App Details'));
        builder.onload('game-data', function(game) {
            builder.z('title', utils.translate(game.name));
            twttr.widgets.load(); // Needed for loaded twitter widget scripts
        });
    };
});
