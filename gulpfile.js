var gulp = require('gulp');
var argv = require('yargs').argv;


gulp.task('build', function () {
    switch (process.env.GALAXY_ENV) {
        case 'prod':
        default:
            console.log('Built prod environment');
            break;
    }
});
