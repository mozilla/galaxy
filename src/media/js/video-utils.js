define('video-utils',
       ['l10n', 'jquery', 'requests', 'settings'],
       function(l10n, $, requests, settings) {

    function parseVideo(url) {
        // - Supported YouTube URL formats:
        //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
        //   - http://youtu.be/My2FRPA3Gf8
        //   - https://youtube.googleapis.com/v/My2FRPA3Gf8
        //   - //www.youtube.com/embed/My2FRPA3Gf8
        // - Supported Vimeo URL formats:
        //   - http://vimeo.com/25451551
        //   - http://player.vimeo.com/video/25451551
        // - Also supports relative URLs:
        //   - //player.vimeo.com/video/25451551

        url.match(/(https?:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

        if (RegExp.$3.indexOf('youtu') > -1) {
            var type = 'youtube';
        } else if (RegExp.$3.indexOf('vimeo') > -1) {
            var type = 'vimeo';
        }

        return {
            type: type,
            id: RegExp.$6
        };
    }

    function createVideoFromUrl(url, width, height) {
        var videoObj = parseVideo(url);
        return createVideoFromId(videoObj.id, videoObj.type, width, height);
    }

    function createVideoFromId(id, type, width, height) {
        var $iframe = $('<iframe>', {width: width, height: height});
        $iframe.attr('frameborder', 0);
        if (type === 'youtube') {
            $iframe.attr('src', settings.video_utils_urls.youtube.iframe.replace('<id>', id));
        } else if (type === 'vimeo') {
            $iframe.attr('src', settings.video_utils_urls.vimeo.iframe.replace('<id>', id));
        }
        return $iframe;
    }

    function getVideoThumbnailFromUrl(url, cb) {
        var videoObj = parseVideo(url);
        getVideoThumbnailFromId(videoObj.id, videoObj.type, cb);
    }

    function getVideoThumbnailFromId(id, type, cb) {
        if (type === 'youtube') {
            cb(settings.video_utils_urls.youtube.thumbnail.replace('<id>', id));
        } else if (type === 'vimeo') {
            requests.get(settings.video_utils_urls.vimeo.thumbnail.replace('<id>', id)).then(function(data) {
                cb(data[0].thumbnail_large);
            });
        }
    }

    return {
        parseVideo: parseVideo,
        createVideoFromUrl: createVideoFromUrl,
        createVideoFromId: createVideoFromId,
        getVideoThumbnailFromUrl: getVideoThumbnailFromUrl,
        getVideoThumbnailFromId: getVideoThumbnailFromId
    };
});
