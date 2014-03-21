define('featured-games',
       ['jquery', 'l10n', 'utils', 'urls', 'z'],
       function($, l10n, utils, urls, z) {

    var gettext = l10n.gettext;

    z.body.on('click', '.featured-games-section li', function(e) {
        $('.featured-games-section li').removeClass('selected');
        $(this).addClass('selected');
        // TODO: Update game detail section with selected game details.
    })

    function getFeaturedGames() {
        return [
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
    }

    return {
        getFeaturedGames: getFeaturedGames
    };
});
