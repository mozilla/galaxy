(function () {

var username;
// if (localStorage.galaxy_username) {
//   username = localStorage.galaxy_username;
// } else {
//   // TODO: Use a real shortcode instead of simply asking for a username lol
//   localStorage.galaxy_username = username = window.prompt('What is your username?', 'guest');
// }

username = 'cvan';
var controllerRef = new Firebase('https://galaxy-controller.firebaseio.com/' + username);

controllerRef.update({accelerate: false});

// TODO: First check that the phone is paired before sending commands.

document.addEventListener('touchend', function (e) {
  socket.emit('accelerate', {accelerate: false});
}, false);

// Acclerate if the user touches the screen.
document.addEventListener('touchstart', function (e) {
  controllerRef.update({accelerate: true});
}, false);

// Stop accelerating if user stops touching screen.
document.addEventListener('touchend', function (e) {
  controllerRef.update({accelerate: false});
}, false);

// Prevent touchmove event from cancelling the `touchend` event above.
document.addEventListener('touchmove', function (e) {
  e.preventDefault();
}, false);


// Steer the vehicle based on the phone's orientation.
window.addEventListener('deviceorientation', function (e) {
  var a = e.alpha;  // Direction
  var b = e.beta;  // Left/right tilt
  var g = e.gamma;  // Forward/back tilt

  // Regardless of phone direction, left/right tilt should behave the same.
  var turn = b;
  if (a < 90 || a > 270) {
    turn = 0 - b;
  }

  console.log('[xxx]');


  // TODO: Should range be -180 to 180?
  var oldMin = -90;
  var oldMax = 90;
  var oldRange = oldMax - oldMin;

  var newMin = -1;
  var newMax = 1;
  var newRange = newMax - newMin;

  var turnRatio = (((turn - oldMin) * newRange) / oldRange) + newMin;
  console.log('[xxx] turnRatio', turnRatio);

  // Tell game to turn the vehicle.
  controllerRef.update({
    turnOriginal: turn,
    turn: turnRatio,
    g: a
  });
  // controllerRef.turn = turn;
  // controllerRef.g = a;
  // });
}, false);

})();
