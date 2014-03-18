(function () {

    var $body = $(document.body);

    $body.on('click', 'nav a', function () {
        // It's worth noting that if you navigate with the keyboard arrows,
        // a click event is also synthesised.
        var $this = $(this);
        $this.find('input').prop('checked', true).focus();
        if ($this.hasClass('selected')) {
            return;
        }
        $('nav a').removeClass('selected');
        $this.addClass('selected');
    }).on('change', 'nav input', function () {
        window.location.hash = '#!/dashboard/' + $(this).val();
    });

    window.addEventListener('hashchange', function() {
        selectIt();
    }, false);

    selectIt();

    function selectIt() {
        var hash = window.location.hash;
        if (hash) {
            $('a[href="' + hash + '"] input').prop('checked', true).focus();
            $('a[href="' + hash + '"]').click();
        }
        if (hash.substr(0, 2) === '#!') {
            var section = hash.substr(2).replace('/dashboard/', '');
            var $section = $('#' + section);
            if ($section.hasClass('selected')) {
                return;
            }
            $('section.selected').removeClass('selected');
            $section.addClass('selected');
        }
    }

    $('nav').slinky();

})();
