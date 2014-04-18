console.log('Sample Commonplace App');

require.config({
    enforceDefine: true,
    paths: {
        'dropzone': 'lib/dropzone',
        'format': 'lib/format',
        'jquery': 'lib/jquery-2.0.2',
        'lunr': 'lib/lunr',
        'nunjucks': 'lib/nunjucks',
        'nunjucks.compat': 'lib/nunjucks.compat',
        'promise': 'lib/promise-0.1.1',
        'settings': ['settings_local', 'settings'],
        'templates': '../../templates',
        'underscore': 'lib/underscore',
        'marked': 'lib/marked',
        'highlight': 'lib/highlight'
    }
});

(function() {

    define(
        'main',
        [
            'underscore',
            'helpers',  // Must come before mostly everything else.
            'capabilities',
            'dates',
            'featured-games',
            'forms',
            'keys',
            'l10n',
            'log',
            'login',
            'media-input',
            'navigation',
            'overlay',
            'templates',
            //'tracking',
            'user',
            'resize-textarea',
            'views',
            'z'
        ],
    function(_) {
        var log = require('log');
        var console = log('main');
        console.log('Dependencies resolved, starting init');

        var capabilities = require('capabilities');
        var nunjucks = require('templates');
        var z = require('z');

        // Add one-off filters
        var filters = require('nunjucks').require('filters');
        filters.safeurl = function(obj) {
            if (typeof obj !== 'string') {
                return obj;
            }
             // add slashes where needed, ie. "What's up" -> "What\'s up"
            function addSlashes(str) {
                return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
            }
            return addSlashes(obj);
        };
        var dateslib = require('dates');
        filters.relativeDate = function(date, kwargs) {
            var opts = _.defaults(kwargs || {}, {
                minUnit: 'm'
            });
            return dateslib.relativeDateString(new Date(date), opts);
        };

        nunjucks.env.dev = true;

        z.body.addClass('html-' + require('l10n').getDirection());

        // This lets you refresh within the app by holding down command + R.
        if (capabilities.chromeless) {
            window.addEventListener('keydown', function(e) {
                if (e.keyCode == 82 && e.metaKey) {
                    window.location.reload();
                }
            });
        }

        // Do some last minute template compilation.
        z.page.on('reload_chrome', function() {
            console.log('Reloading chrome');
            var context = {z: z};
            $('#site-header').html(
                nunjucks.env.render('header.html', context));
            $('#site-footer').html(
                nunjucks.env.render('footer.html', context));

            z.body.toggleClass('logged-in', require('user').logged_in());
            z.page.trigger('reloaded_chrome');
        }).trigger('reload_chrome');

        z.body.on('click', '.site-header .back', function(e) {
            e.preventDefault();
            console.log('← button pressed');
            require('navigation').back();
        });

        // Perform initial navigation.
        console.log('Triggering initial navigation');
        if (!z.spaceheater) {
            z.page.trigger('navigate', [window.location.pathname + window.location.search]);
        } else {
            z.page.trigger('loaded');
        }

        // Debug page
        (function() {
            var to = false;
            z.doc.on('touchstart mousedown', '.wordmark', function(e) {
                console.log('hold for debug...', e.type);
                clearTimeout(to);
                to = setTimeout(function() {
                    console.log('navigating to debug...');
                    z.page.trigger('navigate', ['/debug']);
                }, 3000);
            }).on('touchend mouseup', '.wordmark', function(e) {
                console.log('debug hold released...', e.type);
                clearTimeout(to);
            });
        })();

        console.log('Initialization complete');
    });

})();
