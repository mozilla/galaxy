define('views/feature', 
    ['format', 'log', 'notification', 'requests', 'urls', 'z'], 
    function(format, log, notification, requests, urls, z) {
    


    return function(builder, args) {
        builder.start('admin/feature.html');

        builder.z('type', 'leaf dashboard curation');
        builder.z('title', gettext('Curation Dashboard'));

    };
});
