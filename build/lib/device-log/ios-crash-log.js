'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _appiumIosDriver = require('appium-ios-driver');

var _appiumSupport = require('appium-support');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _teen_process = require('teen_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var IOSCrashLog = (function (_IOSDriverIOSCrashLog) {
  _inherits(IOSCrashLog, _IOSDriverIOSCrashLog);

  function IOSCrashLog() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, IOSCrashLog);

    _get(Object.getPrototypeOf(IOSCrashLog.prototype), 'constructor', this).call(this, opts.udid ? _path2['default'].resolve(process.env.HOME, 'Library', 'Logs', 'CrashReporter', 'MobileDevice') : _path2['default'].resolve(process.env.HOME, 'Library', 'Logs', 'DiagnosticReports'));
    this.udid = opts.udid;
    this.phoneName = null;
    this.sim = opts.sim;
  }

  _createClass(IOSCrashLog, [{
    key: 'getCrashes',
    value: function getCrashes() {
      var crashLogsRoot, _ref, stdout, foundFiles;

      return _regeneratorRuntime.async(function getCrashes$(context$2$0) {
        var _this = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            crashLogsRoot = this.logDir;

            if (!this.udid) {
              context$2$0.next = 16;
              break;
            }

            if (this.phoneName) {
              context$2$0.next = 15;
              break;
            }

            context$2$0.prev = 3;
            context$2$0.next = 6;
            return _regeneratorRuntime.awrap((0, _teen_process.exec)('idevicename', ['-u', this.udid]));

          case 6:
            _ref = context$2$0.sent;
            stdout = _ref.stdout;

            this.phoneName = stdout.trim();
            context$2$0.next = 15;
            break;

          case 11:
            context$2$0.prev = 11;
            context$2$0.t0 = context$2$0['catch'](3);

            _logger2['default'].warn('Cannot get the name of the crashes folder for the device with udid \'' + this.udid + '\'. ' + ('Original error: ' + context$2$0.t0.message));
            return context$2$0.abrupt('return', []);

          case 15:
            if (this.phoneName) {
              crashLogsRoot = _path2['default'].resolve(crashLogsRoot, this.phoneName);
            }

          case 16:
            context$2$0.next = 18;
            return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(crashLogsRoot));

          case 18:
            if (context$2$0.sent) {
              context$2$0.next = 21;
              break;
            }

            _logger2['default'].debug('Crash reports root \'' + crashLogsRoot + '\' does not exist. Got nothing to gather.');
            return context$2$0.abrupt('return', []);

          case 21:
            context$2$0.next = 23;
            return _regeneratorRuntime.awrap(_appiumSupport.fs.glob(crashLogsRoot + '/**/*.crash', { realpath: true }));

          case 23:
            foundFiles = context$2$0.sent;

            if (!this.udid) {
              context$2$0.next = 26;
              break;
            }

            return context$2$0.abrupt('return', foundFiles);

          case 26:
            context$2$0.next = 28;
            return _regeneratorRuntime.awrap(_bluebird2['default'].filter(foundFiles, function callee$2$0(x) {
              var content;
              return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    context$3$0.next = 2;
                    return _regeneratorRuntime.awrap(_appiumSupport.fs.readFile(x, 'utf8'));

                  case 2:
                    content = context$3$0.sent;
                    return context$3$0.abrupt('return', content.toUpperCase().includes(this.sim.udid.toUpperCase()));

                  case 4:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this);
            }));

          case 28:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 29:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[3, 11]]);
    }
  }, {
    key: 'filesToJSON',
    value: function filesToJSON(paths) {
      return _regeneratorRuntime.async(function filesToJSON$(context$2$0) {
        var _this2 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(_bluebird2['default'].map(paths, function callee$2$0(fullPath) {
              var stat;
              return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    context$3$0.next = 2;
                    return _regeneratorRuntime.awrap(_appiumSupport.fs.stat(fullPath));

                  case 2:
                    stat = context$3$0.sent;
                    context$3$0.t0 = stat.ctime.getTime();
                    context$3$0.next = 6;
                    return _regeneratorRuntime.awrap(_appiumSupport.fs.readFile(fullPath, 'utf8'));

                  case 6:
                    context$3$0.t1 = context$3$0.sent;
                    return context$3$0.abrupt('return', {
                      timestamp: context$3$0.t0,
                      level: 'ALL',
                      message: context$3$0.t1
                    });

                  case 8:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this2);
            }));

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return IOSCrashLog;
})(_appiumIosDriver.IOSCrashLog);

exports.IOSCrashLog = IOSCrashLog;
exports['default'] = IOSCrashLog;

// For Simulator only include files, that contain current UDID
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9kZXZpY2UtbG9nL2lvcy1jcmFzaC1sb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OytCQUFvRCxtQkFBbUI7OzZCQUNwRCxnQkFBZ0I7O3dCQUNyQixVQUFVOzs7O3NCQUNSLFdBQVc7Ozs7NEJBQ04sY0FBYzs7b0JBQ2xCLE1BQU07Ozs7SUFFakIsV0FBVztZQUFYLFdBQVc7O0FBQ0gsV0FEUixXQUFXLEdBQ1M7UUFBWCxJQUFJLHlEQUFHLEVBQUU7OzBCQURsQixXQUFXOztBQUViLCtCQUZFLFdBQVcsNkNBRVAsSUFBSSxDQUFDLElBQUksR0FDYixrQkFBSyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLEdBQ2xGLGtCQUFLLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLG1CQUFtQixDQUFDLEVBQUU7QUFDMUUsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztHQUNyQjs7ZUFSRyxXQUFXOztXQVVFO1VBQ1gsYUFBYSxRQUlKLE1BQU0sRUFnQmIsVUFBVTs7Ozs7OztBQXBCWix5QkFBYSxHQUFHLElBQUksQ0FBQyxNQUFNOztpQkFDM0IsSUFBSSxDQUFDLElBQUk7Ozs7O2dCQUNOLElBQUksQ0FBQyxTQUFTOzs7Ozs7OzZDQUVRLHdCQUFLLGFBQWEsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7QUFBdEQsa0JBQU0sUUFBTixNQUFNOztBQUNiLGdCQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Ozs7Ozs7QUFFL0IsZ0NBQUksSUFBSSxDQUFDLDBFQUF1RSxJQUFJLENBQUMsSUFBSSxrQ0FDcEUsZUFBRSxPQUFPLENBQUUsQ0FBQyxDQUFDO2dEQUMzQixFQUFFOzs7QUFHYixnQkFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2xCLDJCQUFhLEdBQUcsa0JBQUssT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDN0Q7Ozs7NkNBRVEsa0JBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQzs7Ozs7Ozs7QUFDakMsZ0NBQUksS0FBSywyQkFBd0IsYUFBYSwrQ0FBMkMsQ0FBQztnREFDbkYsRUFBRTs7Ozs2Q0FFYyxrQkFBRyxJQUFJLENBQUksYUFBYSxrQkFBZSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQzs7O0FBQTNFLHNCQUFVOztpQkFDWixJQUFJLENBQUMsSUFBSTs7Ozs7Z0RBQ0osVUFBVTs7Ozs2Q0FHTixzQkFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLG9CQUFPLENBQUM7a0JBQ2xDLE9BQU87Ozs7O3FEQUFTLGtCQUFHLFFBQVEsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDOzs7QUFBdEMsMkJBQU87d0RBQ04sT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7Ozs7OzthQUNuRSxDQUFDOzs7Ozs7Ozs7O0tBQ0g7OztXQUVpQixxQkFBQyxLQUFLOzs7Ozs7OzZDQUNULHNCQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsb0JBQU8sUUFBUTtrQkFDakMsSUFBSTs7Ozs7cURBQVMsa0JBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7O0FBQTlCLHdCQUFJO3FDQUVHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFOztxREFFaEIsa0JBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUM7Ozs7O0FBRjVDLCtCQUFTO0FBQ1QsMkJBQUssRUFBRSxLQUFLO0FBQ1osNkJBQU87Ozs7Ozs7O2FBRVYsQ0FBQzs7Ozs7Ozs7OztLQUNIOzs7U0FuREcsV0FBVzs7O1FBc0RSLFdBQVcsR0FBWCxXQUFXO3FCQUNMLFdBQVciLCJmaWxlIjoibGliL2RldmljZS1sb2cvaW9zLWNyYXNoLWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElPU0NyYXNoTG9nIGFzIElPU0RyaXZlcklPU0NyYXNoTG9nIH0gZnJvbSAnYXBwaXVtLWlvcy1kcml2ZXInO1xuaW1wb3J0IHsgZnMgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5pbXBvcnQgQiBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgbG9nIGZyb20gJy4uL2xvZ2dlcic7XG5pbXBvcnQgeyBleGVjIH0gZnJvbSAndGVlbl9wcm9jZXNzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jbGFzcyBJT1NDcmFzaExvZyBleHRlbmRzIElPU0RyaXZlcklPU0NyYXNoTG9nIHtcbiAgY29uc3RydWN0b3IgKG9wdHMgPSB7fSkge1xuICAgIHN1cGVyKG9wdHMudWRpZCA/XG4gICAgICBwYXRoLnJlc29sdmUocHJvY2Vzcy5lbnYuSE9NRSwgJ0xpYnJhcnknLCAnTG9ncycsICdDcmFzaFJlcG9ydGVyJywgJ01vYmlsZURldmljZScpIDpcbiAgICAgIHBhdGgucmVzb2x2ZShwcm9jZXNzLmVudi5IT01FLCAnTGlicmFyeScsICdMb2dzJywgJ0RpYWdub3N0aWNSZXBvcnRzJykpO1xuICAgIHRoaXMudWRpZCA9IG9wdHMudWRpZDtcbiAgICB0aGlzLnBob25lTmFtZSA9IG51bGw7XG4gICAgdGhpcy5zaW0gPSBvcHRzLnNpbTtcbiAgfVxuXG4gIGFzeW5jIGdldENyYXNoZXMgKCkge1xuICAgIGxldCBjcmFzaExvZ3NSb290ID0gdGhpcy5sb2dEaXI7XG4gICAgaWYgKHRoaXMudWRpZCkge1xuICAgICAgaWYgKCF0aGlzLnBob25lTmFtZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHtzdGRvdXR9ID0gYXdhaXQgZXhlYygnaWRldmljZW5hbWUnLCBbJy11JywgdGhpcy51ZGlkXSk7XG4gICAgICAgICAgdGhpcy5waG9uZU5hbWUgPSBzdGRvdXQudHJpbSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgbG9nLndhcm4oYENhbm5vdCBnZXQgdGhlIG5hbWUgb2YgdGhlIGNyYXNoZXMgZm9sZGVyIGZvciB0aGUgZGV2aWNlIHdpdGggdWRpZCAnJHt0aGlzLnVkaWR9Jy4gYCArXG4gICAgICAgICAgICBgT3JpZ2luYWwgZXJyb3I6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMucGhvbmVOYW1lKSB7XG4gICAgICAgIGNyYXNoTG9nc1Jvb3QgPSBwYXRoLnJlc29sdmUoY3Jhc2hMb2dzUm9vdCwgdGhpcy5waG9uZU5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWF3YWl0IGZzLmV4aXN0cyhjcmFzaExvZ3NSb290KSkge1xuICAgICAgbG9nLmRlYnVnKGBDcmFzaCByZXBvcnRzIHJvb3QgJyR7Y3Jhc2hMb2dzUm9vdH0nIGRvZXMgbm90IGV4aXN0LiBHb3Qgbm90aGluZyB0byBnYXRoZXIuYCk7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGNvbnN0IGZvdW5kRmlsZXMgPSBhd2FpdCBmcy5nbG9iKGAke2NyYXNoTG9nc1Jvb3R9LyoqLyouY3Jhc2hgLCB7cmVhbHBhdGg6IHRydWV9KTtcbiAgICBpZiAodGhpcy51ZGlkKSB7XG4gICAgICByZXR1cm4gZm91bmRGaWxlcztcbiAgICB9XG4gICAgLy8gRm9yIFNpbXVsYXRvciBvbmx5IGluY2x1ZGUgZmlsZXMsIHRoYXQgY29udGFpbiBjdXJyZW50IFVESURcbiAgICByZXR1cm4gYXdhaXQgQi5maWx0ZXIoZm91bmRGaWxlcywgYXN5bmMgKHgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBmcy5yZWFkRmlsZSh4LCAndXRmOCcpO1xuICAgICAgcmV0dXJuIGNvbnRlbnQudG9VcHBlckNhc2UoKS5pbmNsdWRlcyh0aGlzLnNpbS51ZGlkLnRvVXBwZXJDYXNlKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZmlsZXNUb0pTT04gKHBhdGhzKSB7XG4gICAgcmV0dXJuIGF3YWl0IEIubWFwKHBhdGhzLCBhc3luYyAoZnVsbFBhdGgpID0+IHtcbiAgICAgIGNvbnN0IHN0YXQgPSBhd2FpdCBmcy5zdGF0KGZ1bGxQYXRoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRpbWVzdGFtcDogc3RhdC5jdGltZS5nZXRUaW1lKCksXG4gICAgICAgIGxldmVsOiAnQUxMJyxcbiAgICAgICAgbWVzc2FnZTogYXdhaXQgZnMucmVhZEZpbGUoZnVsbFBhdGgsICd1dGY4JylcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IHsgSU9TQ3Jhc2hMb2cgfTtcbmV4cG9ydCBkZWZhdWx0IElPU0NyYXNoTG9nO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLi8uLiJ9
