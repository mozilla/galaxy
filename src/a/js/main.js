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
        // window.history.pushState({}, '', '/game/' + $(this).val());
        window.location.hash = '#!/game/' + $(this).val();
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

// var firstRadio = $('nav input');
// firstRadio.checked = true;


// var keys = {};
// window.addEventListener('keydown', function (e) {
//   console.log(e.keyCode)
//   switch (e.keyCode) {
//     case 39:  // right arrow key
//       var $group = $('input[type=radio]:checked').closest('label').next('.horiz');
//       if ($group.find('input[type=radio]:checked').length) {
//         $group.find('input[type=radio]:checked').trigger('focus');
//       } else {
//         $group.find('label:first-child input[type=radio]').trigger('focus').prop('checked', true);
//       }
//       e.preventDefault();
//       break;
//     case 37:  // left arrow key
//       $('input[type=radio]:checked').closest('.horiz').prev('label').find('input[type=radio]').trigger('focus').prop('checked', true);
//       e.preventDefault();
//   }
// }, false);


})();
