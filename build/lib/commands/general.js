'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appiumBaseDriver = require('appium-base-driver');

var _appiumIosDriver = require('appium-ios-driver');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var commands = {};

commands.active = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (this.isWebContext()) {
          context$1$0.next = 2;
          break;
        }

        throw new _appiumBaseDriver.errors.UnknownError('Command should be proxied to WDA');

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.executeAtom('active_element', []));

      case 4:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

/**
 * Close app (simulate device home button). It is possible to restore
 * the app after the timeout or keep it minimized based on the parameter value.
 *
 * Possible values for `duration`:
 * - any positive number of seconds: come back after X seconds, show deprecation warning
 * - any negative number of seconds: never come back, show deprecation warning
 * - undefined: come back after the default timeout (defined by WDA), show deprecation warning. After deprecation: never come back
 * - {timeout: 5000}: come back after 5 seconds
 * - {timeout: null}, {timeout: -2}: never come back
 */
commands.background = function callee$0$0(duration) {
  var homescreenEndpoint, deactivateAppEndpoint, endpoint, params;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        homescreenEndpoint = '/wda/homescreen';
        deactivateAppEndpoint = '/wda/deactivateApp';
        endpoint = undefined;
        params = undefined;

        if (_lodash2['default'].isUndefined(duration)) {
          // TODO: Replace the block after deprecated stuff is removed
          // endpoint = homescreenEndpoint;
          _logger2['default'].warn('commands.background: Application under test will never be restored in the future if no duration is provided. ' + 'See https://github.com/appium/appium/issues/7741');
          endpoint = deactivateAppEndpoint;
          params = {};
        } else if (_lodash2['default'].isNumber(duration)) {
          // TODO: deprecate this case
          _logger2['default'].warn('commands.background: Passing numbers to \'duration\' argument is deprecated. ' + 'See https://github.com/appium/appium/issues/7741');
          if (duration >= 0) {
            params = { duration: duration };
            endpoint = deactivateAppEndpoint;
          } else {
            endpoint = homescreenEndpoint;
          }
        } else if (_lodash2['default'].isPlainObject(duration)) {
          if (_lodash2['default'].has(duration, 'timeout')) {
            if (duration.timeout === null) {
              endpoint = homescreenEndpoint;
            } else if (_lodash2['default'].isNumber(duration.timeout)) {
              if (duration.timeout >= 0) {
                params = { duration: duration.timeout / 1000.0 };
                endpoint = deactivateAppEndpoint;
              } else {
                endpoint = homescreenEndpoint;
              }
            }
          }
        }
        if (_lodash2['default'].isUndefined(endpoint)) {
          _logger2['default'].errorAndThrow('commands.background: Argument value is expected to be an object or \'undefined\'. ' + ('\'' + duration + '\' value has been provided instead. ') + 'The \'timeout\' attribute can be \'null\' or any negative number to put the app under test ' + 'into background and never come back or a positive number of milliseconds to wait until the app is restored.');
        }
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.proxyCommand(endpoint, 'POST', params, endpoint !== homescreenEndpoint));

      case 8:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

/*
 * Simulate Touch ID with either valid (match === true) or invalid (match === false)
 * fingerprint (Simulator only)
 */
commands.touchId = function callee$0$0() {
  var match = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (this.isSimulator()) {
          context$1$0.next = 2;
          break;
        }

        throw new _appiumBaseDriver.errors.UnknownError('Touch ID simulation not supported on real devices');

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/touch_id', 'POST', { match: match }));

      case 4:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

/**
 * Toggle enrollment of touchId (Simulator only)
 *
 * @param {boolean} enabled - Equals to true if TouchID enrollment should be enabled.
 *   All the further calls to this method will only change the state of TouchID
 *   enrollment if _enabled_ argument value has been inverted. It is mandatory
 *   that Appium daemon process (or its parent process) has access to MacOS accessibility
 *   in System Preferences, otherwise this call will throw an error.
 * @throws errors.UnknownError If current device is a real device.
 * @throws Error If Simulator appication is not running or Appium process has
 *   no access to system accessibility.
 */
commands.toggleEnrollTouchId = function callee$0$0() {
  var enabled = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (this.isSimulator()) {
          context$1$0.next = 2;
          break;
        }

        throw new _appiumBaseDriver.errors.UnknownError('Touch ID simulation not supported on real devices');

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.opts.device.enrollTouchID(enabled));

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.getWindowSize = function callee$0$0() {
  var windowHandle = arguments.length <= 0 || arguments[0] === undefined ? 'current' : arguments[0];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!(windowHandle !== "current")) {
          context$1$0.next = 2;
          break;
        }

        throw new _appiumBaseDriver.errors.NotYetImplementedError('Currently only getting current window size is supported.');

      case 2:
        if (this.isWebContext()) {
          context$1$0.next = 8;
          break;
        }

        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(this.proxyCommand('/window/size', 'GET'));

      case 5:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 8:
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(this.executeAtom('get_window_size', []));

      case 10:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 11:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.hideKeyboard = function callee$0$0(strategy) {
  for (var _len = arguments.length, possibleKeys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    possibleKeys[_key - 1] = arguments[_key];
  }

  var keyboard, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key, el, buttons;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!((this.opts.deviceName || '').indexOf('iPhone') === -1)) {
          context$1$0.next = 10;
          break;
        }

        context$1$0.prev = 1;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/keyboard/dismiss', 'POST'));

      case 4:
        return context$1$0.abrupt('return');

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](1);

        _logger2['default'].debug('Cannot dismiss the keyboard using the native call. Trying to apply a workaround...');

      case 10:
        keyboard = undefined;
        context$1$0.prev = 11;
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeKeyboard', false));

      case 14:
        keyboard = context$1$0.sent;
        context$1$0.next = 21;
        break;

      case 17:
        context$1$0.prev = 17;
        context$1$0.t1 = context$1$0['catch'](11);

        // no keyboard found
        _logger2['default'].debug('No keyboard found. Unable to hide.');
        return context$1$0.abrupt('return');

      case 21:
        possibleKeys.pop(); // last parameter is the session id
        possibleKeys = possibleKeys.filter(function (element) {
          return !!element;
        }); // get rid of undefined elements

        if (!possibleKeys.length) {
          context$1$0.next = 60;
          break;
        }

        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;
        context$1$0.prev = 27;
        _iterator = _getIterator(possibleKeys);

      case 29:
        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
          context$1$0.next = 44;
          break;
        }

        key = _step.value;
        context$1$0.t2 = _lodash2['default'];
        context$1$0.next = 34;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('accessibility id', key, true, keyboard));

      case 34:
        context$1$0.t3 = context$1$0.sent;
        el = context$1$0.t2.last.call(context$1$0.t2, context$1$0.t3);

        if (!el) {
          context$1$0.next = 41;
          break;
        }

        _logger2['default'].debug('Attempting to hide keyboard by pressing \'' + key + '\' key.');
        context$1$0.next = 40;
        return _regeneratorRuntime.awrap(this.nativeClick(el));

      case 40:
        return context$1$0.abrupt('return');

      case 41:
        _iteratorNormalCompletion = true;
        context$1$0.next = 29;
        break;

      case 44:
        context$1$0.next = 50;
        break;

      case 46:
        context$1$0.prev = 46;
        context$1$0.t4 = context$1$0['catch'](27);
        _didIteratorError = true;
        _iteratorError = context$1$0.t4;

      case 50:
        context$1$0.prev = 50;
        context$1$0.prev = 51;

        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }

      case 53:
        context$1$0.prev = 53;

        if (!_didIteratorError) {
          context$1$0.next = 56;
          break;
        }

        throw _iteratorError;

      case 56:
        return context$1$0.finish(53);

      case 57:
        return context$1$0.finish(50);

      case 58:
        context$1$0.next = 71;
        break;

      case 60:
        // find the keyboard, and hit the last Button
        _logger2['default'].debug('Finding keyboard and clicking final button to close');
        context$1$0.next = 63;
        return _regeneratorRuntime.awrap(this.getAttribute('visible', keyboard));

      case 63:
        if (context$1$0.sent) {
          context$1$0.next = 66;
          break;
        }

        _logger2['default'].debug('No visible keyboard found. Returning');
        return context$1$0.abrupt('return');

      case 66:
        context$1$0.next = 68;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeButton', true, keyboard));

      case 68:
        buttons = context$1$0.sent;
        context$1$0.next = 71;
        return _regeneratorRuntime.awrap(this.nativeClick(_lodash2['default'].last(buttons)));

      case 71:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 7], [11, 17], [27, 46, 50, 58], [51,, 53, 57]]);
};

commands.getDeviceTime = _appiumIosDriver.iosCommands.general.getDeviceTime;

commands.getStrings = _appiumIosDriver.iosCommands.general.getStrings;

commands.removeApp = function callee$0$0(bundleId) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.opts.device.removeApp(bundleId));

      case 2:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.launchApp = _appiumIosDriver.iosCommands.general.launchApp;

commands.closeApp = _appiumIosDriver.iosCommands.general.closeApp;

commands.keys = function callee$0$0(keys) {
  var el;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (this.isWebContext()) {
          context$1$0.next = 2;
          break;
        }

        throw new _appiumBaseDriver.errors.UnknownError('Command should be proxied to WDA');

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.active());

      case 4:
        el = context$1$0.sent;

        if (!_lodash2['default'].isUndefined(el.ELEMENT)) {
          context$1$0.next = 7;
          break;
        }

        throw new _appiumBaseDriver.errors.NoSuchElementError();

      case 7:
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(this.setValue(keys, el.ELEMENT));

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.setUrl = function callee$0$0(url) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!(!this.isWebContext() && this.isRealDevice())) {
          context$1$0.next = 4;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.proxyCommand('/url', 'POST', { url: url }));

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 4:
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(_appiumIosDriver.iosCommands.general.setUrl.call(this, url));

      case 6:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

exports.commands = commands;
exports['default'] = commands;

// TODO: once WDA can handle dismissing keyboard for iphone, take away conditional
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9nZW5lcmFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7O2dDQUNDLG9CQUFvQjs7K0JBQ2YsbUJBQW1COztzQkFDL0IsV0FBVzs7OztBQUUzQixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRWxCLFFBQVEsQ0FBQyxNQUFNLEdBQUc7Ozs7WUFDWCxJQUFJLENBQUMsWUFBWSxFQUFFOzs7OztjQUNoQixJQUFJLHlCQUFPLFlBQVksQ0FBQyxrQ0FBa0MsQ0FBQzs7Ozt5Q0FFdEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Q0FDcEQsQ0FBQzs7Ozs7Ozs7Ozs7OztBQWFGLFFBQVEsQ0FBQyxVQUFVLEdBQUcsb0JBQWdCLFFBQVE7TUFDdEMsa0JBQWtCLEVBQ2xCLHFCQUFxQixFQUN2QixRQUFRLEVBQ1IsTUFBTTs7OztBQUhKLDBCQUFrQixHQUFHLGlCQUFpQjtBQUN0Qyw2QkFBcUIsR0FBRyxvQkFBb0I7QUFDOUMsZ0JBQVE7QUFDUixjQUFNOztBQUNWLFlBQUksb0JBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFOzs7QUFHM0IsOEJBQUksSUFBSSxDQUFDLCtHQUErRyxHQUMvRyxrREFBa0QsQ0FBQyxDQUFDO0FBQzdELGtCQUFRLEdBQUcscUJBQXFCLENBQUM7QUFDakMsZ0JBQU0sR0FBRyxFQUFFLENBQUM7U0FDYixNQUFNLElBQUksb0JBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFOztBQUUvQiw4QkFBSSxJQUFJLENBQUMsK0VBQStFLEdBQy9FLGtEQUFrRCxDQUFDLENBQUM7QUFDN0QsY0FBSSxRQUFRLElBQUksQ0FBQyxFQUFFO0FBQ2pCLGtCQUFNLEdBQUcsRUFBQyxRQUFRLEVBQVIsUUFBUSxFQUFDLENBQUM7QUFDcEIsb0JBQVEsR0FBRyxxQkFBcUIsQ0FBQztXQUNsQyxNQUFNO0FBQ0wsb0JBQVEsR0FBRyxr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QU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDOzs7Ozs7O0NBQzNDLENBQUM7O0FBRUYsUUFBUSxDQUFDLFNBQVMsR0FBRyw2QkFBWSxPQUFPLENBQUMsU0FBUyxDQUFDOztBQUVuRCxRQUFRLENBQUMsUUFBUSxHQUFHLDZCQUFZLE9BQU8sQ0FBQyxRQUFRLENBQUM7O0FBRWpELFFBQVEsQ0FBQyxJQUFJLEdBQUcsb0JBQWdCLElBQUk7TUFJOUIsRUFBRTs7OztZQUhELElBQUksQ0FBQyxZQUFZLEVBQUU7Ozs7O2NBQ2hCLElBQUkseUJBQU8sWUFBWSxDQUFDLGtDQUFrQyxDQUFDOzs7O3lDQUVwRCxJQUFJLENBQUMsTUFBTSxFQUFFOzs7QUFBeEIsVUFBRTs7YUFDRixvQkFBRSxXQUFXLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQzs7Ozs7Y0FDckIsSUFBSSx5QkFBTyxrQkFBa0IsRUFBRTs7Ozt5Q0FFakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQzs7Ozs7OztDQUN0QyxDQUFDOztBQUVGLFFBQVEsQ0FBQyxNQUFNLEdBQUcsb0JBQWdCLEdBQUc7Ozs7Y0FDL0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBOzs7Ozs7eUNBQ2hDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFDLEdBQUcsRUFBSCxHQUFHLEVBQUMsQ0FBQzs7Ozs7Ozt5Q0FFMUMsNkJBQVksT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQzs7Ozs7Ozs7OztDQUN4RCxDQUFDOztRQUVPLFFBQVEsR0FBUixRQUFRO3FCQUNGLFFBQVEiLCJmaWxlIjoibGliL2NvbW1hbmRzL2dlbmVyYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgZXJyb3JzIH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcbmltcG9ydCB7IGlvc0NvbW1hbmRzIH0gZnJvbSAnYXBwaXVtLWlvcy1kcml2ZXInO1xuaW1wb3J0IGxvZyBmcm9tICcuLi9sb2dnZXInO1xuXG5sZXQgY29tbWFuZHMgPSB7fTtcblxuY29tbWFuZHMuYWN0aXZlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICBpZiAoIXRoaXMuaXNXZWJDb250ZXh0KCkpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLlVua25vd25FcnJvcignQ29tbWFuZCBzaG91bGQgYmUgcHJveGllZCB0byBXREEnKTtcbiAgfVxuICByZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlQXRvbSgnYWN0aXZlX2VsZW1lbnQnLCBbXSk7XG59O1xuXG4vKipcbiAqIENsb3NlIGFwcCAoc2ltdWxhdGUgZGV2aWNlIGhvbWUgYnV0dG9uKS4gSXQgaXMgcG9zc2libGUgdG8gcmVzdG9yZVxuICogdGhlIGFwcCBhZnRlciB0aGUgdGltZW91dCBvciBrZWVwIGl0IG1pbmltaXplZCBiYXNlZCBvbiB0aGUgcGFyYW1ldGVyIHZhbHVlLlxuICpcbiAqIFBvc3NpYmxlIHZhbHVlcyBmb3IgYGR1cmF0aW9uYDpcbiAqIC0gYW55IHBvc2l0aXZlIG51bWJlciBvZiBzZWNvbmRzOiBjb21lIGJhY2sgYWZ0ZXIgWCBzZWNvbmRzLCBzaG93IGRlcHJlY2F0aW9uIHdhcm5pbmdcbiAqIC0gYW55IG5lZ2F0aXZlIG51bWJlciBvZiBzZWNvbmRzOiBuZXZlciBjb21lIGJhY2ssIHNob3cgZGVwcmVjYXRpb24gd2FybmluZ1xuICogLSB1bmRlZmluZWQ6IGNvbWUgYmFjayBhZnRlciB0aGUgZGVmYXVsdCB0aW1lb3V0IChkZWZpbmVkIGJ5IFdEQSksIHNob3cgZGVwcmVjYXRpb24gd2FybmluZy4gQWZ0ZXIgZGVwcmVjYXRpb246IG5ldmVyIGNvbWUgYmFja1xuICogLSB7dGltZW91dDogNTAwMH06IGNvbWUgYmFjayBhZnRlciA1IHNlY29uZHNcbiAqIC0ge3RpbWVvdXQ6IG51bGx9LCB7dGltZW91dDogLTJ9OiBuZXZlciBjb21lIGJhY2tcbiAqL1xuY29tbWFuZHMuYmFja2dyb3VuZCA9IGFzeW5jIGZ1bmN0aW9uIChkdXJhdGlvbikge1xuICBjb25zdCBob21lc2NyZWVuRW5kcG9pbnQgPSAnL3dkYS9ob21lc2NyZWVuJztcbiAgY29uc3QgZGVhY3RpdmF0ZUFwcEVuZHBvaW50ID0gJy93ZGEvZGVhY3RpdmF0ZUFwcCc7XG4gIGxldCBlbmRwb2ludDtcbiAgbGV0IHBhcmFtcztcbiAgaWYgKF8uaXNVbmRlZmluZWQoZHVyYXRpb24pKSB7XG4gICAgLy8gVE9ETzogUmVwbGFjZSB0aGUgYmxvY2sgYWZ0ZXIgZGVwcmVjYXRlZCBzdHVmZiBpcyByZW1vdmVkXG4gICAgLy8gZW5kcG9pbnQgPSBob21lc2NyZWVuRW5kcG9pbnQ7XG4gICAgbG9nLndhcm4oJ2NvbW1hbmRzLmJhY2tncm91bmQ6IEFwcGxpY2F0aW9uIHVuZGVyIHRlc3Qgd2lsbCBuZXZlciBiZSByZXN0b3JlZCBpbiB0aGUgZnV0dXJlIGlmIG5vIGR1cmF0aW9uIGlzIHByb3ZpZGVkLiAnICtcbiAgICAgICAgICAgICAnU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hcHBpdW0vYXBwaXVtL2lzc3Vlcy83NzQxJyk7XG4gICAgZW5kcG9pbnQgPSBkZWFjdGl2YXRlQXBwRW5kcG9pbnQ7XG4gICAgcGFyYW1zID0ge307XG4gIH0gZWxzZSBpZiAoXy5pc051bWJlcihkdXJhdGlvbikpIHtcbiAgICAvLyBUT0RPOiBkZXByZWNhdGUgdGhpcyBjYXNlXG4gICAgbG9nLndhcm4oJ2NvbW1hbmRzLmJhY2tncm91bmQ6IFBhc3NpbmcgbnVtYmVycyB0byBcXCdkdXJhdGlvblxcJyBhcmd1bWVudCBpcyBkZXByZWNhdGVkLiAnICtcbiAgICAgICAgICAgICAnU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hcHBpdW0vYXBwaXVtL2lzc3Vlcy83NzQxJyk7XG4gICAgaWYgKGR1cmF0aW9uID49IDApIHtcbiAgICAgIHBhcmFtcyA9IHtkdXJhdGlvbn07XG4gICAgICBlbmRwb2ludCA9IGRlYWN0aXZhdGVBcHBFbmRwb2ludDtcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kcG9pbnQgPSBob21lc2NyZWVuRW5kcG9pbnQ7XG4gICAgfVxuICB9IGVsc2UgaWYgKF8uaXNQbGFpbk9iamVjdChkdXJhdGlvbikpIHtcbiAgICBpZiAoXy5oYXMoZHVyYXRpb24sICd0aW1lb3V0JykpIHtcbiAgICAgIGlmIChkdXJhdGlvbi50aW1lb3V0ID09PSBudWxsKSB7XG4gICAgICAgIGVuZHBvaW50ID0gaG9tZXNjcmVlbkVuZHBvaW50O1xuICAgICAgfSBlbHNlIGlmIChfLmlzTnVtYmVyKGR1cmF0aW9uLnRpbWVvdXQpKSB7XG4gICAgICAgIGlmIChkdXJhdGlvbi50aW1lb3V0ID49IDApIHtcbiAgICAgICAgICBwYXJhbXMgPSB7ZHVyYXRpb246IGR1cmF0aW9uLnRpbWVvdXQgLyAxMDAwLjB9O1xuICAgICAgICAgIGVuZHBvaW50ID0gZGVhY3RpdmF0ZUFwcEVuZHBvaW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVuZHBvaW50ID0gaG9tZXNjcmVlbkVuZHBvaW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChfLmlzVW5kZWZpbmVkKGVuZHBvaW50KSkge1xuICAgIGxvZy5lcnJvckFuZFRocm93KCdjb21tYW5kcy5iYWNrZ3JvdW5kOiBBcmd1bWVudCB2YWx1ZSBpcyBleHBlY3RlZCB0byBiZSBhbiBvYmplY3Qgb3IgXFwndW5kZWZpbmVkXFwnLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICBgJyR7ZHVyYXRpb259JyB2YWx1ZSBoYXMgYmVlbiBwcm92aWRlZCBpbnN0ZWFkLiBgICtcbiAgICAgICAgICAgICAgICAgICAgICAnVGhlIFxcJ3RpbWVvdXRcXCcgYXR0cmlidXRlIGNhbiBiZSBcXCdudWxsXFwnIG9yIGFueSBuZWdhdGl2ZSBudW1iZXIgdG8gcHV0IHRoZSBhcHAgdW5kZXIgdGVzdCAnICtcbiAgICAgICAgICAgICAgICAgICAgICAnaW50byBiYWNrZ3JvdW5kIGFuZCBuZXZlciBjb21lIGJhY2sgb3IgYSBwb3NpdGl2ZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHdhaXQgdW50aWwgdGhlIGFwcCBpcyByZXN0b3JlZC4nKTtcbiAgfVxuICByZXR1cm4gYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoZW5kcG9pbnQsICdQT1NUJywgcGFyYW1zLCBlbmRwb2ludCAhPT0gaG9tZXNjcmVlbkVuZHBvaW50KTtcbn07XG5cbi8qXG4gKiBTaW11bGF0ZSBUb3VjaCBJRCB3aXRoIGVpdGhlciB2YWxpZCAobWF0Y2ggPT09IHRydWUpIG9yIGludmFsaWQgKG1hdGNoID09PSBmYWxzZSlcbiAqIGZpbmdlcnByaW50IChTaW11bGF0b3Igb25seSlcbiAqL1xuY29tbWFuZHMudG91Y2hJZCA9IGFzeW5jIGZ1bmN0aW9uIChtYXRjaCA9IHRydWUpIHtcbiAgaWYgKCF0aGlzLmlzU2ltdWxhdG9yKCkpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLlVua25vd25FcnJvcignVG91Y2ggSUQgc2ltdWxhdGlvbiBub3Qgc3VwcG9ydGVkIG9uIHJlYWwgZGV2aWNlcycpO1xuICB9XG5cbiAgcmV0dXJuIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKCcvd2RhL3RvdWNoX2lkJywgJ1BPU1QnLCB7bWF0Y2h9KTtcbn07XG5cbi8qKlxuICogVG9nZ2xlIGVucm9sbG1lbnQgb2YgdG91Y2hJZCAoU2ltdWxhdG9yIG9ubHkpXG4gKlxuICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gRXF1YWxzIHRvIHRydWUgaWYgVG91Y2hJRCBlbnJvbGxtZW50IHNob3VsZCBiZSBlbmFibGVkLlxuICogICBBbGwgdGhlIGZ1cnRoZXIgY2FsbHMgdG8gdGhpcyBtZXRob2Qgd2lsbCBvbmx5IGNoYW5nZSB0aGUgc3RhdGUgb2YgVG91Y2hJRFxuICogICBlbnJvbGxtZW50IGlmIF9lbmFibGVkXyBhcmd1bWVudCB2YWx1ZSBoYXMgYmVlbiBpbnZlcnRlZC4gSXQgaXMgbWFuZGF0b3J5XG4gKiAgIHRoYXQgQXBwaXVtIGRhZW1vbiBwcm9jZXNzIChvciBpdHMgcGFyZW50IHByb2Nlc3MpIGhhcyBhY2Nlc3MgdG8gTWFjT1MgYWNjZXNzaWJpbGl0eVxuICogICBpbiBTeXN0ZW0gUHJlZmVyZW5jZXMsIG90aGVyd2lzZSB0aGlzIGNhbGwgd2lsbCB0aHJvdyBhbiBlcnJvci5cbiAqIEB0aHJvd3MgZXJyb3JzLlVua25vd25FcnJvciBJZiBjdXJyZW50IGRldmljZSBpcyBhIHJlYWwgZGV2aWNlLlxuICogQHRocm93cyBFcnJvciBJZiBTaW11bGF0b3IgYXBwaWNhdGlvbiBpcyBub3QgcnVubmluZyBvciBBcHBpdW0gcHJvY2VzcyBoYXNcbiAqICAgbm8gYWNjZXNzIHRvIHN5c3RlbSBhY2Nlc3NpYmlsaXR5LlxuICovXG5jb21tYW5kcy50b2dnbGVFbnJvbGxUb3VjaElkID0gYXN5bmMgZnVuY3Rpb24gKGVuYWJsZWQgPSB0cnVlKSB7XG4gIGlmICghdGhpcy5pc1NpbXVsYXRvcigpKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5Vbmtub3duRXJyb3IoJ1RvdWNoIElEIHNpbXVsYXRpb24gbm90IHN1cHBvcnRlZCBvbiByZWFsIGRldmljZXMnKTtcbiAgfVxuXG4gIGF3YWl0IHRoaXMub3B0cy5kZXZpY2UuZW5yb2xsVG91Y2hJRChlbmFibGVkKTtcbn07XG5cbmNvbW1hbmRzLmdldFdpbmRvd1NpemUgPSBhc3luYyBmdW5jdGlvbiAod2luZG93SGFuZGxlID0gJ2N1cnJlbnQnKSB7XG4gIGlmICh3aW5kb3dIYW5kbGUgIT09IFwiY3VycmVudFwiKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5Ob3RZZXRJbXBsZW1lbnRlZEVycm9yKCdDdXJyZW50bHkgb25seSBnZXR0aW5nIGN1cnJlbnQgd2luZG93IHNpemUgaXMgc3VwcG9ydGVkLicpO1xuICB9XG5cbiAgaWYgKCF0aGlzLmlzV2ViQ29udGV4dCgpKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGAvd2luZG93L3NpemVgLCAnR0VUJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZUF0b20oJ2dldF93aW5kb3dfc2l6ZScsIFtdKTtcbiAgfVxufTtcblxuY29tbWFuZHMuaGlkZUtleWJvYXJkID0gYXN5bmMgZnVuY3Rpb24gKHN0cmF0ZWd5LCAuLi5wb3NzaWJsZUtleXMpIHtcbiAgaWYgKCh0aGlzLm9wdHMuZGV2aWNlTmFtZSB8fCAnJykuaW5kZXhPZignaVBob25lJykgPT09IC0xKSB7XG4gICAgLy8gVE9ETzogb25jZSBXREEgY2FuIGhhbmRsZSBkaXNtaXNzaW5nIGtleWJvYXJkIGZvciBpcGhvbmUsIHRha2UgYXdheSBjb25kaXRpb25hbFxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZCgnL3dkYS9rZXlib2FyZC9kaXNtaXNzJywgJ1BPU1QnKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxvZy5kZWJ1ZygnQ2Fubm90IGRpc21pc3MgdGhlIGtleWJvYXJkIHVzaW5nIHRoZSBuYXRpdmUgY2FsbC4gVHJ5aW5nIHRvIGFwcGx5IGEgd29ya2Fyb3VuZC4uLicpO1xuICAgIH1cbiAgfVxuXG4gIGxldCBrZXlib2FyZDtcbiAgdHJ5IHtcbiAgICBrZXlib2FyZCA9IGF3YWl0IHRoaXMuZmluZE5hdGl2ZUVsZW1lbnRPckVsZW1lbnRzKCdjbGFzcyBuYW1lJywgJ1hDVUlFbGVtZW50VHlwZUtleWJvYXJkJywgZmFsc2UpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBubyBrZXlib2FyZCBmb3VuZFxuICAgIGxvZy5kZWJ1ZygnTm8ga2V5Ym9hcmQgZm91bmQuIFVuYWJsZSB0byBoaWRlLicpO1xuICAgIHJldHVybjtcbiAgfVxuICBwb3NzaWJsZUtleXMucG9wKCk7IC8vIGxhc3QgcGFyYW1ldGVyIGlzIHRoZSBzZXNzaW9uIGlkXG4gIHBvc3NpYmxlS2V5cyA9IHBvc3NpYmxlS2V5cy5maWx0ZXIoKGVsZW1lbnQpID0+ICEhZWxlbWVudCk7IC8vIGdldCByaWQgb2YgdW5kZWZpbmVkIGVsZW1lbnRzXG4gIGlmIChwb3NzaWJsZUtleXMubGVuZ3RoKSB7XG4gICAgZm9yIChsZXQga2V5IG9mIHBvc3NpYmxlS2V5cykge1xuICAgICAgbGV0IGVsID0gXy5sYXN0KGF3YWl0IHRoaXMuZmluZE5hdGl2ZUVsZW1lbnRPckVsZW1lbnRzKCdhY2Nlc3NpYmlsaXR5IGlkJywga2V5LCB0cnVlLCBrZXlib2FyZCkpO1xuICAgICAgaWYgKGVsKSB7XG4gICAgICAgIGxvZy5kZWJ1ZyhgQXR0ZW1wdGluZyB0byBoaWRlIGtleWJvYXJkIGJ5IHByZXNzaW5nICcke2tleX0nIGtleS5gKTtcbiAgICAgICAgYXdhaXQgdGhpcy5uYXRpdmVDbGljayhlbCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gZmluZCB0aGUga2V5Ym9hcmQsIGFuZCBoaXQgdGhlIGxhc3QgQnV0dG9uXG4gICAgbG9nLmRlYnVnKCdGaW5kaW5nIGtleWJvYXJkIGFuZCBjbGlja2luZyBmaW5hbCBidXR0b24gdG8gY2xvc2UnKTtcbiAgICBpZiAoIWF3YWl0IHRoaXMuZ2V0QXR0cmlidXRlKCd2aXNpYmxlJywga2V5Ym9hcmQpKSB7XG4gICAgICBsb2cuZGVidWcoJ05vIHZpc2libGUga2V5Ym9hcmQgZm91bmQuIFJldHVybmluZycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgYnV0dG9ucyA9IGF3YWl0IHRoaXMuZmluZE5hdGl2ZUVsZW1lbnRPckVsZW1lbnRzKCdjbGFzcyBuYW1lJywgJ1hDVUlFbGVtZW50VHlwZUJ1dHRvbicsIHRydWUsIGtleWJvYXJkKTtcbiAgICBhd2FpdCB0aGlzLm5hdGl2ZUNsaWNrKF8ubGFzdChidXR0b25zKSk7XG4gIH1cbn07XG5cbmNvbW1hbmRzLmdldERldmljZVRpbWUgPSBpb3NDb21tYW5kcy5nZW5lcmFsLmdldERldmljZVRpbWU7XG5cbmNvbW1hbmRzLmdldFN0cmluZ3MgPSBpb3NDb21tYW5kcy5nZW5lcmFsLmdldFN0cmluZ3M7XG5cbmNvbW1hbmRzLnJlbW92ZUFwcCA9IGFzeW5jIGZ1bmN0aW9uIChidW5kbGVJZCkge1xuICBhd2FpdCB0aGlzLm9wdHMuZGV2aWNlLnJlbW92ZUFwcChidW5kbGVJZCk7XG59O1xuXG5jb21tYW5kcy5sYXVuY2hBcHAgPSBpb3NDb21tYW5kcy5nZW5lcmFsLmxhdW5jaEFwcDtcblxuY29tbWFuZHMuY2xvc2VBcHAgPSBpb3NDb21tYW5kcy5nZW5lcmFsLmNsb3NlQXBwO1xuXG5jb21tYW5kcy5rZXlzID0gYXN5bmMgZnVuY3Rpb24gKGtleXMpIHtcbiAgaWYgKCF0aGlzLmlzV2ViQ29udGV4dCgpKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5Vbmtub3duRXJyb3IoJ0NvbW1hbmQgc2hvdWxkIGJlIHByb3hpZWQgdG8gV0RBJyk7XG4gIH1cbiAgbGV0IGVsID0gYXdhaXQgdGhpcy5hY3RpdmUoKTtcbiAgaWYgKF8uaXNVbmRlZmluZWQoZWwuRUxFTUVOVCkpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLk5vU3VjaEVsZW1lbnRFcnJvcigpO1xuICB9XG4gIGF3YWl0IHRoaXMuc2V0VmFsdWUoa2V5cywgZWwuRUxFTUVOVCk7XG59O1xuXG5jb21tYW5kcy5zZXRVcmwgPSBhc3luYyBmdW5jdGlvbiAodXJsKSB7XG4gIGlmICghdGhpcy5pc1dlYkNvbnRleHQoKSAmJiB0aGlzLmlzUmVhbERldmljZSgpKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKCcvdXJsJywgJ1BPU1QnLCB7dXJsfSk7XG4gIH1cbiAgcmV0dXJuIGF3YWl0IGlvc0NvbW1hbmRzLmdlbmVyYWwuc2V0VXJsLmNhbGwodGhpcywgdXJsKTtcbn07XG5cbmV4cG9ydCB7IGNvbW1hbmRzIH07XG5leHBvcnQgZGVmYXVsdCBjb21tYW5kcztcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4vLi4ifQ==
