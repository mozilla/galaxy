var settings = require('./settings_local.js');

// TODO: Use express-validator.
var api = require('express-api-helper');
var express = require('express');
var redis = require('redis');
var stripe = require('stripe')(settings.stripe.private);

var redisClient = redis.createClient(settings.redis.port || '', settings.redis.host || '');
if (settings.redis.auth) {
    redisClient.auth(settings.redis.auth);
}

var app = express(express.logger());

app.use('/static', express.static(__dirname + '/static'));
app.use(express.bodyParser());

express.static.mime.define({'application/x-chrome-extension': ['crx']});

/**
 * HTTP GET /app/:slug/manifest/
 * Body Param: the JSON app you want to create
 * Returns: 200 HTTP code
 */
app.get('/app/:slug/manifest/:format', function(req, res) {
    // TODO: Read from CouchDB.
    // TODO: Serve manifest from subdomain.
    // TODO: Add /index.html from each subdomain.
    var format = req.params.format;
    var slug = req.params.slug;
    var app = {
        name: '{name}',
        description: '{description}',
        icons: '{icons}',
        launch_path: '/index.html?{url}',
        default_locale: '{default_locale}',
        locales: '{locales}',
        orientation: '{orientation}',
        fullscreen: '{fullscreen}',
        developer: {
            name: '{developer.name}',
            url: '{developer.url}'
        },
        appcache_path: '{appcache_path}'

    };

    // Demo.
    if (slug == 'hexgl') {
        if (format == 'firefox') {
            app = {
                name: 'HexGL',
                description: 'HexGL is a futuristic, fast-paced racing game built by Thibaut Despoulain using HTML5, Javascript and WebGL and a tribute to the original Wipeout and F-Zero series.',
                icons: {
                    '240': 'http://hexgl.bkcore.com/thumbs/hexmki.png'
                },
                launch_path: '/static/launcher.html?http://cvan.github.io/HexGL/',
                fullscreen: 'true',
                developer: {
                    name: 'Thibaut Despoulain',
                    url: 'http://bkcore.com/'
                }
            };
        } else {
            app = {
                name: 'HexGL',
                description: 'HexGL is a futuristic, fast-paced racing game built by Thibaut Despoulain using HTML5, Javascript and WebGL and a tribute to the original Wipeout and F-Zero series.',
                version: '1',
                icons: {
                    '240': 'http://hexgl.bkcore.com/thumbs/hexmki.png'
                },
                app: {
                    urls: [
                        '*://cvan.github.io/'
                    ],
                    launch: {
                        container: 'panel',
                        //height:
                        //width:
                        web_url: 'http://cvan.github.io/HexGL/'
                    }
                },
                manifest_version: 2,
            };
        }
    }

    if (format == 'firefox') {
        res.contentType('application/x-web-app-manifest+json');
    } else if (format == 'chrome') {
        res.contentType('application/application/x-chrome-extension');
    }

    api.ok(req, res, app);
});

/**
 * HTTP POST /submit/
 * Body Param: the JSON app you want to create
 * Returns: 200 HTTP code
 */
app.post('/submit', function(req, res) {
    api.requireParams(req, res, ['url', 'name', 'icons', 'screenshots'], function(err) {
        if (err) {
            return api.serverError(req, res, err);
        }

        var form = req.body;
        var app = {
            url: form.url,
            name: form.name,  // maxlength: 128
            description: form.description,
            icons: form.icons,
            default_locale: form.default_locale,
            locales: form.locales,
            orientation: form.orientation,
            fullscreen: form.fullscreen,

            // Galaxy-specific metadata.
            screenshots: form.screenshots,
            privacy: form.privacy_policy,
            license: form.license
        };

        // TODO: Pull web page. If using appcache, then set `appcache_path`.
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening on', port);
});
