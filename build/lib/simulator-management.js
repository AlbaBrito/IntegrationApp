'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _appiumIosSimulator = require('appium-ios-simulator');

var _nodeSimctl = require('node-simctl');

var _utils = require('./utils');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

// returns sim for desired caps
function createSim(caps, sessionId) {
  var name, udid;
  return _regeneratorRuntime.async(function createSim$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        name = 'appiumTest-' + sessionId;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap((0, _nodeSimctl.createDevice)(name, caps.deviceName, caps.platformVersion));

      case 3:
        udid = context$1$0.sent;
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap((0, _appiumIosSimulator.getSimulator)(udid));

      case 6:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function getExistingSim(opts) {
  var devices, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, device;

  return _regeneratorRuntime.async(function getExistingSim$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap((0, _nodeSimctl.getDevices)(opts.platformVersion));

      case 2:
        devices = context$1$0.sent;
        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;
        context$1$0.prev = 6;
        _iterator = _getIterator(_lodash2['default'].values(devices));

      case 8:
        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
          context$1$0.next = 17;
          break;
        }

        device = _step.value;

        if (!(device.name === opts.deviceName)) {
          context$1$0.next = 14;
          break;
        }

        context$1$0.next = 13;
        return _regeneratorRuntime.awrap((0, _appiumIosSimulator.getSimulator)(device.udid));

      case 13:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 14:
        _iteratorNormalCompletion = true;
        context$1$0.next = 8;
        break;

      case 17:
        context$1$0.next = 23;
        break;

      case 19:
        context$1$0.prev = 19;
        context$1$0.t0 = context$1$0['catch'](6);
        _didIteratorError = true;
        _iteratorError = context$1$0.t0;

      case 23:
        context$1$0.prev = 23;
        context$1$0.prev = 24;

        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }

      case 26:
        context$1$0.prev = 26;

        if (!_didIteratorError) {
          context$1$0.next = 29;
          break;
        }

        throw _iteratorError;

      case 29:
        return context$1$0.finish(26);

      case 30:
        return context$1$0.finish(23);

      case 31:
        return context$1$0.abrupt('return', null);

      case 32:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[6, 19, 23, 31], [24,, 26, 30]]);
}

function runSimulatorReset(device, opts) {
  var isSafari;
  return _regeneratorRuntime.async(function runSimulatorReset$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!(opts.noReset && !opts.fullReset)) {
          context$1$0.next = 3;
          break;
        }

        // noReset === true && fullReset === false
        _logger2['default'].debug('Reset: noReset is on. Leaving simulator as is');
        return context$1$0.abrupt('return');

      case 3:
        if (device) {
          context$1$0.next = 6;
          break;
        }

        _logger2['default'].debug('Reset: no device available. Skipping');
        return context$1$0.abrupt('return');

      case 6:
        if (!opts.fullReset) {
          context$1$0.next = 16;
          break;
        }

        _logger2['default'].debug('Reset: fullReset is on. Cleaning simulator');
        // stop XCTest processes if running to avoid unexpected side effects
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap((0, _utils.resetXCTestProcesses)(device.udid, true));

      case 10:
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(device.shutdown());

      case 12:
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(device.clean());

      case 14:
        context$1$0.next = 51;
        break;

      case 16:
        if (!opts.bundleId) {
          context$1$0.next = 51;
          break;
        }

        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(device.isRunning());

      case 19:
        if (!context$1$0.sent) {
          context$1$0.next = 33;
          break;
        }

        if (!(device.xcodeVersion.major >= 8)) {
          context$1$0.next = 31;
          break;
        }

        context$1$0.prev = 21;
        context$1$0.next = 24;
        return _regeneratorRuntime.awrap((0, _nodeSimctl.terminate)(device.udid, opts.bundleId));

      case 24:
        context$1$0.next = 29;
        break;

      case 26:
        context$1$0.prev = 26;
        context$1$0.t0 = context$1$0['catch'](21);

        _logger2['default'].warn('Reset: failed to terminate Simulator application with id "' + opts.bundleId + '"');

      case 29:
        context$1$0.next = 33;
        break;

      case 31:
        context$1$0.next = 33;
        return _regeneratorRuntime.awrap(device.shutdown());

      case 33:
        if (!opts.app) {
          context$1$0.next = 36;
          break;
        }

        _logger2['default'].info('Not scrubbing third party app in anticipation of uninstall');
        return context$1$0.abrupt('return');

      case 36:
        isSafari = (opts.browserName || '').toLowerCase() === 'safari';
        context$1$0.prev = 37;

        if (!isSafari) {
          context$1$0.next = 43;
          break;
        }

        context$1$0.next = 41;
        return _regeneratorRuntime.awrap(device.cleanSafari());

      case 41:
        context$1$0.next = 45;
        break;

      case 43:
        context$1$0.next = 45;
        return _regeneratorRuntime.awrap(device.scrubCustomApp(_path2['default'].basename(opts.app), opts.bundleId));

      case 45:
        context$1$0.next = 51;
        break;

      case 47:
        context$1$0.prev = 47;
        context$1$0.t1 = context$1$0['catch'](37);

        _logger2['default'].warn(context$1$0.t1.message);
        _logger2['default'].warn('Reset: could not scrub ' + (isSafari ? 'Safari browser' : 'application with id "' + opts.bundleId + '"') + '. Leaving as is.');

      case 51:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[21, 26], [37, 47]]);
}

function installToSimulator(device, app, bundleId) {
  var noReset = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
  return _regeneratorRuntime.async(function installToSimulator$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (app) {
          context$1$0.next = 3;
          break;
        }

        _logger2['default'].debug('No app path is given. Nothing to install.');
        return context$1$0.abrupt('return');

      case 3:
        if (!bundleId) {
          context$1$0.next = 13;
          break;
        }

        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(device.isAppInstalled(bundleId));

      case 6:
        if (!context$1$0.sent) {
          context$1$0.next = 13;
          break;
        }

        if (!noReset) {
          context$1$0.next = 10;
          break;
        }

        _logger2['default'].debug('App \'' + bundleId + '\' is already installed. No need to reinstall.');
        return context$1$0.abrupt('return');

      case 10:
        _logger2['default'].debug('Reset requested. Removing app with id \'' + bundleId + '\' from the device');
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(device.removeApp(bundleId));

      case 13:
        _logger2['default'].debug('Installing \'' + app + '\' on Simulator with UUID \'' + device.udid + '\'...');
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(device.installApp(app));

      case 16:
        _logger2['default'].debug('The app has been installed successfully.');

      case 17:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

exports.createSim = createSim;
exports.getExistingSim = getExistingSim;
exports.runSimulatorReset = runSimulatorReset;
exports.installToSimulator = installToSimulator;

// The simulator process must be ended before we delete applications.

// Terminate the app under test if it is still running on Simulator
// Termination is not needed if Simulator is not running
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zaW11bGF0b3ItbWFuYWdlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBQWlCLE1BQU07Ozs7a0NBQ00sc0JBQXNCOzswQkFDQyxhQUFhOztxQkFDNUIsU0FBUzs7c0JBQ2hDLFFBQVE7Ozs7c0JBQ04sVUFBVTs7Ozs7QUFHMUIsU0FBZSxTQUFTLENBQUUsSUFBSSxFQUFFLFNBQVM7TUFDbkMsSUFBSSxFQUNKLElBQUk7Ozs7QUFESixZQUFJLG1CQUFpQixTQUFTOzt5Q0FDakIsOEJBQWEsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQzs7O0FBQXRFLFlBQUk7O3lDQUNLLHNDQUFhLElBQUksQ0FBQzs7Ozs7Ozs7OztDQUNoQzs7QUFFRCxTQUFlLGNBQWMsQ0FBRSxJQUFJO01BQzdCLE9BQU8sa0ZBQ0YsTUFBTTs7Ozs7O3lDQURLLDRCQUFXLElBQUksQ0FBQyxlQUFlLENBQUM7OztBQUFoRCxlQUFPOzs7OztpQ0FDUSxvQkFBRSxNQUFNLENBQUMsT0FBTyxDQUFDOzs7Ozs7OztBQUEzQixjQUFNOztjQUNULE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQTs7Ozs7O3lDQUNwQixzQ0FBYSxNQUFNLENBQUMsSUFBSSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NENBR25DLElBQUk7Ozs7Ozs7Q0FDWjs7QUFFRCxTQUFlLGlCQUFpQixDQUFFLE1BQU0sRUFBRSxJQUFJO01BcUNwQyxRQUFROzs7O2NBcENaLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFBOzs7Ozs7QUFFakMsNEJBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7Ozs7WUFJeEQsTUFBTTs7Ozs7QUFDVCw0QkFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQzs7OzthQUloRCxJQUFJLENBQUMsU0FBUzs7Ozs7QUFDaEIsNEJBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7Ozt5Q0FFbEQsaUNBQXFCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDOzs7O3lDQUV2QyxNQUFNLENBQUMsUUFBUSxFQUFFOzs7O3lDQUNqQixNQUFNLENBQUMsS0FBSyxFQUFFOzs7Ozs7O2FBQ1gsSUFBSSxDQUFDLFFBQVE7Ozs7Ozt5Q0FHWixNQUFNLENBQUMsU0FBUyxFQUFFOzs7Ozs7OztjQUN0QixNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUE7Ozs7Ozs7eUNBRXhCLDJCQUFVLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7Ozs7Ozs7OztBQUUzQyw0QkFBSSxJQUFJLGdFQUE4RCxJQUFJLENBQUMsUUFBUSxPQUFJLENBQUM7Ozs7Ozs7O3lDQUdwRixNQUFNLENBQUMsUUFBUSxFQUFFOzs7YUFHdkIsSUFBSSxDQUFDLEdBQUc7Ozs7O0FBQ1YsNEJBQUksSUFBSSxDQUFDLDREQUE0RCxDQUFDLENBQUM7Ozs7QUFHbkUsZ0JBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFBLENBQUUsV0FBVyxFQUFFLEtBQUssUUFBUTs7O2FBRTlELFFBQVE7Ozs7Ozt5Q0FDSixNQUFNLENBQUMsV0FBVyxFQUFFOzs7Ozs7Ozt5Q0FFcEIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxrQkFBSyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7Ozs7Ozs7Ozs7QUFHckUsNEJBQUksSUFBSSxDQUFDLGVBQUksT0FBTyxDQUFDLENBQUM7QUFDdEIsNEJBQUksSUFBSSw4QkFBMkIsUUFBUSxHQUFHLGdCQUFnQixHQUFHLHVCQUF1QixHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFBLHNCQUFtQixDQUFDOzs7Ozs7O0NBR3ZJOztBQUVELFNBQWUsa0JBQWtCLENBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRO01BQUUsT0FBTyx5REFBRyxJQUFJOzs7O1lBQ2pFLEdBQUc7Ozs7O0FBQ04sNEJBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7Ozs7YUFJckQsUUFBUTs7Ozs7O3lDQUNBLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDOzs7Ozs7OzthQUNuQyxPQUFPOzs7OztBQUNULDRCQUFJLEtBQUssWUFBUyxRQUFRLG9EQUFnRCxDQUFDOzs7O0FBRzdFLDRCQUFJLEtBQUssOENBQTJDLFFBQVEsd0JBQW9CLENBQUM7O3lDQUMzRSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQzs7O0FBR3BDLDRCQUFJLEtBQUssbUJBQWdCLEdBQUcsb0NBQTZCLE1BQU0sQ0FBQyxJQUFJLFdBQU8sQ0FBQzs7eUNBQ3RFLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDOzs7QUFDNUIsNEJBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7Ozs7Ozs7Q0FDdkQ7O1FBR1EsU0FBUyxHQUFULFNBQVM7UUFBRSxjQUFjLEdBQWQsY0FBYztRQUFFLGlCQUFpQixHQUFqQixpQkFBaUI7UUFBRSxrQkFBa0IsR0FBbEIsa0JBQWtCIiwiZmlsZSI6ImxpYi9zaW11bGF0b3ItbWFuYWdlbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZ2V0U2ltdWxhdG9yIH0gZnJvbSAnYXBwaXVtLWlvcy1zaW11bGF0b3InO1xuaW1wb3J0IHsgY3JlYXRlRGV2aWNlLCBnZXREZXZpY2VzLCB0ZXJtaW5hdGUgfSBmcm9tICdub2RlLXNpbWN0bCc7XG5pbXBvcnQgeyByZXNldFhDVGVzdFByb2Nlc3NlcyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBsb2cgZnJvbSAnLi9sb2dnZXInO1xuXG4vLyByZXR1cm5zIHNpbSBmb3IgZGVzaXJlZCBjYXBzXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVTaW0gKGNhcHMsIHNlc3Npb25JZCkge1xuICBsZXQgbmFtZSA9IGBhcHBpdW1UZXN0LSR7c2Vzc2lvbklkfWA7XG4gIGxldCB1ZGlkID0gYXdhaXQgY3JlYXRlRGV2aWNlKG5hbWUsIGNhcHMuZGV2aWNlTmFtZSwgY2Fwcy5wbGF0Zm9ybVZlcnNpb24pO1xuICByZXR1cm4gYXdhaXQgZ2V0U2ltdWxhdG9yKHVkaWQpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRFeGlzdGluZ1NpbSAob3B0cykge1xuICBsZXQgZGV2aWNlcyA9IGF3YWl0IGdldERldmljZXMob3B0cy5wbGF0Zm9ybVZlcnNpb24pO1xuICBmb3IgKGxldCBkZXZpY2Ugb2YgXy52YWx1ZXMoZGV2aWNlcykpIHtcbiAgICBpZiAoZGV2aWNlLm5hbWUgPT09IG9wdHMuZGV2aWNlTmFtZSkge1xuICAgICAgcmV0dXJuIGF3YWl0IGdldFNpbXVsYXRvcihkZXZpY2UudWRpZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5hc3luYyBmdW5jdGlvbiBydW5TaW11bGF0b3JSZXNldCAoZGV2aWNlLCBvcHRzKSB7XG4gIGlmIChvcHRzLm5vUmVzZXQgJiYgIW9wdHMuZnVsbFJlc2V0KSB7XG4gICAgLy8gbm9SZXNldCA9PT0gdHJ1ZSAmJiBmdWxsUmVzZXQgPT09IGZhbHNlXG4gICAgbG9nLmRlYnVnKCdSZXNldDogbm9SZXNldCBpcyBvbi4gTGVhdmluZyBzaW11bGF0b3IgYXMgaXMnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIWRldmljZSkge1xuICAgIGxvZy5kZWJ1ZygnUmVzZXQ6IG5vIGRldmljZSBhdmFpbGFibGUuIFNraXBwaW5nJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKG9wdHMuZnVsbFJlc2V0KSB7XG4gICAgbG9nLmRlYnVnKCdSZXNldDogZnVsbFJlc2V0IGlzIG9uLiBDbGVhbmluZyBzaW11bGF0b3InKTtcbiAgICAvLyBzdG9wIFhDVGVzdCBwcm9jZXNzZXMgaWYgcnVubmluZyB0byBhdm9pZCB1bmV4cGVjdGVkIHNpZGUgZWZmZWN0c1xuICAgIGF3YWl0IHJlc2V0WENUZXN0UHJvY2Vzc2VzKGRldmljZS51ZGlkLCB0cnVlKTtcbiAgICAvLyBUaGUgc2ltdWxhdG9yIHByb2Nlc3MgbXVzdCBiZSBlbmRlZCBiZWZvcmUgd2UgZGVsZXRlIGFwcGxpY2F0aW9ucy5cbiAgICBhd2FpdCBkZXZpY2Uuc2h1dGRvd24oKTtcbiAgICBhd2FpdCBkZXZpY2UuY2xlYW4oKTtcbiAgfSBlbHNlIGlmIChvcHRzLmJ1bmRsZUlkKSB7XG4gICAgLy8gVGVybWluYXRlIHRoZSBhcHAgdW5kZXIgdGVzdCBpZiBpdCBpcyBzdGlsbCBydW5uaW5nIG9uIFNpbXVsYXRvclxuICAgIC8vIFRlcm1pbmF0aW9uIGlzIG5vdCBuZWVkZWQgaWYgU2ltdWxhdG9yIGlzIG5vdCBydW5uaW5nXG4gICAgaWYgKGF3YWl0IGRldmljZS5pc1J1bm5pbmcoKSkge1xuICAgICAgaWYgKGRldmljZS54Y29kZVZlcnNpb24ubWFqb3IgPj0gOCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IHRlcm1pbmF0ZShkZXZpY2UudWRpZCwgb3B0cy5idW5kbGVJZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGxvZy53YXJuKGBSZXNldDogZmFpbGVkIHRvIHRlcm1pbmF0ZSBTaW11bGF0b3IgYXBwbGljYXRpb24gd2l0aCBpZCBcIiR7b3B0cy5idW5kbGVJZH1cImApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBkZXZpY2Uuc2h1dGRvd24oKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9wdHMuYXBwKSB7XG4gICAgICBsb2cuaW5mbygnTm90IHNjcnViYmluZyB0aGlyZCBwYXJ0eSBhcHAgaW4gYW50aWNpcGF0aW9uIG9mIHVuaW5zdGFsbCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpc1NhZmFyaSA9IChvcHRzLmJyb3dzZXJOYW1lIHx8ICcnKS50b0xvd2VyQ2FzZSgpID09PSAnc2FmYXJpJztcbiAgICB0cnkge1xuICAgICAgaWYgKGlzU2FmYXJpKSB7XG4gICAgICAgIGF3YWl0IGRldmljZS5jbGVhblNhZmFyaSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgZGV2aWNlLnNjcnViQ3VzdG9tQXBwKHBhdGguYmFzZW5hbWUob3B0cy5hcHApLCBvcHRzLmJ1bmRsZUlkKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxvZy53YXJuKGVyci5tZXNzYWdlKTtcbiAgICAgIGxvZy53YXJuKGBSZXNldDogY291bGQgbm90IHNjcnViICR7aXNTYWZhcmkgPyAnU2FmYXJpIGJyb3dzZXInIDogJ2FwcGxpY2F0aW9uIHdpdGggaWQgXCInICsgb3B0cy5idW5kbGVJZCArICdcIid9LiBMZWF2aW5nIGFzIGlzLmApO1xuICAgIH1cbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBpbnN0YWxsVG9TaW11bGF0b3IgKGRldmljZSwgYXBwLCBidW5kbGVJZCwgbm9SZXNldCA9IHRydWUpIHtcbiAgaWYgKCFhcHApIHtcbiAgICBsb2cuZGVidWcoJ05vIGFwcCBwYXRoIGlzIGdpdmVuLiBOb3RoaW5nIHRvIGluc3RhbGwuJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGJ1bmRsZUlkKSB7XG4gICAgaWYgKGF3YWl0IGRldmljZS5pc0FwcEluc3RhbGxlZChidW5kbGVJZCkpIHtcbiAgICAgIGlmIChub1Jlc2V0KSB7XG4gICAgICAgIGxvZy5kZWJ1ZyhgQXBwICcke2J1bmRsZUlkfScgaXMgYWxyZWFkeSBpbnN0YWxsZWQuIE5vIG5lZWQgdG8gcmVpbnN0YWxsLmApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsb2cuZGVidWcoYFJlc2V0IHJlcXVlc3RlZC4gUmVtb3ZpbmcgYXBwIHdpdGggaWQgJyR7YnVuZGxlSWR9JyBmcm9tIHRoZSBkZXZpY2VgKTtcbiAgICAgIGF3YWl0IGRldmljZS5yZW1vdmVBcHAoYnVuZGxlSWQpO1xuICAgIH1cbiAgfVxuICBsb2cuZGVidWcoYEluc3RhbGxpbmcgJyR7YXBwfScgb24gU2ltdWxhdG9yIHdpdGggVVVJRCAnJHtkZXZpY2UudWRpZH0nLi4uYCk7XG4gIGF3YWl0IGRldmljZS5pbnN0YWxsQXBwKGFwcCk7XG4gIGxvZy5kZWJ1ZygnVGhlIGFwcCBoYXMgYmVlbiBpbnN0YWxsZWQgc3VjY2Vzc2Z1bGx5LicpO1xufVxuXG5cbmV4cG9ydCB7IGNyZWF0ZVNpbSwgZ2V0RXhpc3RpbmdTaW0sIHJ1blNpbXVsYXRvclJlc2V0LCBpbnN0YWxsVG9TaW11bGF0b3IgfTtcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4ifQ==
