'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _appiumBaseDriver = require('appium-base-driver');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var SUPPORTED_METHODS = ['GET', 'POST', 'DELETE'];

var helpers = {},
    extensions = {};

helpers.proxyCommand = function callee$0$0(endpoint, method, body) {
  var isSessionCommand = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
  var proxy, cmdName, timeout, res, isCommandExpired, errMsg;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!this.shutdownUnexpectedly) {
          context$1$0.next = 2;
          break;
        }

        return context$1$0.abrupt('return');

      case 2:

        if (!endpoint) {
          _logger2['default'].errorAndThrow('Proxying requires an endpoint');
        } else if (SUPPORTED_METHODS.indexOf(method) === -1) {
          _logger2['default'].errorAndThrow('Proxying only works for the following requests: ' + SUPPORTED_METHODS.join(', '));
        }

        if (this.wda) {
          context$1$0.next = 5;
          break;
        }

        throw new Error("Can't call proxyCommand without WDA driver active");

      case 5:
        proxy = isSessionCommand ? this.wda.jwproxy : this.wda.noSessionProxy;

        if (proxy) {
          context$1$0.next = 8;
          break;
        }

        throw new Error("Can't call proxyCommand without WDA proxy active");

      case 8:
        cmdName = (0, _appiumBaseDriver.routeToCommandName)(endpoint, method);
        timeout = this._getCommandTimeout(cmdName);
        res = null;

        if (!timeout) {
          context$1$0.next = 25;
          break;
        }

        _logger2['default'].debug('Setting custom timeout to ' + timeout + ' ms for "' + cmdName + '" command');
        isCommandExpired = false;
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(_bluebird2['default'].Promise.resolve(proxy.command(endpoint, method, body)).timeout(timeout)['catch'](_bluebird2['default'].Promise.TimeoutError, function () {
          isCommandExpired = true;
        }));

      case 16:
        res = context$1$0.sent;

        if (!isCommandExpired) {
          context$1$0.next = 23;
          break;
        }

        proxy.cancelActiveRequests();
        errMsg = 'Appium did not get any response from "' + cmdName + '" command in ' + timeout + ' ms';
        context$1$0.next = 22;
        return _regeneratorRuntime.awrap(this.startUnexpectedShutdown(new _appiumBaseDriver.errors.TimeoutError(errMsg)));

      case 22:
        _logger2['default'].errorAndThrow(errMsg);

      case 23:
        context$1$0.next = 28;
        break;

      case 25:
        context$1$0.next = 27;
        return _regeneratorRuntime.awrap(proxy.command(endpoint, method, body));

      case 27:
        res = context$1$0.sent;

      case 28:
        if (!(res && res.status && parseInt(res.status, 10) !== 0)) {
          context$1$0.next = 30;
          break;
        }

        throw (0, _appiumBaseDriver.errorFromCode)(res.status, res.value);

      case 30:
        return context$1$0.abrupt('return', res);

      case 31:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

_Object$assign(extensions, helpers);
exports.helpers = helpers;
exports['default'] = extensions;

// temporarily handle errors that can be returned
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9wcm94eS1oZWxwZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2dDQUEwRCxvQkFBb0I7O3NCQUM5RCxXQUFXOzs7O3dCQUNiLFVBQVU7Ozs7QUFHeEIsSUFBTSxpQkFBaUIsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRXBELElBQUksT0FBTyxHQUFHLEVBQUU7SUFBRSxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVsQyxPQUFPLENBQUMsWUFBWSxHQUFHLG9CQUFnQixRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUk7TUFBRSxnQkFBZ0IseURBQUcsSUFBSTtNQWM5RSxLQUFLLEVBS0wsT0FBTyxFQUNQLE9BQU8sRUFDVCxHQUFHLEVBR0QsZ0JBQWdCLEVBUVosTUFBTTs7OzthQS9CWixJQUFJLENBQUMsb0JBQW9COzs7Ozs7Ozs7QUFJN0IsWUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLDhCQUFJLGFBQWEsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1NBQ3BELE1BQU0sSUFBSSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDbkQsOEJBQUksYUFBYSxzREFBb0QsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFHLENBQUM7U0FDdEc7O1lBRUksSUFBSSxDQUFDLEdBQUc7Ozs7O2NBQ0wsSUFBSSxLQUFLLENBQUMsbURBQW1ELENBQUM7OztBQUVoRSxhQUFLLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjOztZQUN0RSxLQUFLOzs7OztjQUNGLElBQUksS0FBSyxDQUFDLGtEQUFrRCxDQUFDOzs7QUFHL0QsZUFBTyxHQUFHLDBDQUFtQixRQUFRLEVBQUUsTUFBTSxDQUFDO0FBQzlDLGVBQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDO0FBQzVDLFdBQUcsR0FBRyxJQUFJOzthQUNWLE9BQU87Ozs7O0FBQ1QsNEJBQUksS0FBSyxnQ0FBOEIsT0FBTyxpQkFBWSxPQUFPLGVBQVksQ0FBQztBQUMxRSx3QkFBZ0IsR0FBRyxLQUFLOzt5Q0FDaEIsc0JBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FDckQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUNYLENBQUMsc0JBQUUsT0FBTyxDQUFDLFlBQVksRUFBRSxZQUFNO0FBQ25DLDBCQUFnQixHQUFHLElBQUksQ0FBQztTQUN6QixDQUFDOzs7QUFKaEIsV0FBRzs7YUFLQyxnQkFBZ0I7Ozs7O0FBQ2xCLGFBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0FBQ3ZCLGNBQU0sOENBQTRDLE9BQU8scUJBQWdCLE9BQU87O3lDQUNoRixJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSx5QkFBTyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7OztBQUNuRSw0QkFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7Ozs7Ozs7O3lDQUdoQixLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDOzs7QUFBakQsV0FBRzs7O2NBSUQsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBOzs7OztjQUMvQyxxQ0FBYyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUM7Ozs0Q0FHckMsR0FBRzs7Ozs7OztDQUNYLENBQUM7O0FBRUYsZUFBYyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUIsT0FBTyxHQUFQLE9BQU87cUJBQ0QsVUFBVSIsImZpbGUiOiJsaWIvY29tbWFuZHMvcHJveHktaGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXJyb3JGcm9tQ29kZSwgZXJyb3JzLCByb3V0ZVRvQ29tbWFuZE5hbWUgfSBmcm9tICdhcHBpdW0tYmFzZS1kcml2ZXInO1xuaW1wb3J0IGxvZyBmcm9tICcuLi9sb2dnZXInO1xuaW1wb3J0IEIgZnJvbSAnYmx1ZWJpcmQnO1xuXG5cbmNvbnN0IFNVUFBPUlRFRF9NRVRIT0RTID0gWydHRVQnLCAnUE9TVCcsICdERUxFVEUnXTtcblxubGV0IGhlbHBlcnMgPSB7fSwgZXh0ZW5zaW9ucyA9IHt9O1xuXG5oZWxwZXJzLnByb3h5Q29tbWFuZCA9IGFzeW5jIGZ1bmN0aW9uIChlbmRwb2ludCwgbWV0aG9kLCBib2R5LCBpc1Nlc3Npb25Db21tYW5kID0gdHJ1ZSkge1xuICBpZiAodGhpcy5zaHV0ZG93blVuZXhwZWN0ZWRseSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghZW5kcG9pbnQpIHtcbiAgICBsb2cuZXJyb3JBbmRUaHJvdygnUHJveHlpbmcgcmVxdWlyZXMgYW4gZW5kcG9pbnQnKTtcbiAgfSBlbHNlIGlmIChTVVBQT1JURURfTUVUSE9EUy5pbmRleE9mKG1ldGhvZCkgPT09IC0xKSB7XG4gICAgbG9nLmVycm9yQW5kVGhyb3coYFByb3h5aW5nIG9ubHkgd29ya3MgZm9yIHRoZSBmb2xsb3dpbmcgcmVxdWVzdHM6ICR7U1VQUE9SVEVEX01FVEhPRFMuam9pbignLCAnKX1gKTtcbiAgfVxuXG4gIGlmICghdGhpcy53ZGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBjYWxsIHByb3h5Q29tbWFuZCB3aXRob3V0IFdEQSBkcml2ZXIgYWN0aXZlXCIpO1xuICB9XG4gIGNvbnN0IHByb3h5ID0gaXNTZXNzaW9uQ29tbWFuZCA/IHRoaXMud2RhLmp3cHJveHkgOiB0aGlzLndkYS5ub1Nlc3Npb25Qcm94eTtcbiAgaWYgKCFwcm94eSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNhbGwgcHJveHlDb21tYW5kIHdpdGhvdXQgV0RBIHByb3h5IGFjdGl2ZVwiKTtcbiAgfVxuXG4gIGNvbnN0IGNtZE5hbWUgPSByb3V0ZVRvQ29tbWFuZE5hbWUoZW5kcG9pbnQsIG1ldGhvZCk7XG4gIGNvbnN0IHRpbWVvdXQgPSB0aGlzLl9nZXRDb21tYW5kVGltZW91dChjbWROYW1lKTtcbiAgbGV0IHJlcyA9IG51bGw7XG4gIGlmICh0aW1lb3V0KSB7XG4gICAgbG9nLmRlYnVnKGBTZXR0aW5nIGN1c3RvbSB0aW1lb3V0IHRvICR7dGltZW91dH0gbXMgZm9yIFwiJHtjbWROYW1lfVwiIGNvbW1hbmRgKTtcbiAgICBsZXQgaXNDb21tYW5kRXhwaXJlZCA9IGZhbHNlO1xuICAgIHJlcyA9IGF3YWl0IEIuUHJvbWlzZS5yZXNvbHZlKHByb3h5LmNvbW1hbmQoZW5kcG9pbnQsIG1ldGhvZCwgYm9keSkpXG4gICAgICAgICAgICAgICAgICAudGltZW91dCh0aW1lb3V0KVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKEIuUHJvbWlzZS5UaW1lb3V0RXJyb3IsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaXNDb21tYW5kRXhwaXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICBpZiAoaXNDb21tYW5kRXhwaXJlZCkge1xuICAgICAgcHJveHkuY2FuY2VsQWN0aXZlUmVxdWVzdHMoKTtcbiAgICAgIGNvbnN0IGVyck1zZyA9IGBBcHBpdW0gZGlkIG5vdCBnZXQgYW55IHJlc3BvbnNlIGZyb20gXCIke2NtZE5hbWV9XCIgY29tbWFuZCBpbiAke3RpbWVvdXR9IG1zYDtcbiAgICAgIGF3YWl0IHRoaXMuc3RhcnRVbmV4cGVjdGVkU2h1dGRvd24obmV3IGVycm9ycy5UaW1lb3V0RXJyb3IoZXJyTXNnKSk7XG4gICAgICBsb2cuZXJyb3JBbmRUaHJvdyhlcnJNc2cpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXMgPSBhd2FpdCBwcm94eS5jb21tYW5kKGVuZHBvaW50LCBtZXRob2QsIGJvZHkpO1xuICB9XG5cbiAgLy8gdGVtcG9yYXJpbHkgaGFuZGxlIGVycm9ycyB0aGF0IGNhbiBiZSByZXR1cm5lZFxuICBpZiAocmVzICYmIHJlcy5zdGF0dXMgJiYgcGFyc2VJbnQocmVzLnN0YXR1cywgMTApICE9PSAwKSB7XG4gICAgdGhyb3cgZXJyb3JGcm9tQ29kZShyZXMuc3RhdHVzLCByZXMudmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIHJlcztcbn07XG5cbk9iamVjdC5hc3NpZ24oZXh0ZW5zaW9ucywgaGVscGVycyk7XG5leHBvcnQgeyBoZWxwZXJzIH07XG5leHBvcnQgZGVmYXVsdCBleHRlbnNpb25zO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLi8uLiJ9
