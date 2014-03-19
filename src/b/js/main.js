(function () {

    var $body = $(document.body);

    $body.on('click', 'nav a, .detail-game-thumbnail', function () {
        // It's worth noting that if you navigate with the keyboard arrows,
        // a click event is also synthesised.
        var $this = $(this);
        $this.find('input').prop('checked', true).focus();
        if ($this.hasClass('selected')) {
            return;
        }
        if ($this.filter('a').length) {
            $('nav a.selected').removeClass('selected');
        } else {
            $this.closest('.detail-game-thumbnails').find('.selected').removeClass('selected');
        }
        $this.addClass('selected');
    }).on('change', 'nav input', function () {
        window.location.hash = '#!/game/' + $(this).val();
    }).on('click', '.detail-game-thumbnail', function () {
        $('.detail-game-media-selected').css('background-image', $(this).css('background-image'));
    }).on('change', '.detail-game-thumbnails input', function () {
        $(this).siblings('.detail-game-thumbnail').click();
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
            var section = hash.substr(2).replace('/game/', '');
            var $section = $('#' + section);
            if ($section.hasClass('selected')) {
                return;
            }
            $('.detail-game.selected').removeClass('selected');
            $section.addClass('selected');
        }
    }

    window.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            case 39:  // right arrow key
                $('nav a.selected input').trigger('blur');
                var $group = $('.detail-game.selected .detail-game-thumbnails');
                if ($group.find('input:checked').length) {
                    console.log('right checked')
                    //$group.find('input:checked').eq(0).trigger('focus').trigger('click').prop('checked', true);
                    $group.find('input').eq(0).trigger('focus').trigger('click').prop('checked', true);
                } else {
                    $group.find('input').eq(0).trigger('focus').trigger('click').prop('checked', true);
                }
                e.preventDefault();
                break;
            case 38:  // up arrow key
            case 40:  // down arrow key
                break;
            case 37:  // left arrow key
                $('nav a.selected input').trigger('focus').trigger('click').prop('checked', true);
                e.preventDefault();
      }
    }, false);

})();
