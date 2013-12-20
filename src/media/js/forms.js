define('forms', ['z'], function(z) {

    function checkValid(form) {
        if (form) {
            $(form).filter(':not([novalidate])').find('button[type=submit]').attr('disabled', !form.checkValidity());
        }
    }

    z.body.on('blur change keypress paste', 'input, select, textarea', function(e) {
        var $this = $(this);
        checkValid(e.target.form);
        // If it's required, show :valid/:invalid styles -OR-
        // if it's optional, show styles when there's some text in the value.
        $this.toggleClass('focused', this.hasAttribute('required') || !!$this.val());
    }).on('blur', 'input, select, textarea', function(e) {
        var $this = $(this);
        $this.toggleClass('focused', this.hasAttribute('required') || !!$this.val());
    }).on('loaded decloak', function() {
        $('form:not([novalidate])').each(function() {
            checkValid(this);
        });
        $('form[novalidate] button[type=submit]').removeAttr('disabled');
    }).on('focus', 'input[type=url]', function(e) {
        console.log(e.type);
        var $this = $(this);
        if (!$this.val()) {
            // This `setTimeout` is so we set the value *after* the field has
            // been focussed; otherwise, the text will be highlighted upon focus.
            setTimeout(function() {
                $this.val('http://');
            }, 0);
        }
    }).on('blur', 'input[type=url]', function() {
        var $this = $(this);
        if ($this.val() === 'http://') {
            $this.val('');
            if (!this.hasAttribute('required')) {
                $this.removeClass('focused');
            }
        }
    });

    // Use this if you want to disable form inputs while the post/put happens.
    function toggleSubmitFormState($formElm, enabled) {
        $formElm.find('textarea, button, input').prop('disabled', !enabled);
        $formElm.find('.ratingwidget').toggleClass('disabled', !enabled);
        if (enabled) {
            checkValid($formElm[0]);
        }
    }

    return {toggleSubmitFormState: toggleSubmitFormState};

});
