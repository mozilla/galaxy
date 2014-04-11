casper.test.begin('Game Submission Page Test', 5, function suite(test) {
	var root = 'http://0.0.0.0:8675';

    casper.start(root + '/submit', function() {
        
    }).waitFor(function checkLoaded() {
        return this.evaluate(function() {
            // to do: check title text match
            return $(document).find("title").text() === 'Nutty Ninjas | Mozilla Galaxy';
        });
    }, function then() {
        // to do: add statis components assertions
    }, function timeout() {
        this.echo("Timeout: page did not load in time...").exit();
    }).then(function() {
        // to do: add user interactions tests
        //      - clicking on "submit" button, assert notification
        //      - enter empty space, new line, tab on required fields, assert style
        //      - enter invalid url, assert style
        //      - enter game title, assert game slug
        //      - enter url on media fields
        //      - upload image on media fields
        //      - enter valid game details and submit (will be later asserted on detail page)
    }).run(function() {
        test.done();
    });
});