// Generated by CoffeeScript 1.6.3
/*
  GamepadController (Orientation + buttons) for touch devices

  @class bkcore.GamepadController
  @author Mahesh Kulkarni <http://twitter.com/maheshkk>
*/


(function() {
  var GamepadController, exports, _base;

  GamepadController = (function() {
    GamepadController.isCompatible = function() {
      return ('getGamepads' in navigator ||
              'webkitGetGamepads' in navigator ||
              'webkitGamepads' in navigator);
    };

    /*
      Creates a new GamepadController
    */

    function GamepadController(buttonPressCallback) {
      this.buttonPressCallback = buttonPressCallback;
      this.active = true;
      this.leftStickArray = [];
      this.rightStickArray = [];

      var username = 'cvan';
      var controllerRef = new Firebase('https://galaxy-controller.firebaseio.com/' + username);

      this.state = {};

      controllerRef.on('value', function (snapshot) {
        var changedPost = snapshot.val();
        this.state = changedPost;
      }, function (err) {
        console.error('The read failed: ' + err.code);
      });
    }

    /*
      @public
    */
    GamepadController.prototype.updateAvailable = function() {
      return false;
      this.lstickx = this.state.turn;

      this.acceleration = this.state.accelerate;
      this.ltrigger = null;
      this.rtrigger = null;
      this.select = null;

      this.buttonPressCallback(this);

      return true;
    };

    return GamepadController;

  })();

  exports = exports != null ? exports : this;

  exports.bkcore || (exports.bkcore = {});

  (_base = exports.bkcore).controllers || (_base.controllers = {});

  exports.bkcore.controllers.GamepadController = GamepadController;

}).call(this);
