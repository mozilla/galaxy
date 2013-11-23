var settings = require('./settings_local.js');

var stripe = require('stripe')(settings.stripe.private);

var restify = require('restify');
var restifySwagger = require('node-restify-swagger');
var restifyValidation = require('node-restify-validation');

var server = restify.createServer({
    name: 'galaxy',
    version: '0.0.1'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser());
server.use(restify.gzipResponse());
server.use(restify.queryParser());
server.use(restifyValidation.validationPlugin({errorsAsArray: false}));
restifySwagger.configure(server);


server.get({
    url: '/app/:slug/manifest/',
    swagger: {
        summary: '',
        notes: '',
        nickname: ''
    },
    validation: {
    }
}, function(req, res) {
    // TODO: Read from CouchDB.
    // TODO: Serve manifest from subdomain.
    // TODO: Add /index.html from each subdomain.
    var format = 'firefox';
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
                        web_url: 'http://cvan.github.io/HexGL/'
                    }
                },
                manifest_version: 2,
            };
        }
    }
    res.contentType = 'application/x-web-app-manifest+json';
    res.send(app);
});


server.post({
    url: '/submit',
    swagger: {
        summary: 'Submission',
        nickname: 'submit'
    },
    validation: {
        url: {
            isRequired: true,
        },
        name: {
            isRequired: true,
            description: 'Name of app'
        },
        icons: {
            isRequired: true,
            description: 'Icons'
        },
        screenshots: {
            isRequired: true,
            description: 'Screenshots'
        }
    }
}, function(req, res) {
    var form = req.body;
    var app = {
        slug: form.slug,
        url: form.url,
        name: form.name,  // maxlength: 128
        description: form.description,
        icons: form.icons,
        default_locale: form.default_locale,
        locales: form.locales,
        orientation: form.orientation,
        fullscreen: form.fullscreen,
        appcache_path: form.appcache_path,

        // Galaxy-specific metadata.
        screenshots: form.screenshots,
        privacy: form.privacy_policy,
        license: form.license
    };
    res.json({success: true});
    // TODO: Pull web page. If using appcache, then set `appcache_path`.
});


restifySwagger.loadRestifyRoutes();


server.listen(process.env.PORT || 5000, function() {
    console.log('%s listening at %s', server.name, server.url);
});
