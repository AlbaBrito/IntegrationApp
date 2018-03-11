'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appiumIosDriver = require('appium-ios-driver');

var _deviceLogIosCrashLog = require('../device-log/ios-crash-log');

var _deviceLogIosLog = require('../device-log/ios-log');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var extensions = {};

_Object$assign(extensions, _appiumIosDriver.iosCommands.logging);

extensions.startLogCapture = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        this.logs = this.logs || {};

        if (!(!_lodash2['default'].isUndefined(this.logs.syslog) && this.logs.syslog.isCapturing)) {
          context$1$0.next = 4;
          break;
        }

        _logger2['default'].warn('Trying to start iOS log capture but it has already started!');
        return context$1$0.abrupt('return', true);

      case 4:
        if (_lodash2['default'].isUndefined(this.logs.syslog)) {
          this.logs.crashlog = new _deviceLogIosCrashLog.IOSCrashLog({
            sim: this.opts.device,
            udid: this.isRealDevice() ? this.opts.udid : undefined
          });
          this.logs.syslog = new _deviceLogIosLog.IOSLog({
            sim: this.opts.device,
            udid: this.isRealDevice() ? this.opts.udid : undefined,
            showLogs: this.opts.showIOSLog,
            realDeviceLogger: this.opts.realDeviceLogger
          });
        }
        context$1$0.prev = 5;
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.logs.syslog.startCapture());

      case 8:
        context$1$0.next = 14;
        break;

      case 10:
        context$1$0.prev = 10;
        context$1$0.t0 = context$1$0['catch'](5);

        _logger2['default'].warn('Continuing without capturing logs: ' + context$1$0.t0.message);
        return context$1$0.abrupt('return', false);

      case 14:
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(this.logs.crashlog.startCapture());

      case 16:
        return context$1$0.abrupt('return', true);

      case 17:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[5, 10]]);
};

exports['default'] = extensions;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9sb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3NCQUFjLFFBQVE7Ozs7K0JBQ00sbUJBQW1COztvQ0FDbkIsNkJBQTZCOzsrQkFDbEMsdUJBQXVCOztzQkFDOUIsV0FBVzs7OztBQUUzQixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRXBCLGVBQWMsVUFBVSxFQUFFLDZCQUFZLE9BQU8sQ0FBQyxDQUFDOztBQUUvQyxVQUFVLENBQUMsZUFBZSxHQUFHOzs7O0FBQzNCLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7O2NBQ3hCLENBQUMsb0JBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFBOzs7OztBQUNsRSw0QkFBSSxJQUFJLENBQUMsNkRBQTZELENBQUMsQ0FBQzs0Q0FDakUsSUFBSTs7O0FBRWIsWUFBSSxvQkFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNuQyxjQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxzQ0FBZ0I7QUFDbkMsZUFBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtBQUNyQixnQkFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTO1dBQ3ZELENBQUMsQ0FBQztBQUNILGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLDRCQUFXO0FBQzVCLGVBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07QUFDckIsZ0JBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUztBQUN0RCxvQkFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVTtBQUM5Qiw0QkFBZ0IsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQjtXQUM3QyxDQUFDLENBQUM7U0FDSjs7O3lDQUVPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTs7Ozs7Ozs7OztBQUVyQyw0QkFBSSxJQUFJLHlDQUF1QyxlQUFJLE9BQU8sQ0FBRyxDQUFDOzRDQUN2RCxLQUFLOzs7O3lDQUVSLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRTs7OzRDQUNoQyxJQUFJOzs7Ozs7O0NBQ1osQ0FBQzs7cUJBRWEsVUFBVSIsImZpbGUiOiJsaWIvY29tbWFuZHMvbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGlvc0NvbW1hbmRzIH0gZnJvbSAnYXBwaXVtLWlvcy1kcml2ZXInO1xuaW1wb3J0IHsgSU9TQ3Jhc2hMb2cgfSBmcm9tICcuLi9kZXZpY2UtbG9nL2lvcy1jcmFzaC1sb2cnO1xuaW1wb3J0IHsgSU9TTG9nIH0gZnJvbSAnLi4vZGV2aWNlLWxvZy9pb3MtbG9nJztcbmltcG9ydCBsb2cgZnJvbSAnLi4vbG9nZ2VyJztcblxubGV0IGV4dGVuc2lvbnMgPSB7fTtcblxuT2JqZWN0LmFzc2lnbihleHRlbnNpb25zLCBpb3NDb21tYW5kcy5sb2dnaW5nKTtcblxuZXh0ZW5zaW9ucy5zdGFydExvZ0NhcHR1cmUgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIHRoaXMubG9ncyA9IHRoaXMubG9ncyB8fCB7fTtcbiAgaWYgKCFfLmlzVW5kZWZpbmVkKHRoaXMubG9ncy5zeXNsb2cpICYmIHRoaXMubG9ncy5zeXNsb2cuaXNDYXB0dXJpbmcpIHtcbiAgICBsb2cud2FybignVHJ5aW5nIHRvIHN0YXJ0IGlPUyBsb2cgY2FwdHVyZSBidXQgaXQgaGFzIGFscmVhZHkgc3RhcnRlZCEnKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoXy5pc1VuZGVmaW5lZCh0aGlzLmxvZ3Muc3lzbG9nKSkge1xuICAgIHRoaXMubG9ncy5jcmFzaGxvZyA9IG5ldyBJT1NDcmFzaExvZyh7XG4gICAgICBzaW06IHRoaXMub3B0cy5kZXZpY2UsXG4gICAgICB1ZGlkOiB0aGlzLmlzUmVhbERldmljZSgpID8gdGhpcy5vcHRzLnVkaWQgOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gICAgdGhpcy5sb2dzLnN5c2xvZyA9IG5ldyBJT1NMb2coe1xuICAgICAgc2ltOiB0aGlzLm9wdHMuZGV2aWNlLFxuICAgICAgdWRpZDogdGhpcy5pc1JlYWxEZXZpY2UoKSA/IHRoaXMub3B0cy51ZGlkIDogdW5kZWZpbmVkLFxuICAgICAgc2hvd0xvZ3M6IHRoaXMub3B0cy5zaG93SU9TTG9nLFxuICAgICAgcmVhbERldmljZUxvZ2dlcjogdGhpcy5vcHRzLnJlYWxEZXZpY2VMb2dnZXIsXG4gICAgfSk7XG4gIH1cbiAgdHJ5IHtcbiAgICBhd2FpdCB0aGlzLmxvZ3Muc3lzbG9nLnN0YXJ0Q2FwdHVyZSgpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBsb2cud2FybihgQ29udGludWluZyB3aXRob3V0IGNhcHR1cmluZyBsb2dzOiAke2Vyci5tZXNzYWdlfWApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBhd2FpdCB0aGlzLmxvZ3MuY3Jhc2hsb2cuc3RhcnRDYXB0dXJlKCk7XG4gIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZXh0ZW5zaW9ucztcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4vLi4ifQ==
