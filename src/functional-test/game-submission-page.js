casper.test.begin('Game Submission Page Test', 3, function suite(test) {
	var root = 'http://0.0.0.0:8675';

    casper.start(root + '/submit', function() {
        
    }).waitFor(function checkLoaded() {
        return this.evaluate(function() {   
            return $(document).find("title").text() === 'Submit a Game | Mozilla Galaxy';
        });
    }, function then() {
        test.assertExists('.game-form', 'Game form is present');
        this.capture('game-submission-page.png', {
            top: 0,
            left: 0,
            width: 1200,
            height: 700
        });
    }, function timeout() {
        this.echo("Timeout: page did not load in time...").exit();
    }).then(function() {
        // check if empty string can be accepted as game name
        this.click('input[name=name]');
        this.page.sendEvent('keypress', ' ');
        this.wait(100, function() {
            test.assert(this.evaluate(function() {
                return $('.input[name=name]').css('border-color') === "rgb(218, 62, 90)";
            }), 'empty name is not accepted');
        });
        
        // check if game slug is correct representing game title
        this.evaluate(function() {
            $('input[name=name]').val('');
        });
        this.page.sendEvent('keypress', 'test/game with 123 and .,-<>?_*&4');
        this.wait(100, function() {
            test.assert(this.evaluate(function() {
                return $('input[name=slug]').val() === 'testgame-with-123-and-4';
            }), 'slug is correct');
        });

        // TODO: enter url on media fields
        // TODO: upload image on media fields (need to figure out a way how to use aviary in testing)
        // TODO: enter valid game details and submit (will be later asserted on detail page)
    }).run(function() {
        test.done();
    });
});