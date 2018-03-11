'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _appiumSupport = require('appium-support');

var _appiumBaseDriver = require('appium-base-driver');

var NoSessionProxy = (function (_JWProxy) {
  _inherits(NoSessionProxy, _JWProxy);

  function NoSessionProxy() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, NoSessionProxy);

    _get(Object.getPrototypeOf(NoSessionProxy.prototype), 'constructor', this).call(this, opts);
  }

  _createClass(NoSessionProxy, [{
    key: 'getUrlForProxy',
    value: function getUrlForProxy(url) {
      if (url === '') {
        url = '/';
      }
      var proxyBase = this.scheme + '://' + this.server + ':' + this.port + this.base;
      var remainingUrl = '';
      if (new RegExp('^/').test(url)) {
        remainingUrl = url;
      } else {
        throw new Error('Did not know what to do with url \'' + url + '\'');
      }
      remainingUrl = remainingUrl.replace(/\/$/, ''); // can't have trailing slashes
      return proxyBase + remainingUrl;
    }
  }, {
    key: 'proxyReqRes',
    value: function proxyReqRes(req, res) {
      var _ref, _ref2, response, body;

      return _regeneratorRuntime.async(function proxyReqRes$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.proxy(req.originalUrl, req.method, req.body));

          case 2:
            _ref = context$2$0.sent;
            _ref2 = _slicedToArray(_ref, 2);
            response = _ref2[0];
            body = _ref2[1];

            res.headers = response.headers;
            res.set('Content-type', response.headers['content-type']);
            body = _appiumSupport.util.safeJsonParse(body);
            res.status(response.statusCode).send(JSON.stringify(body));

          case 10:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return NoSessionProxy;
})(_appiumBaseDriver.JWProxy);

exports.NoSessionProxy = NoSessionProxy;
exports['default'] = NoSessionProxy;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi93ZGEvbm8tc2Vzc2lvbi1wcm94eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBQXFCLGdCQUFnQjs7Z0NBQ2Isb0JBQW9COztJQUd0QyxjQUFjO1lBQWQsY0FBYzs7QUFDTixXQURSLGNBQWMsR0FDTTtRQUFYLElBQUkseURBQUcsRUFBRTs7MEJBRGxCLGNBQWM7O0FBRWhCLCtCQUZFLGNBQWMsNkNBRVYsSUFBSSxFQUFFO0dBQ2I7O2VBSEcsY0FBYzs7V0FLSCx3QkFBQyxHQUFHLEVBQUU7QUFDbkIsVUFBSSxHQUFHLEtBQUssRUFBRSxFQUFFO0FBQ2QsV0FBRyxHQUFHLEdBQUcsQ0FBQztPQUNYO0FBQ0QsVUFBTSxTQUFTLEdBQU0sSUFBSSxDQUFDLE1BQU0sV0FBTSxJQUFJLENBQUMsTUFBTSxTQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQUFBRSxDQUFDO0FBQzdFLFVBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUN0QixVQUFJLEFBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2hDLG9CQUFZLEdBQUcsR0FBRyxDQUFDO09BQ3BCLE1BQU07QUFDTCxjQUFNLElBQUksS0FBSyx5Q0FBc0MsR0FBRyxRQUFJLENBQUM7T0FDOUQ7QUFDRCxrQkFBWSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLGFBQU8sU0FBUyxHQUFHLFlBQVksQ0FBQztLQUNqQzs7O1dBRWlCLHFCQUFDLEdBQUcsRUFBRSxHQUFHO3VCQUNwQixRQUFRLEVBQUUsSUFBSTs7Ozs7OzZDQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUM7Ozs7O0FBQXpFLG9CQUFRO0FBQUUsZ0JBQUk7O0FBQ25CLGVBQUcsQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztBQUMvQixlQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDMUQsZ0JBQUksR0FBRyxvQkFBSyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsZUFBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7Ozs7OztLQUM1RDs7O1NBMUJHLGNBQWM7OztRQTZCWCxjQUFjLEdBQWQsY0FBYztxQkFDUixjQUFjIiwiZmlsZSI6ImxpYi93ZGEvbm8tc2Vzc2lvbi1wcm94eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHV0aWwgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5pbXBvcnQgeyBKV1Byb3h5IH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcblxuXG5jbGFzcyBOb1Nlc3Npb25Qcm94eSBleHRlbmRzIEpXUHJveHkge1xuICBjb25zdHJ1Y3RvciAob3B0cyA9IHt9KSB7XG4gICAgc3VwZXIob3B0cyk7XG4gIH1cblxuICBnZXRVcmxGb3JQcm94eSAodXJsKSB7XG4gICAgaWYgKHVybCA9PT0gJycpIHtcbiAgICAgIHVybCA9ICcvJztcbiAgICB9XG4gICAgY29uc3QgcHJveHlCYXNlID0gYCR7dGhpcy5zY2hlbWV9Oi8vJHt0aGlzLnNlcnZlcn06JHt0aGlzLnBvcnR9JHt0aGlzLmJhc2V9YDtcbiAgICBsZXQgcmVtYWluaW5nVXJsID0gJyc7XG4gICAgaWYgKChuZXcgUmVnRXhwKCdeLycpKS50ZXN0KHVybCkpIHtcbiAgICAgIHJlbWFpbmluZ1VybCA9IHVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEaWQgbm90IGtub3cgd2hhdCB0byBkbyB3aXRoIHVybCAnJHt1cmx9J2ApO1xuICAgIH1cbiAgICByZW1haW5pbmdVcmwgPSByZW1haW5pbmdVcmwucmVwbGFjZSgvXFwvJC8sICcnKTsgLy8gY2FuJ3QgaGF2ZSB0cmFpbGluZyBzbGFzaGVzXG4gICAgcmV0dXJuIHByb3h5QmFzZSArIHJlbWFpbmluZ1VybDtcbiAgfVxuXG4gIGFzeW5jIHByb3h5UmVxUmVzIChyZXEsIHJlcykge1xuICAgIGxldCBbcmVzcG9uc2UsIGJvZHldID0gYXdhaXQgdGhpcy5wcm94eShyZXEub3JpZ2luYWxVcmwsIHJlcS5tZXRob2QsIHJlcS5ib2R5KTtcbiAgICByZXMuaGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnM7XG4gICAgcmVzLnNldCgnQ29udGVudC10eXBlJywgcmVzcG9uc2UuaGVhZGVyc1snY29udGVudC10eXBlJ10pO1xuICAgIGJvZHkgPSB1dGlsLnNhZmVKc29uUGFyc2UoYm9keSk7XG4gICAgcmVzLnN0YXR1cyhyZXNwb25zZS5zdGF0dXNDb2RlKS5zZW5kKEpTT04uc3RyaW5naWZ5KGJvZHkpKTtcbiAgfVxufVxuXG5leHBvcnQgeyBOb1Nlc3Npb25Qcm94eSB9O1xuZXhwb3J0IGRlZmF1bHQgTm9TZXNzaW9uUHJveHk7XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uLy4uIn0=
