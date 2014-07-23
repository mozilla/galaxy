(function () {

var $doc = $(document);

var turnLeftKey = 37;
var turnRightKey = 39;
var forwardKey = 38;
var backwardKey = 40;
var breakLeftKey = 65;
var breakRightKey = 68;

var keys = [37, 39, 40, 65, 68];

function resetEvents() {
  for (key in keys) {
     $doc.trigger(
        $.Event('keyup', {
           which: keys[key],
           keyCode: keys[key]
        })
     );
  }
}

function resetEvent(key) {
  $doc.trigger(
     $.Event('keyup', {
        which: key,
        keyCode: key
     })
  );
}

var turnLeftEvent = $.Event('keydown', {
  which: turnLeftKey,
  keyCode: turnLeftKey
});

var turnRightEvent = $.Event('keydown', {
  which: turnRightKey,
  keyCode: turnRightKey
});

var breakLeftEvent = $.Event('keydown', {
  which: breakLeftKey,
  keyCode: breakLeftKey
});

var breakRightEvent = $.Event('keydown', {
  which: breakRightKey,
  keyCode: breakRightKey
});


function turnLeft() {
  resetEvent(turnRightKey);
  $doc.trigger(turnLeftEvent);
}

function turnRight() {
  resetEvent(turnLeftKey);
  $doc.trigger(turnRightEvent);
}

function breakLeft() {
  resetEvent(breakRightKey);
  resetEvent(turnLeftKey);
  resetEvent(turnRightKey);

  $doc.trigger(breakLeftEvent);
}

function breakRight() {
  resetEvent(breakLeftKey);
  resetEvent(turnLeftKey);
  resetEvent(turnRightKey);

  $doc.trigger(breakRightEvent);
}

function forward() {
  $doc.trigger($.Event('keydown', {
    which: forwardKey,
    keyCode: forwardKey
  }));
}


var server = 'http://vigrond.com:3250';

function initPhoneController() {
   // Game config
   var leftBreakThreshold = -7;
   var leftTurnThreshold = -40;
   var rightBreakThreshold = 7;
   var rightTurnThreshold = 40;

   var controller = $("#controller");
   var gameConnect = $("#gameConnect");
   var wheel = $("#wheel");
   var status = $("#status");

   // If client is an Android Phone
   if (/Android/i.test(navigator.userAgent)) {
      // Show the controller UI with gamecode input
      controller.show();

      // When connect is pushed, establish socket connection
      $("#connect").click(function() {
        var gameCode = $("#socket input").val();
        var socket = io.connect(server);

        // When server replies with initial welcome...
        socket.on('welcome', function (data) {
          // Send 'controller' device type with our entered game code
          socket.emit("device", {"type": "controller", "gameCode": gameCode});
        });

         // When game code is validated, we can begin playing...
         socket.on("connected", function (data) {
            // Hide game code input, and show the vehicle wheel UI
            $("#socket").hide();
            wheel.show();

            // If user touches the screen, accelerate
            document.addEventListener("touchstart", function (event) {
               socket.emit("accelerate", {'accelerate':true});
               $('#forward').addClass('active');

            }, false);

            // Stop accelerating if user stops touching screen
            document.addEventListener("touchend", function (event) {
               socket.emit("accelerate", {'accelerate':false});
               $('#forward').removeClass('active');
            }, false);

          // Prevent touchmove event from cancelling the 'touchend' event above
          document.addEventListener("touchmove", function (event) {
            event.preventDefault();
          }, false);

          // Steer the vehicle based on the phone orientation
          window.addEventListener('deviceorientation', function (event) {
             var a = event.alpha; // "direction"
             var b = event.beta; // left/right 'tilt'
             var g = event.gamma; // forward/back 'tilt'

             // Regardless of phone direction,
             //  left/right tilt should behave the same
             var turn = b;
             if (a > 270 || a < 90) {
                turn = 0 - b;
             } else {
                turn = b;
             }

             // Update controller UI
             updateController(turn);

             // Tell game to turn the vehicle
            socket.emit("turn", {'turn':turn, 'g':a});
          }, false);
        });

        socket.on("fail", function() {
          status.html("Failed to connect");
        });
      });
   } else {
      // If client is browser game

      var socket = io.connect(server);

      // When initial welcome message, reply with 'game' device type.
      socket.on('welcome', function (data) {
        socket.emit("device", {"type":"game"});
      });

      // We receive our game code to show the user
      socket.on("initialize", function (gameCode) {
        $("#gameConnect").show();
        $("#socketId").html(gameCode);
      });

      // When the user inputs the code into the phone client,
      //  we become 'connected'.  Start the game.
      socket.on("connected", function (data) {
        $("#gameConnect").hide();
        $("#status").hide();

        init();
      });

      // When the phone is turned, turn the vehicle
      socket.on('turn', function(turn)
      {
        if (turn < leftBreakThreshold) {
          if (turn > leftTurnThreshold) {
            breakLeft();
          } else {
            turnLeft();
          }
        } else if (turn > rightBreakThreshold) {
          if (turn < rightTurnThreshold) {
            breakRight();
          } else {
            turnRight();
          }
        } else {
          resetEvents();
        }
      });

    // When the phone is touched, accelerate the vehicle.
    socket.on("accelerate", function (accelerate) {
      if (accelerate) {
          forward();
      } else {
        resetEvent(forwardKey);
      }
    });
  }

  // Helper function to update controller UI
  function updateController(turn) {
    // Rotate forward indicator towards direction of vehicle
    $('#forward').css('transform', 'rotate(' + (turn) + 'deg)');

    // Activate/Deactivate turn / airbreak signals based on turn degree

    if (turn < leftBreakThreshold) {
      $('#stopRight, #turnRight').removeClass('active');
      if (turn > leftTurnThreshold) {
        $('#stopLeft').addClass('active');
      } else {
        $('#turnLeft').addClass('active');
      }
    } else if (turn > rightBreakThreshold) {
       $('#stopLeft, #turnLeft').removeClass('active');
       if (turn < rightTurnThreshold) {
        $('#stopRight').addClass('active');
       } else {
        $('#turnRight').addClass('active');
      }
    } else {
      $('#stopLeft, #turnLeft, #stopRight, #turnRight').removeClass('active');
    }
  }
}

})();
