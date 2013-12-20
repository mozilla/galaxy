define('views/friends',
       ['requests', 'templates', 'urls', 'utils', 'z'],
       function(requests, nunjucks, urls, utils, z) {

    z.body.on('submit', '.user-search', function(e) {
        e.preventDefault();

        var $this = $(this);
        var $results = $('.user-results');

        requests.get(utils.urlparams(urls.api.url('user.search'), {
            q: $this.find('[name=q]').val()
        })).done(function(data) {
            if (data.error) {
                $results.html('');
                return;
            }
            $results.html(
                nunjucks.env.render('friends/search-results.html', {data: data})
            );
        }).fail(function() {
            $results.html('');
        });
    });

    return function(builder) {
        builder.start('friends/main.html').done(function() {
        });

        builder.z('type', 'leaf friends');
        builder.z('title', gettext('Friends'));
    };
});
