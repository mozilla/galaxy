casper.test.begin('Game Submission Page Test', 5, function suite(test) {
	var root = 'http://0.0.0.0:8675';

    casper.start(root + '/game/nutty-ninjas/edit', function() {
        
    }).waitFor(function checkLoaded() {
        return this.evaluate(function() {
            // to do: check title text match
            return $(document).find("title").text() === 'Nutty Ninjas | Mozilla Galaxy';
        });
    }, function then() {
        // to do: add statis components assertions (pre-filled fields)
    }, function timeout() {
        this.echo("Timeout: page did not load in time...").exit();
    }).then(function() {
        // to do: add user interactions tests
        //      - modify game name and assert game slug
        //      - change screenshots
        //      - remove required fileds
        //      - save changes
    }).run(function() {
        test.done();
    });
});