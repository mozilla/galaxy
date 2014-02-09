define('resize-textarea', ['underscore'], function(_) {
    // Attachs auto-resizing functionality to all textareas on the page
    var observe;
    if (window.attachEvent) {
        observe = function (element, event, handler) {
            element.attachEvent('on'+event, handler);
        };
    } else {
        observe = function (element, event, handler) {
            element.addEventListener(event, handler, false);
        };
    }
    function init() {

        function attachToTextArea(textarea) {
            function resize() {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight+'px';
            }
            /* 0-timeout to get the already changed text */
            function delayedResize () {
                window.setTimeout(resize, 0);
            }
            observe(textarea, 'change', resize);
            observe(textarea, 'cut', delayedResize);
            observe(textarea, 'paste', delayedResize);
            observe(textarea, 'drop', delayedResize);
            observe(textarea, 'keydown', delayedResize);

            resize();
        }
        _.map(document.querySelectorAll('textarea'), function(obj) {
            attachToTextArea(obj);
        })
    }
    return {
        attach: init
    }
    // Call .attach() after all textarea elements have loaded
});