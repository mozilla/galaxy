casper.test.begin('Game Detail Page Test', 5, function suite(test) {
    var root = 'http://0.0.0.0:8675';

    casper.start(root + '/game/nutty-ninjas/detail', function() {
        
    }).waitFor(function checkLoaded() {
        return this.evaluate(function() {
            return $(document).find("title").text() === 'Nutty Ninjas | Mozilla Galaxy';
        });
    }, function then() {
        // to do: assertian static game details
    }, function timeout() {
        this.echo("Timeout: page did not load in time...").exit();
    }).then(function() {
        // to do: 
        //      - check new game play button
    }).run(function() {
        test.done();
    });
});
