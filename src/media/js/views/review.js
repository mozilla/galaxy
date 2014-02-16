define('views/review', 
    ['forms', 'log', 'requests', 'urls', 'z'], 
    function(forms, log, requests, urls, z) {
    
    var console = log('review');

    return function(builder, args) {
        builder.start('admin/review.html').done(function() {
        });

        builder.z('type', 'leaf review');
        builder.z('title', gettext('Review'));
    };
});
