define('media-input', ['jquery', 'z'], function($, z) {
    
    function createInput($section) {
        $section.append($('<input>', { type: 'text', placeholder: $section.data('placeholder')}));
    }

    z.page.on('loaded', function() {
        $('.fallback').each(function() {
            createInput($(this));
        });
    }).on('input', '.screenshots input[type=text], .videos input[type=text]', function(e) {
        var $input = $(e.target);
        var $allInputs = $input.parent().children('input[type=text]');
        var $emptyInputs = $allInputs.filter(function() {
            return !$(this).val();
        });

        if ($input.val() && $emptyInputs.length === 0) {
            createInput($input.parent());
        } else {
            // So that at any point in time, there will be exactly 
            // ONE empty input field for user to enter more URLs.
            $emptyInputs.slice(1).remove();
        }
    });
});
