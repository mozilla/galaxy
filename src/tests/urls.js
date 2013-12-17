(function() {
var a = require('assert');
var assert = a.assert;
var eq_ = a.eq_;
var contains = a.contains;
var disincludes = a.disincludes;
var mock = a.mock;

var urls = require('urls');

function mock_routes(routes, runner, fail) {
    var temp = window.routes;
    window.routes = routes;
    try {
        runner();
    } catch(e) {
        fail(e);
    }
    window.routes = temp;
}

test('reverse', function(done, fail) {
    mock_routes([
        {pattern: '^/$', view_name: 'homepage'},
        {pattern: '^/app/(.+)$', view_name: 'app'}
    ], function() {
        var reverse = urls.reverse;
        eq_(reverse('homepage'), '/');
        eq_(reverse('app', ['slug']), '/app/slug');
        done();
    }, fail);
});

test('reverse missing args', function(done, fail) {
    mock_routes([
        {pattern: '^/$', view_name: 'homepage'},
        {pattern: '^/app/(.+)$', view_name: 'app'}
    ], function() {
        var reverse = urls.reverse;
        try {
            reverse('app', []);
        } catch(e) {
            return done();
        }
        fail('reverse() did not throw exception');
    }, fail);
});

test('reverse too many args', function(done, fail) {
    mock_routes([
        {pattern: '^/$', view_name: 'homepage'},
        {pattern: '^/app/(.+)$', view_name: 'app'}
    ], function() {
        var reverse = urls.reverse;
        try {
            reverse('app', ['foo', 'bar']);
        } catch(e) {
            return done();
        }
        fail('reverse() did not throw exception');
    }, fail);
});

test('api url', function(done, fail) {
    mock(
        'urls',
        {
            capabilities: {firefoxOS: true, widescreen: function() { return false; }, touch: 'foo'},
            routes_api: {'homepage': '/foo/homepage'},
            routes_api_args: function() {return function() {return function() {return {foo: 'bar'};};};},  // Functions get pre-evaluated.
            settings: {api_url: 'api:'}
        }, function(urls) {
            var homepage_url = urls.api.url('homepage');
            eq_(homepage_url.substr(0, 17), 'api:/foo/homepage');
            contains(homepage_url, 'foo=bar');
            done();
        },
        fail
    );
});

test('api url signage', function(done, fail) {
    mock(
        'urls',
        {
            capabilities: {firefoxOS: true, widescreen: function() { return false; }, touch: 'foo'},
            routes_api: {'homepage': '/foo/homepage'},
            routes_api_args: function() {return function() {return function() {return {foo: 'bar'};};};},  // Functions get pre-evaluated.
            settings: {api_url: 'api:'}
        }, function(urls) {
            var homepage_url = urls.api.unsigned.url('homepage');
            eq_(homepage_url, 'api:/foo/homepage');
            eq_(urls.api.sign(homepage_url), urls.api.url('homepage'));
            disincludes(homepage_url, 'foo=bar');
            contains(urls.api.sign(homepage_url), 'foo=bar');
            done();
        },
        fail
    );
});

test('api url blacklist', function(done, fail) {
    mock(
        'urls',
        {
            capabilities: {firefoxOS: true, widescreen: function() { return false; }, touch: 'foo'},
            routes_api: {'homepage': '/foo/homepage'},
            settings: {api_url: 'api:', api_param_blacklist: ['region']}
        }, function(urls) {
            var homepage_url = urls.api.url('homepage');
            eq_(homepage_url.substr(0, 17), 'api:/foo/homepage');
            disincludes(homepage_url, 'region=');
            done();
        },
        fail
    );
});

test('api url params', function(done, fail) {
    mock(
        'urls',
        {
            routes_api: {'homepage': '/foo/asdf'},
            settings: {api_url: 'api:'}
        }, function(urls) {
            var homepage_url = urls.api.params('homepage', {q: 'poop'});
            eq_(homepage_url.substr(0, 13), 'api:/foo/asdf');
            contains(homepage_url, 'q=poop');
            done();
        },
        fail
    );
});

})();
