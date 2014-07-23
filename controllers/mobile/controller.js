(function () {

var username;
if (localStorage.galaxy_username) {
  username = localStorage.galaxy_username;
} else {
  // TODO: Use a real shortcode instead of simply asking for a username lol
  localStorage.galaxy_username = username = window.prompt('What is your username?', 'guest');
}

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

  // Tell game to turn the vehicle.
  controllerRef.update({
    turn: turn,
    g: a
  });
  // controllerRef.turn = turn;
  // controllerRef.g = a;
  // });
}, false);

})();
