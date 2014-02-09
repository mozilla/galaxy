define('resize-textarea', ['underscore', 'z'], function(_, z) {
    // Auto-resizing functionality to all textareas on the page
    function resize(textarea) {
        textarea.style.height = textarea.scrollHeight + 'px';
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

    z.doc.on('loaded', resizeTextareasOnPage).on('input', 'textarea', delayedResize);
});
