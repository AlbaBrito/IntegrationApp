'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _appiumIosDriver = require('appium-ios-driver');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _appiumSupport = require('appium-support');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _teen_process = require('teen_process');

var _appiumXcode = require('appium-xcode');

var _appiumXcode2 = _interopRequireDefault(_appiumXcode);

var IOSLog = (function (_IOSDriverIOSLog) {
  _inherits(IOSLog, _IOSDriverIOSLog);

  function IOSLog() {
    _classCallCheck(this, IOSLog);

    _get(Object.getPrototypeOf(IOSLog.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(IOSLog, [{
    key: 'startCaptureSimulator',
    value: function startCaptureSimulator() {
      var xcodeVersion, tool, args, systemLogPath;
      return _regeneratorRuntime.async(function startCaptureSimulator$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!_lodash2['default'].isUndefined(this.sim.udid)) {
              context$2$0.next = 2;
              break;
            }

            throw new Error('Log capture requires a sim udid');

          case 2:
            context$2$0.next = 4;
            return _regeneratorRuntime.awrap(_appiumXcode2['default'].getVersion(true));

          case 4:
            xcodeVersion = context$2$0.sent;
            tool = undefined, args = undefined;

            if (!(xcodeVersion.major < 9)) {
              context$2$0.next = 17;
              break;
            }

            systemLogPath = _path2['default'].resolve(this.sim.getLogDir(), 'system.log');
            context$2$0.next = 10;
            return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(systemLogPath));

          case 10:
            if (context$2$0.sent) {
              context$2$0.next = 12;
              break;
            }

            throw new Error('No logs could be found at ' + systemLogPath);

          case 12:
            _logger2['default'].debug('System log path: ' + systemLogPath);
            tool = 'tail';
            args = ['-f', '-n', '1', systemLogPath];
            context$2$0.next = 23;
            break;

          case 17:
            context$2$0.next = 19;
            return _regeneratorRuntime.awrap(this.sim.isRunning());

          case 19:
            if (context$2$0.sent) {
              context$2$0.next = 21;
              break;
            }

            throw new Error('iOS Simulator with udid ' + this.sim.udid + ' is not running');

          case 21:
            tool = 'xcrun';
            args = ['simctl', 'spawn', this.sim.udid, 'log', 'stream', '--style', 'compact'];

          case 23:
            _logger2['default'].debug('Starting log capture for iOS Simulator with udid \'' + this.sim.udid + '\', ' + ('using \'' + tool + ' ' + args.join(' ') + '\''));
            context$2$0.prev = 24;
            context$2$0.next = 27;
            return _regeneratorRuntime.awrap((0, _teen_process.exec)('pkill', ['-xf', [tool].concat(_toConsumableArray(args)).join(' ')]));

          case 27:
            context$2$0.next = 31;
            break;

          case 29:
            context$2$0.prev = 29;
            context$2$0.t0 = context$2$0['catch'](24);

          case 31:
            context$2$0.prev = 31;

            this.proc = new _teen_process.SubProcess(tool, args);
            context$2$0.next = 35;
            return _regeneratorRuntime.awrap(this.finishStartingLogCapture());

          case 35:
            context$2$0.next = 40;
            break;

          case 37:
            context$2$0.prev = 37;
            context$2$0.t1 = context$2$0['catch'](31);
            throw new Error('Simulator log capture failed. Original error: ' + context$2$0.t1.message);

          case 40:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[24, 29], [31, 37]]);
    }
  }, {
    key: 'isCapturing',
    get: function get() {
      return !!(this.proc && this.proc.isRunning);
    }
  }]);

  return IOSLog;
})(_appiumIosDriver.IOSLog);

exports.IOSLog = IOSLog;
exports['default'] = IOSLog;

// cleanup existing listeners if the previous session has not been terminated properly
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9kZXZpY2UtbG9nL2lvcy1sb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0JBQTBDLG1CQUFtQjs7b0JBQzVDLE1BQU07Ozs7NkJBQ0osZ0JBQWdCOztzQkFDckIsUUFBUTs7OztzQkFDTixXQUFXOzs7OzRCQUNNLGNBQWM7OzJCQUM3QixjQUFjOzs7O0lBRTFCLE1BQU07WUFBTixNQUFNOztXQUFOLE1BQU07MEJBQU4sTUFBTTs7K0JBQU4sTUFBTTs7O2VBQU4sTUFBTTs7V0FDa0I7VUFLcEIsWUFBWSxFQUNkLElBQUksRUFBRSxJQUFJLEVBRU4sYUFBYTs7OztpQkFQakIsb0JBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDOzs7OztrQkFDeEIsSUFBSSxLQUFLLG1DQUFtQzs7Ozs2Q0FHekIseUJBQU0sVUFBVSxDQUFDLElBQUksQ0FBQzs7O0FBQTNDLHdCQUFZO0FBQ2QsZ0JBQUksY0FBRSxJQUFJOztrQkFDVixZQUFZLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQTs7Ozs7QUFDbEIseUJBQWEsR0FBRyxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxZQUFZLENBQUM7OzZDQUMzRCxrQkFBRyxNQUFNLENBQUMsYUFBYSxDQUFDOzs7Ozs7OztrQkFDM0IsSUFBSSxLQUFLLGdDQUE4QixhQUFhLENBQUc7OztBQUUvRCxnQ0FBSSxLQUFLLHVCQUFxQixhQUFhLENBQUcsQ0FBQztBQUMvQyxnQkFBSSxHQUFHLE1BQU0sQ0FBQztBQUNkLGdCQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQzs7Ozs7OzZDQUU3QixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRTs7Ozs7Ozs7a0JBQ3ZCLElBQUksS0FBSyw4QkFBNEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLHFCQUFrQjs7O0FBRTVFLGdCQUFJLEdBQUcsT0FBTyxDQUFDO0FBQ2YsZ0JBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7OztBQUVuRixnQ0FBSSxLQUFLLENBQUMsd0RBQXFELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSwwQkFDeEQsSUFBSSxTQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQUcsQ0FBQyxDQUFDOzs7NkNBR3ZDLHdCQUFLLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksNEJBQUssSUFBSSxHQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O0FBR3ZELGdCQUFJLENBQUMsSUFBSSxHQUFHLDZCQUFlLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzs7NkNBQ2pDLElBQUksQ0FBQyx3QkFBd0IsRUFBRTs7Ozs7Ozs7O2tCQUUvQixJQUFJLEtBQUssb0RBQWtELGVBQUUsT0FBTyxDQUFHOzs7Ozs7O0tBRWhGOzs7U0FFZSxlQUFHO0FBQ2pCLGFBQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUEsQUFBQyxDQUFDO0tBQzdDOzs7U0F2Q0csTUFBTTs7O1FBMENILE1BQU0sR0FBTixNQUFNO3FCQUNBLE1BQU0iLCJmaWxlIjoibGliL2RldmljZS1sb2cvaW9zLWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElPU0xvZyBhcyBJT1NEcml2ZXJJT1NMb2cgfSBmcm9tICdhcHBpdW0taW9zLWRyaXZlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGZzIH0gZnJvbSAnYXBwaXVtLXN1cHBvcnQnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBsb2cgZnJvbSAnLi4vbG9nZ2VyJztcbmltcG9ydCB7IFN1YlByb2Nlc3MsIGV4ZWMgfSBmcm9tICd0ZWVuX3Byb2Nlc3MnO1xuaW1wb3J0IHhjb2RlIGZyb20gJ2FwcGl1bS14Y29kZSc7XG5cbmNsYXNzIElPU0xvZyBleHRlbmRzIElPU0RyaXZlcklPU0xvZyB7XG4gIGFzeW5jIHN0YXJ0Q2FwdHVyZVNpbXVsYXRvciAoKSB7XG4gICAgaWYgKF8uaXNVbmRlZmluZWQodGhpcy5zaW0udWRpZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTG9nIGNhcHR1cmUgcmVxdWlyZXMgYSBzaW0gdWRpZGApO1xuICAgIH1cblxuICAgIGNvbnN0IHhjb2RlVmVyc2lvbiA9IGF3YWl0IHhjb2RlLmdldFZlcnNpb24odHJ1ZSk7XG4gICAgbGV0IHRvb2wsIGFyZ3M7XG4gICAgaWYgKHhjb2RlVmVyc2lvbi5tYWpvciA8IDkpIHtcbiAgICAgIGNvbnN0IHN5c3RlbUxvZ1BhdGggPSBwYXRoLnJlc29sdmUodGhpcy5zaW0uZ2V0TG9nRGlyKCksICdzeXN0ZW0ubG9nJyk7XG4gICAgICBpZiAoIWF3YWl0IGZzLmV4aXN0cyhzeXN0ZW1Mb2dQYXRoKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGxvZ3MgY291bGQgYmUgZm91bmQgYXQgJHtzeXN0ZW1Mb2dQYXRofWApO1xuICAgICAgfVxuICAgICAgbG9nLmRlYnVnKGBTeXN0ZW0gbG9nIHBhdGg6ICR7c3lzdGVtTG9nUGF0aH1gKTtcbiAgICAgIHRvb2wgPSAndGFpbCc7XG4gICAgICBhcmdzID0gWyctZicsICctbicsICcxJywgc3lzdGVtTG9nUGF0aF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghYXdhaXQgdGhpcy5zaW0uaXNSdW5uaW5nKCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBpT1MgU2ltdWxhdG9yIHdpdGggdWRpZCAke3RoaXMuc2ltLnVkaWR9IGlzIG5vdCBydW5uaW5nYCk7XG4gICAgICB9XG4gICAgICB0b29sID0gJ3hjcnVuJztcbiAgICAgIGFyZ3MgPSBbJ3NpbWN0bCcsICdzcGF3bicsIHRoaXMuc2ltLnVkaWQsICdsb2cnLCAnc3RyZWFtJywgJy0tc3R5bGUnLCAnY29tcGFjdCddO1xuICAgIH1cbiAgICBsb2cuZGVidWcoYFN0YXJ0aW5nIGxvZyBjYXB0dXJlIGZvciBpT1MgU2ltdWxhdG9yIHdpdGggdWRpZCAnJHt0aGlzLnNpbS51ZGlkfScsIGAgK1xuICAgICAgICAgICAgICBgdXNpbmcgJyR7dG9vbH0gJHthcmdzLmpvaW4oJyAnKX0nYCk7XG4gICAgdHJ5IHtcbiAgICAgIC8vIGNsZWFudXAgZXhpc3RpbmcgbGlzdGVuZXJzIGlmIHRoZSBwcmV2aW91cyBzZXNzaW9uIGhhcyBub3QgYmVlbiB0ZXJtaW5hdGVkIHByb3Blcmx5XG4gICAgICBhd2FpdCBleGVjKCdwa2lsbCcsIFsnLXhmJywgW3Rvb2wsIC4uLmFyZ3NdLmpvaW4oJyAnKV0pO1xuICAgIH0gY2F0Y2ggKGlnbikge31cbiAgICB0cnkge1xuICAgICAgdGhpcy5wcm9jID0gbmV3IFN1YlByb2Nlc3ModG9vbCwgYXJncyk7XG4gICAgICBhd2FpdCB0aGlzLmZpbmlzaFN0YXJ0aW5nTG9nQ2FwdHVyZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU2ltdWxhdG9yIGxvZyBjYXB0dXJlIGZhaWxlZC4gT3JpZ2luYWwgZXJyb3I6ICR7ZS5tZXNzYWdlfWApO1xuICAgIH1cbiAgfVxuXG4gIGdldCBpc0NhcHR1cmluZyAoKSB7XG4gICAgcmV0dXJuICEhKHRoaXMucHJvYyAmJiB0aGlzLnByb2MuaXNSdW5uaW5nKTtcbiAgfVxufVxuXG5leHBvcnQgeyBJT1NMb2cgfTtcbmV4cG9ydCBkZWZhdWx0IElPU0xvZztcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4vLi4ifQ==
