'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _nodeSimctl = require('node-simctl');

var commands = {};

commands.mobileSetPasteboard = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var content, encoding;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (this.isSimulator()) {
          context$1$0.next = 2;
          break;
        }

        throw new Error('Setting pasteboard content is not supported on real devices');

      case 2:
        content = opts.content;
        encoding = opts.encoding;

        if (content) {
          context$1$0.next = 6;
          break;
        }

        throw new Error('Pasteboard content is mandatory to set');

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap((0, _nodeSimctl.setPasteboard)(this.opts.udid, content, encoding));

      case 8:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.mobileGetPasteboard = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (this.isSimulator()) {
          context$1$0.next = 2;
          break;
        }

        throw new Error('Getting pasteboard content is not supported on real devices');

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap((0, _nodeSimctl.getPasteboard)(this.opts.udid, opts.encoding));

      case 4:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

exports.commands = commands;
exports['default'] = commands;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9wYXN0ZWJvYXJkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzBCQUE2QyxhQUFhOztBQUUxRCxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRWxCLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRztNQUFnQixJQUFJLHlEQUFHLEVBQUU7TUFJL0MsT0FBTyxFQUFFLFFBQVE7Ozs7WUFIbkIsSUFBSSxDQUFDLFdBQVcsRUFBRTs7Ozs7Y0FDZixJQUFJLEtBQUssQ0FBQyw2REFBNkQsQ0FBQzs7O0FBRXpFLGVBQU8sR0FBYyxJQUFJLENBQXpCLE9BQU87QUFBRSxnQkFBUSxHQUFJLElBQUksQ0FBaEIsUUFBUTs7WUFDbkIsT0FBTzs7Ozs7Y0FDSixJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQzs7Ozt5Q0FFOUMsK0JBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQzs7Ozs7Ozs7OztDQUM5RCxDQUFDOztBQUVGLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRztNQUFnQixJQUFJLHlEQUFHLEVBQUU7Ozs7WUFDakQsSUFBSSxDQUFDLFdBQVcsRUFBRTs7Ozs7Y0FDZixJQUFJLEtBQUssQ0FBQyw2REFBNkQsQ0FBQzs7Ozt5Q0FFbkUsK0JBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7Ozs7Ozs7OztDQUMxRCxDQUFDOztRQUVPLFFBQVEsR0FBUixRQUFRO3FCQUNGLFFBQVEiLCJmaWxlIjoibGliL2NvbW1hbmRzL3Bhc3RlYm9hcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzZXRQYXN0ZWJvYXJkLCBnZXRQYXN0ZWJvYXJkIH0gZnJvbSAnbm9kZS1zaW1jdGwnO1xuXG5sZXQgY29tbWFuZHMgPSB7fTtcblxuY29tbWFuZHMubW9iaWxlU2V0UGFzdGVib2FyZCA9IGFzeW5jIGZ1bmN0aW9uIChvcHRzID0ge30pIHtcbiAgaWYgKCF0aGlzLmlzU2ltdWxhdG9yKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmcgcGFzdGVib2FyZCBjb250ZW50IGlzIG5vdCBzdXBwb3J0ZWQgb24gcmVhbCBkZXZpY2VzJyk7XG4gIH1cbiAgY29uc3Qge2NvbnRlbnQsIGVuY29kaW5nfSA9IG9wdHM7XG4gIGlmICghY29udGVudCkge1xuICAgIHRocm93IG5ldyBFcnJvcignUGFzdGVib2FyZCBjb250ZW50IGlzIG1hbmRhdG9yeSB0byBzZXQnKTtcbiAgfVxuICByZXR1cm4gYXdhaXQgc2V0UGFzdGVib2FyZCh0aGlzLm9wdHMudWRpZCwgY29udGVudCwgZW5jb2RpbmcpO1xufTtcblxuY29tbWFuZHMubW9iaWxlR2V0UGFzdGVib2FyZCA9IGFzeW5jIGZ1bmN0aW9uIChvcHRzID0ge30pIHtcbiAgaWYgKCF0aGlzLmlzU2ltdWxhdG9yKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0dldHRpbmcgcGFzdGVib2FyZCBjb250ZW50IGlzIG5vdCBzdXBwb3J0ZWQgb24gcmVhbCBkZXZpY2VzJyk7XG4gIH1cbiAgcmV0dXJuIGF3YWl0IGdldFBhc3RlYm9hcmQodGhpcy5vcHRzLnVkaWQsIG9wdHMuZW5jb2RpbmcpO1xufTtcblxuZXhwb3J0IHsgY29tbWFuZHMgfTtcbmV4cG9ydCBkZWZhdWx0IGNvbW1hbmRzO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLi8uLiJ9
