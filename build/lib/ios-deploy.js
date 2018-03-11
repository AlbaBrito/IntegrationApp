'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _teen_process = require('teen_process');

var _appiumSupport = require('appium-support');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _asyncbox = require('asyncbox');

var IOSDEPLOY_PATH = 'ios-deploy';

var IOSDeploy = (function () {
  function IOSDeploy(udid) {
    _classCallCheck(this, IOSDeploy);

    this.udid = udid;
    this.cmd = IOSDEPLOY_PATH; // this.cmd is in accordance with iDevice
  }

  _createClass(IOSDeploy, [{
    key: 'checkStatus',
    value: function checkStatus() {
      return _regeneratorRuntime.async(function checkStatus$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(_appiumSupport.fs.which(this.cmd));

          case 2:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'remove',
    value: function remove(bundleid) {
      var remove;
      return _regeneratorRuntime.async(function remove$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            remove = ['--uninstall_only', '--id', this.udid, '--bundle_id', bundleid];
            context$2$0.prev = 1;
            context$2$0.next = 4;
            return _regeneratorRuntime.awrap((0, _teen_process.exec)(this.cmd, remove));

          case 4:
            context$2$0.next = 10;
            break;

          case 6:
            context$2$0.prev = 6;
            context$2$0.t0 = context$2$0['catch'](1);

            _logger2['default'].debug('Stdout: \'' + context$2$0.t0.stdout + '\'. Stderr: \'' + context$2$0.t0.stderr + '\'.');
            throw new Error('Could not remove app: \'' + context$2$0.t0.message + '\'');

          case 10:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[1, 6]]);
    }
  }, {
    key: 'removeApp',
    value: function removeApp(bundleId) {
      return _regeneratorRuntime.async(function removeApp$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.remove(bundleId));

          case 2:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'install',
    value: function install(app) {
      var args;
      return _regeneratorRuntime.async(function install$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            args = ['--id', this.udid, '--bundle', app];
            context$2$0.prev = 1;
            context$2$0.next = 4;
            return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(5, 500, _teen_process.exec, this.cmd, args));

          case 4:
            context$2$0.next = 10;
            break;

          case 6:
            context$2$0.prev = 6;
            context$2$0.t0 = context$2$0['catch'](1);

            _logger2['default'].debug('Stdout: \'' + context$2$0.t0.stdout + '\'. Stderr: \'' + context$2$0.t0.stderr + '\'.');
            throw new Error('Could not install app: \'' + context$2$0.t0.message + '\'');

          case 10:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[1, 6]]);
    }
  }, {
    key: 'installApp',
    value: function installApp(app) {
      return _regeneratorRuntime.async(function installApp$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.install(app));

          case 2:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'isAppInstalled',
    value: function isAppInstalled(bundleid) {
      var isInstalled, _ref, stdout;

      return _regeneratorRuntime.async(function isAppInstalled$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            isInstalled = ['--exists', '--id', this.udid, '--bundle_id', bundleid];
            context$2$0.prev = 1;
            context$2$0.next = 4;
            return _regeneratorRuntime.awrap((0, _teen_process.exec)(this.cmd, isInstalled));

          case 4:
            _ref = context$2$0.sent;
            stdout = _ref.stdout;
            return context$2$0.abrupt('return', stdout && stdout.indexOf("true") > -1);

          case 9:
            context$2$0.prev = 9;
            context$2$0.t0 = context$2$0['catch'](1);

            // error 255 is just ios-deploy's way of saying it is not installed
            if (context$2$0.t0.code !== 255) {
              _logger2['default'].debug('Error checking install status: \'' + context$2$0.t0.message + '\'');
            }
            return context$2$0.abrupt('return', false);

          case 13:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[1, 9]]);
    }
  }]);

  return IOSDeploy;
})();

exports['default'] = IOSDeploy;
module.exports = exports['default'];

// make sure we actually have the program
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9pb3MtZGVwbG95LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OzRCQUFxQixjQUFjOzs2QkFDaEIsZ0JBQWdCOztzQkFDaEIsVUFBVTs7Ozt3QkFDQyxVQUFVOztBQUV4QyxJQUFNLGNBQWMsZUFBZSxDQUFDOztJQUU5QixTQUFTO0FBRUQsV0FGUixTQUFTLENBRUEsSUFBSSxFQUFFOzBCQUZmLFNBQVM7O0FBR1gsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUM7R0FDM0I7O2VBTEcsU0FBUzs7V0FPSzs7Ozs7NkNBRVYsa0JBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7Ozs7Ozs7S0FDekI7OztXQUVZLGdCQUFDLFFBQVE7VUFDaEIsTUFBTTs7OztBQUFOLGtCQUFNLEdBQUcsNkJBQTZCLElBQUksQ0FBQyxJQUFJLGlCQUFpQixRQUFRLENBQUM7Ozs2Q0FFckUsd0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUM7Ozs7Ozs7Ozs7QUFFNUIsZ0NBQU8sS0FBSyxnQkFBYSxlQUFJLE1BQU0sc0JBQWUsZUFBSSxNQUFNLFNBQUssQ0FBQztrQkFDNUQsSUFBSSxLQUFLLDhCQUEyQixlQUFJLE9BQU8sUUFBSTs7Ozs7OztLQUU1RDs7O1dBRWUsbUJBQUMsUUFBUTs7Ozs7NkNBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDOzs7Ozs7O0tBQzVCOzs7V0FFYSxpQkFBQyxHQUFHO1VBQ1YsSUFBSTs7OztBQUFKLGdCQUFJLEdBQUcsU0FBUyxJQUFJLENBQUMsSUFBSSxjQUFjLEdBQUcsQ0FBQzs7OzZDQUV6Qyw2QkFBYyxDQUFDLEVBQUUsR0FBRyxzQkFBUSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQzs7Ozs7Ozs7OztBQUVqRCxnQ0FBTyxLQUFLLGdCQUFhLGVBQUksTUFBTSxzQkFBZSxlQUFJLE1BQU0sU0FBSyxDQUFDO2tCQUM1RCxJQUFJLEtBQUssK0JBQTRCLGVBQUksT0FBTyxRQUFJOzs7Ozs7O0tBRTdEOzs7V0FFZ0Isb0JBQUMsR0FBRzs7Ozs7NkNBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7Ozs7Ozs7S0FDeEI7OztXQUVvQix3QkFBQyxRQUFRO1VBQ3hCLFdBQVcsUUFFUixNQUFNOzs7OztBQUZULHVCQUFXLEdBQUcscUJBQXFCLElBQUksQ0FBQyxJQUFJLGlCQUFpQixRQUFRLENBQUM7Ozs2Q0FFbkQsd0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUM7Ozs7QUFBM0Msa0JBQU0sUUFBTixNQUFNO2dEQUNILE1BQU0sSUFBSyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxBQUFDOzs7Ozs7O0FBRy9DLGdCQUFJLGVBQUksSUFBSSxLQUFLLEdBQUcsRUFBRTtBQUNwQixrQ0FBTyxLQUFLLHVDQUFvQyxlQUFJLE9BQU8sUUFBSSxDQUFDO2FBQ2pFO2dEQUNNLEtBQUs7Ozs7Ozs7S0FFZjs7O1NBcERHLFNBQVM7OztxQkF1REEsU0FBUyIsImZpbGUiOiJsaWIvaW9zLWRlcGxveS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4ZWMgfSBmcm9tICd0ZWVuX3Byb2Nlc3MnO1xuaW1wb3J0IHsgZnMgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7IHJldHJ5SW50ZXJ2YWwgfSBmcm9tICdhc3luY2JveCc7XG5cbmNvbnN0IElPU0RFUExPWV9QQVRIID0gYGlvcy1kZXBsb3lgO1xuXG5jbGFzcyBJT1NEZXBsb3kge1xuXG4gIGNvbnN0cnVjdG9yICh1ZGlkKSB7XG4gICAgdGhpcy51ZGlkID0gdWRpZDtcbiAgICB0aGlzLmNtZCA9IElPU0RFUExPWV9QQVRIOyAvLyB0aGlzLmNtZCBpcyBpbiBhY2NvcmRhbmNlIHdpdGggaURldmljZVxuICB9XG5cbiAgYXN5bmMgY2hlY2tTdGF0dXMgKCkge1xuICAgIC8vIG1ha2Ugc3VyZSB3ZSBhY3R1YWxseSBoYXZlIHRoZSBwcm9ncmFtXG4gICAgYXdhaXQgZnMud2hpY2godGhpcy5jbWQpO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlIChidW5kbGVpZCkge1xuICAgIGxldCByZW1vdmUgPSBbYC0tdW5pbnN0YWxsX29ubHlgLCBgLS1pZGAsIHRoaXMudWRpZCwgYC0tYnVuZGxlX2lkYCwgYnVuZGxlaWRdO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBleGVjKHRoaXMuY21kLCByZW1vdmUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgbG9nZ2VyLmRlYnVnKGBTdGRvdXQ6ICcke2Vyci5zdGRvdXR9Jy4gU3RkZXJyOiAnJHtlcnIuc3RkZXJyfScuYCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCByZW1vdmUgYXBwOiAnJHtlcnIubWVzc2FnZX0nYCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmVtb3ZlQXBwIChidW5kbGVJZCkge1xuICAgIGF3YWl0IHRoaXMucmVtb3ZlKGJ1bmRsZUlkKTtcbiAgfVxuXG4gIGFzeW5jIGluc3RhbGwgKGFwcCkge1xuICAgIGNvbnN0IGFyZ3MgPSBbYC0taWRgLCB0aGlzLnVkaWQsIGAtLWJ1bmRsZWAsIGFwcF07XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHJldHJ5SW50ZXJ2YWwoNSwgNTAwLCBleGVjLCB0aGlzLmNtZCwgYXJncyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBsb2dnZXIuZGVidWcoYFN0ZG91dDogJyR7ZXJyLnN0ZG91dH0nLiBTdGRlcnI6ICcke2Vyci5zdGRlcnJ9Jy5gKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGluc3RhbGwgYXBwOiAnJHtlcnIubWVzc2FnZX0nYCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgaW5zdGFsbEFwcCAoYXBwKSB7XG4gICAgYXdhaXQgdGhpcy5pbnN0YWxsKGFwcCk7XG4gIH1cblxuICBhc3luYyBpc0FwcEluc3RhbGxlZCAoYnVuZGxlaWQpIHtcbiAgICBsZXQgaXNJbnN0YWxsZWQgPSBbYC0tZXhpc3RzYCwgYC0taWRgLCB0aGlzLnVkaWQsIGAtLWJ1bmRsZV9pZGAsIGJ1bmRsZWlkXTtcbiAgICB0cnkge1xuICAgICAgbGV0IHtzdGRvdXR9ID0gYXdhaXQgZXhlYyh0aGlzLmNtZCwgaXNJbnN0YWxsZWQpO1xuICAgICAgcmV0dXJuIChzdGRvdXQgJiYgKHN0ZG91dC5pbmRleE9mKFwidHJ1ZVwiKSA+IC0xKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBlcnJvciAyNTUgaXMganVzdCBpb3MtZGVwbG95J3Mgd2F5IG9mIHNheWluZyBpdCBpcyBub3QgaW5zdGFsbGVkXG4gICAgICBpZiAoZXJyLmNvZGUgIT09IDI1NSkge1xuICAgICAgICBsb2dnZXIuZGVidWcoYEVycm9yIGNoZWNraW5nIGluc3RhbGwgc3RhdHVzOiAnJHtlcnIubWVzc2FnZX0nYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IElPU0RlcGxveTtcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4ifQ==
