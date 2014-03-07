define('resize-textarea', ['underscore', 'z'], function(_, z) {
    // Auto-resizing functionality to all textareas on the page
    function resize(textarea) {
        var minHeight = textarea.getAttribute('data-min-height');
        if (minHeight && minHeight > textarea.scrollHeight) {
            textarea.style.height = minHeight + 'px';
        } else {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    }

    /* 0-timeout to get the already changed text */
    function delayedResize(e) {
        window.setTimeout(function() {
            resize(e.currentTarget);
        }, 0);
    }

    function resizeTextareasOnPage() {
        _.each(document.querySelectorAll('textarea'), function(obj) {
            resize(obj);
        });
    }

    z.page.on('loaded', resizeTextareasOnPage).on('input', 'textarea', delayedResize);

    return { resizeTextareas: resizeTextareasOnPage };
});
