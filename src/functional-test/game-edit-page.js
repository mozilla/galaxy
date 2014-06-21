casper.test.begin('Game Edit Page Test', 1, function suite(test) {
	var root = 'http://0.0.0.0:8675';

    casper.start(root + '/game/nutty-ninjas/edit', function() {
        
    }).waitFor(function checkLoaded() {
        return this.evaluate(function() {
            return $(document).find("title").text() === 'Nutty Ninjas | Mozilla Galaxy';
        });
    }, function then() {
        test.assertExists('.game-form', 'Game form is present');
        // TODO: assert existing fields
        this.capture('test-results/game-edit-page.png', {
            top: 0,
            left: 0,
            width: 1200,
            height: 700
        });
    }, function timeout() {
        this.echo("Timeout: page did not load in time...").exit();
    }).then(function() {
        // TODO: change game name field and assert game slug
        // TODO: remove required fields fields and assert "save changes" button style
        // TODO: change screenshots and icons
        // TODO: save changes
    }).run(function() {
        test.done();
    });
});
