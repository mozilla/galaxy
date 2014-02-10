define('resize-textarea', ['underscore'], function(_) {
    // Attachs auto-resizing functionality to all textareas on the page

    function init() {
        function attachToTextArea(textarea) {
            function resize() {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            }
            /* 0-timeout to get the already changed text */
            function delayedResize () {
                window.setTimeout(resize, 0);
            }
            textarea.addEventListener('change', resize);
            textarea.addEventListener('cut', delayedResize);
            textarea.addEventListener('paste', delayedResize);
            textarea.addEventListener('drop', delayedResize);
            textarea.addEventListener('keydown', delayedResize);

            resize();
        }
        
        _.each(document.querySelectorAll('textarea'), function(obj) {
            attachToTextArea(obj);
        })
    }

    return {
        attach: init
    }
    // Call .attach() after all textarea elements have loaded
});
