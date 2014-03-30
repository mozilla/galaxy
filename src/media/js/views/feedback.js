define('views/feedback',
       ['l10n', 'jquery', 'forms', 'notification', 'requests', 'resize-textarea', 'routes_api', 'templates', 'urls', 'utils', 'z'],
       function(l10n, $, forms, notification, requests, rt, routes_api, nunjucks, urls, utils, z) {

    var gettext = l10n.gettext;
    var notify = notification.notification;

    z.page.on('submit', '.feedback-form', function(e) {
        e.preventDefault();

        var $this = $(this);
        if ($.trim($this.val()) === '') {
            notify({
                message: gettext('Please enter a feedback.')
            });
            return;
        }

        var data = utils.getVars($this.serialize());
        data.page_url = window.location.pathname;
        
        forms.toggleSubmitFormState($this);

        requests.post(urls.api.url('feedback'), data).done(function(data) {
            $this.find('textarea').val('');
            forms.toggleSubmitFormState($this, true);
            $('.cloak').trigger('dismiss');
            notify({
                message: gettext('Feedback submitted. Thanks!') 
            });
        }).fail(function() {
            forms.toggleSubmitFormState($this, true);
            notify({
                message: gettext('There was a problem submitting your feedback. Try again soon.')
            });
        });
    });

    // Init desktop feedback form modal trigger.
    function addFeedbackModal(decloak) {
        if (!$('.main.feedback:not(.modal)').length && !$('.feedback.modal').length) {
            z.page.append(nunjucks.env.render('feedback.html'));
            rt.resizeTextareas();
        }
        if (!decloak) {
            z.body.trigger('decloak');
        }
    }

    z.body.on('click', '.submit-feedback', function(e) {
        e.preventDefault();
        e.stopPropagation();
        // Focus the form if we're on the feedback page.
        if ($('.main.feedback:not(.modal)').length) {
            $('.simple-field textarea').trigger('focus');
            return;
        }
        addFeedbackModal();
        $('.feedback.modal').addClass('show');
    });

    z.body.on('click', '.close', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('.feedback').removeClass('show');
        return;
    });

    return function(builder) {
        builder.start('feedback.html').done(function() {
            $('.feedback').removeClass('modal');
            addFeedbackModal(true);
        });

        builder.z('type', 'leaf');
        builder.z('title', gettext('Feedback'));
    };
});
