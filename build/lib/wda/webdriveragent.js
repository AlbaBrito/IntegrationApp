'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url2 = require('url');

var _url3 = _interopRequireDefault(_url2);

var _appiumBaseDriver = require('appium-base-driver');

var _appiumSupport = require('appium-support');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _noSessionProxy = require("./no-session-proxy");

var _utils = require('./utils');

var _utils2 = require('../utils');

var _xcodebuild = require('./xcodebuild');

var _xcodebuild2 = _interopRequireDefault(_xcodebuild);

var _iproxy = require('./iproxy');

var _iproxy2 = _interopRequireDefault(_iproxy);

var _fkill = require('fkill');

var _fkill2 = _interopRequireDefault(_fkill);

var BOOTSTRAP_PATH = _path2['default'].resolve(__dirname, '..', '..', '..', 'WebDriverAgent');
var WDA_BUNDLE_ID = 'com.apple.test.WebDriverAgentRunner-Runner';
var WDA_LAUNCH_TIMEOUT = 60 * 1000;
var WDA_AGENT_PORT = 8100;
var WDA_BASE_URL = 'http://localhost';

var WebDriverAgent = (function () {
  function WebDriverAgent(xcodeVersion) {
    var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, WebDriverAgent);

    this.xcodeVersion = xcodeVersion;

    this.device = args.device;
    this.platformVersion = args.platformVersion;
    this.host = args.host;
    this.realDevice = !!args.realDevice;

    this.setWDAPaths(args.bootstrapPath, args.agentPath);

    this.wdaLocalPort = args.wdaLocalPort;

    this.prebuildWDA = args.prebuildWDA;

    this.webDriverAgentUrl = args.webDriverAgentUrl;

    this.started = false;

    this.wdaConnectionTimeout = args.wdaConnectionTimeout;

    this.useCarthageSsl = _lodash2['default'].isBoolean(args.useCarthageSsl) && args.useCarthageSsl;

    this.useXctestrunFile = args.useXctestrunFile;

    this.xcodebuild = new _xcodebuild2['default'](this.xcodeVersion, this.device, {
      platformVersion: this.platformVersion,
      agentPath: this.agentPath,
      bootstrapPath: this.bootstrapPath,
      realDevice: this.realDevice,
      showXcodeLog: !!args.showXcodeLog,
      xcodeConfigFile: args.xcodeConfigFile,
      xcodeOrgId: args.xcodeOrgId,
      xcodeSigningId: args.xcodeSigningId,
      keychainPath: args.keychainPath,
      keychainPassword: args.keychainPassword,
      useSimpleBuildTest: args.useSimpleBuildTest,
      usePrebuiltWDA: args.usePrebuiltWDA,
      updatedWDABundleId: args.updatedWDABundleId,
      launchTimeout: args.wdaLaunchTimeout || WDA_LAUNCH_TIMEOUT,
      wdaRemotePort: this.realDevice ? WDA_AGENT_PORT : this.wdaLocalPort || WDA_AGENT_PORT,
      useXctestrunFile: this.useXctestrunFile
    });
  }

  _createClass(WebDriverAgent, [{
    key: 'setWDAPaths',
    value: function setWDAPaths(bootstrapPath, agentPath) {
      // allow the user to specify a place for WDA. This is undocumented and
      // only here for the purposes of testing development of WDA
      this.bootstrapPath = bootstrapPath || BOOTSTRAP_PATH;
      _logger2['default'].info('Using WDA path: \'' + this.bootstrapPath + '\'');

      // for backward compatibility we need to be able to specify agentPath too
      this.agentPath = agentPath || _path2['default'].resolve(this.bootstrapPath, 'WebDriverAgent.xcodeproj');
      _logger2['default'].info('Using WDA agent: \'' + this.agentPath + '\'');
    }
  }, {
    key: 'cleanupObsoleteProcesses',
    value: function cleanupObsoleteProcesses() {
      var pids;
      return _regeneratorRuntime.async(function cleanupObsoleteProcesses$(context$2$0) {
        var _this = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap((0, _utils2.getPIDsListeningOnPort)(this.url.port, function (cmdLine) {
              return (cmdLine.includes('/WebDriverAgentRunner') || cmdLine.includes('/iproxy')) && !cmdLine.toLowerCase().includes(_this.device.udid.toLowerCase());
            }));

          case 2:
            pids = context$2$0.sent;

            if (pids.length) {
              context$2$0.next = 6;
              break;
            }

            _logger2['default'].debug('No obsolete cached processes from previous WDA sessions ' + ('listening on port ' + this.url.port + ' have been found'));
            return context$2$0.abrupt('return');

          case 6:

            _logger2['default'].info('Detected ' + pids.length + ' obsolete cached process' + (pids.length === 1 ? '' : 'es') + ' ' + 'from previous WDA sessions. Cleaning up...');
            context$2$0.prev = 7;
            context$2$0.next = 10;
            return _regeneratorRuntime.awrap((0, _fkill2['default'])(pids));

          case 10:
            context$2$0.next = 15;
            break;

          case 12:
            context$2$0.prev = 12;
            context$2$0.t0 = context$2$0['catch'](7);

            _logger2['default'].warn('Failed to kill obsolete cached process' + (pids.length === 1 ? '' : 'es') + ' \'' + pids + '\'. ' + ('Original error: ' + context$2$0.t0.message));

          case 15:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[7, 12]]);
    }
  }, {
    key: 'isRunning',
    value: function isRunning() {
      var noSessionProxy, _status;

      return _regeneratorRuntime.async(function isRunning$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            noSessionProxy = new _noSessionProxy.NoSessionProxy({
              server: this.url.hostname,
              port: this.url.port,
              base: '',
              timeout: 3000
            });
            context$2$0.prev = 1;
            context$2$0.next = 4;
            return _regeneratorRuntime.awrap(noSessionProxy.command('/status', 'GET'));

          case 4:
            _status = context$2$0.sent;

            if (_status) {
              context$2$0.next = 7;
              break;
            }

            throw new Error('WDA response to /status command should be defined.');

          case 7:
            return context$2$0.abrupt('return', true);

          case 10:
            context$2$0.prev = 10;
            context$2$0.t0 = context$2$0['catch'](1);

            _logger2['default'].debug('WDA is not listening at \'' + this.url.href + '\'');
            return context$2$0.abrupt('return', false);

          case 14:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[1, 10]]);
    }
  }, {
    key: 'uninstall',
    value: function uninstall() {
      return _regeneratorRuntime.async(function uninstall$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            _logger2['default'].debug('Removing WDA application from device');
            context$2$0.prev = 1;
            context$2$0.next = 4;
            return _regeneratorRuntime.awrap(this.device.removeApp(WDA_BUNDLE_ID));

          case 4:
            context$2$0.next = 9;
            break;

          case 6:
            context$2$0.prev = 6;
            context$2$0.t0 = context$2$0['catch'](1);

            _logger2['default'].warn('WebDriverAgent uninstall failed. Perhaps, it is already uninstalled? Original error: ' + JSON.stringify(context$2$0.t0));

          case 9:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[1, 6]]);
    }
  }, {
    key: 'launch',
    value: function launch(sessionId) {
      return _regeneratorRuntime.async(function launch$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!this.webDriverAgentUrl) {
              context$2$0.next = 5;
              break;
            }

            _logger2['default'].info('Using provided WebdriverAgent at \'' + this.webDriverAgentUrl + '\'');
            this.url = this.webDriverAgentUrl;
            this.setupProxies(sessionId);
            return context$2$0.abrupt('return');

          case 5:

            _logger2['default'].info('Launching WebDriverAgent on the device');

            this.setupProxies(sessionId);

            context$2$0.t0 = !this.useXctestrunFile;

            if (!context$2$0.t0) {
              context$2$0.next = 12;
              break;
            }

            context$2$0.next = 11;
            return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(this.agentPath));

          case 11:
            context$2$0.t0 = !context$2$0.sent;

          case 12:
            if (!context$2$0.t0) {
              context$2$0.next = 14;
              break;
            }

            throw new Error('Trying to use WebDriverAgent project at \'' + this.agentPath + '\' but the ' + 'file does not exist');

          case 14:
            if (this.useXctestrunFile) {
              context$2$0.next = 17;
              break;
            }

            context$2$0.next = 17;
            return _regeneratorRuntime.awrap((0, _utils.checkForDependencies)(this.bootstrapPath, this.useCarthageSsl));

          case 17:
            context$2$0.next = 19;
            return _regeneratorRuntime.awrap((0, _utils2.resetXCTestProcesses)(this.device.udid, !this.realDevice, { wdaLocalPort: this.url.port }));

          case 19:
            if (!this.realDevice) {
              context$2$0.next = 23;
              break;
            }

            this.iproxy = new _iproxy2['default'](this.device.udid, this.url.port, WDA_AGENT_PORT);
            context$2$0.next = 23;
            return _regeneratorRuntime.awrap(this.iproxy.start());

          case 23:
            context$2$0.next = 25;
            return _regeneratorRuntime.awrap(this.xcodebuild.init(this.noSessionProxy));

          case 25:
            if (!this.prebuildWDA) {
              context$2$0.next = 28;
              break;
            }

            context$2$0.next = 28;
            return _regeneratorRuntime.awrap(this.xcodebuild.prebuild());

          case 28:
            context$2$0.next = 30;
            return _regeneratorRuntime.awrap(this.xcodebuild.start());

          case 30:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 31:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'setupProxies',
    value: function setupProxies(sessionId) {
      var proxyOpts = {
        server: this.url.hostname,
        port: this.url.port,
        base: '',
        timeout: this.wdaConnectionTimeout
      };

      this.jwproxy = new _appiumBaseDriver.JWProxy(proxyOpts);
      this.jwproxy.sessionId = sessionId;
      this.proxyReqRes = this.jwproxy.proxyReqRes.bind(this.jwproxy);

      this.noSessionProxy = new _noSessionProxy.NoSessionProxy(proxyOpts);
      this.noSessionProxyReqRes = this.noSessionProxy.proxyReqRes.bind(this.noSessionProxy);
    }
  }, {
    key: 'quit',
    value: function quit() {
      return _regeneratorRuntime.async(function quit$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            _logger2['default'].info('Shutting down sub-processes');

            if (!this.iproxy) {
              context$2$0.next = 4;
              break;
            }

            context$2$0.next = 4;
            return _regeneratorRuntime.awrap(this.iproxy.quit());

          case 4:
            context$2$0.next = 6;
            return _regeneratorRuntime.awrap(this.xcodebuild.quit());

          case 6:
            context$2$0.next = 8;
            return _regeneratorRuntime.awrap(this.xcodebuild.reset());

          case 8:

            if (this.jwproxy) {
              this.jwproxy.sessionId = null;
            }

            this.started = false;

          case 10:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'retrieveDerivedDataPath',
    value: function retrieveDerivedDataPath() {
      return _regeneratorRuntime.async(function retrieveDerivedDataPath$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.xcodebuild.retrieveDerivedDataPath());

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'url',
    get: function get() {
      if (!this._url) {
        var port = this.wdaLocalPort || WDA_AGENT_PORT;
        this._url = _url3['default'].parse(WDA_BASE_URL + ':' + port);
      }
      return this._url;
    },
    set: function set(_url) {
      this._url = _url3['default'].parse(_url);
    }
  }, {
    key: 'fullyStarted',
    get: function get() {
      return this.started;
    },
    set: function set() {
      var started = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      // before WDA is started we expect errors from iproxy, since it is not
      // communicating with anything yet
      this.started = started;
      if (this.iproxy) {
        this.iproxy.expectIProxyErrors = !started;
      }
    }
  }]);

  return WebDriverAgent;
})();

exports['default'] = WebDriverAgent;
exports.WebDriverAgent = WebDriverAgent;
exports.WDA_BUNDLE_ID = WDA_BUNDLE_ID;
exports.BOOTSTRAP_PATH = BOOTSTRAP_PATH;

// make sure that the WDA dependencies have been built

// We need to provide WDA local port, because it might be occupied with
// iproxy instance initiated by some preceeding run with a real device
// (iproxy instances are not killed on session termination by default)

// Start the xcodebuild process
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi93ZGEvd2ViZHJpdmVyYWdlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7OztvQkFDTCxNQUFNOzs7O29CQUNQLEtBQUs7Ozs7Z0NBQ0csb0JBQW9COzs2QkFDekIsZ0JBQWdCOztzQkFDbkIsV0FBVzs7Ozs4QkFDSSxvQkFBb0I7O3FCQUNkLFNBQVM7O3NCQUNlLFVBQVU7OzBCQUNoRCxjQUFjOzs7O3NCQUNsQixVQUFVOzs7O3FCQUNYLE9BQU87Ozs7QUFHekIsSUFBTSxjQUFjLEdBQUcsa0JBQUssT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ25GLElBQU0sYUFBYSxHQUFHLDRDQUE0QyxDQUFDO0FBQ25FLElBQU0sa0JBQWtCLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNyQyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDNUIsSUFBTSxZQUFZLEdBQUcsa0JBQWtCLENBQUM7O0lBR2xDLGNBQWM7QUFDTixXQURSLGNBQWMsQ0FDTCxZQUFZLEVBQWE7UUFBWCxJQUFJLHlEQUFHLEVBQUU7OzBCQURoQyxjQUFjOztBQUVoQixRQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQzs7QUFFakMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztBQUM1QyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7QUFFcEMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFckQsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDOztBQUV0QyxRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7O0FBRXBDLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7O0FBRWhELFFBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOztBQUVyQixRQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDOztBQUV0RCxRQUFJLENBQUMsY0FBYyxHQUFHLG9CQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQzs7QUFFOUUsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQzs7QUFFOUMsUUFBSSxDQUFDLFVBQVUsR0FBRyw0QkFBZSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDL0QscUJBQWUsRUFBRSxJQUFJLENBQUMsZUFBZTtBQUNyQyxlQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7QUFDekIsbUJBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtBQUNqQyxnQkFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO0FBQzNCLGtCQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZO0FBQ2pDLHFCQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWU7QUFDckMsZ0JBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtBQUMzQixvQkFBYyxFQUFFLElBQUksQ0FBQyxjQUFjO0FBQ25DLGtCQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7QUFDL0Isc0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtBQUN2Qyx3QkFBa0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCO0FBQzNDLG9CQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7QUFDbkMsd0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtBQUMzQyxtQkFBYSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxrQkFBa0I7QUFDMUQsbUJBQWEsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLGNBQWMsR0FBSSxJQUFJLENBQUMsWUFBWSxJQUFJLGNBQWMsQUFBQztBQUN2RixzQkFBZ0IsRUFBRyxJQUFJLENBQUMsZ0JBQWdCO0tBQ3pDLENBQUMsQ0FBQztHQUNKOztlQTNDRyxjQUFjOztXQTZDTixxQkFBQyxhQUFhLEVBQUUsU0FBUyxFQUFFOzs7QUFHckMsVUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLElBQUksY0FBYyxDQUFDO0FBQ3JELDBCQUFJLElBQUksd0JBQXFCLElBQUksQ0FBQyxhQUFhLFFBQUksQ0FBQzs7O0FBR3BELFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxJQUFJLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLDBCQUEwQixDQUFDLENBQUM7QUFDM0YsMEJBQUksSUFBSSx5QkFBc0IsSUFBSSxDQUFDLFNBQVMsUUFBSSxDQUFDO0tBQ2xEOzs7V0FFOEI7VUFDdkIsSUFBSTs7Ozs7Ozs2Q0FBUyxvQ0FBdUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQ3JELFVBQUMsT0FBTztxQkFBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBLElBQ3BGLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7YUFBQSxDQUFDOzs7QUFGOUQsZ0JBQUk7O2dCQUdMLElBQUksQ0FBQyxNQUFNOzs7OztBQUNkLGdDQUFJLEtBQUssQ0FBQyxxRkFDcUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLHNCQUFrQixDQUFDLENBQUM7Ozs7O0FBSWxFLGdDQUFJLElBQUksQ0FBQyxjQUFZLElBQUksQ0FBQyxNQUFNLGlDQUEyQixJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFBLHFEQUNuQyxDQUFDLENBQUM7Ozs2Q0FFL0Msd0JBQU0sSUFBSSxDQUFDOzs7Ozs7Ozs7O0FBRWpCLGdDQUFJLElBQUksQ0FBQyw0Q0FBeUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQSxXQUFLLElBQUksa0NBQzVELGVBQUUsT0FBTyxDQUFFLENBQUMsQ0FBQzs7Ozs7OztLQUU1Qzs7O1dBRWU7VUFDUixjQUFjLEVBT1osT0FBTTs7Ozs7QUFQUiwwQkFBYyxHQUFHLG1DQUFtQjtBQUN4QyxvQkFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUTtBQUN6QixrQkFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSTtBQUNuQixrQkFBSSxFQUFFLEVBQUU7QUFDUixxQkFBTyxFQUFFLElBQUk7YUFDZCxDQUFDOzs7NkNBRXFCLGNBQWMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQzs7O0FBQXZELG1CQUFNOztnQkFDUCxPQUFNOzs7OztrQkFDSCxJQUFJLEtBQUssc0RBQXNEOzs7Z0RBRWhFLElBQUk7Ozs7OztBQUVYLGdDQUFJLEtBQUssZ0NBQTZCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxRQUFJLENBQUM7Z0RBQ2pELEtBQUs7Ozs7Ozs7S0FFZjs7O1dBRWU7Ozs7QUFDZCxnQ0FBSSxLQUFLLHdDQUF3QyxDQUFDOzs7NkNBRTFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQzs7Ozs7Ozs7OztBQUUxQyxnQ0FBSSxJQUFJLDJGQUF5RixJQUFJLENBQUMsU0FBUyxnQkFBRyxDQUFHLENBQUM7Ozs7Ozs7S0FFekg7OztXQUVZLGdCQUFDLFNBQVM7Ozs7aUJBQ2pCLElBQUksQ0FBQyxpQkFBaUI7Ozs7O0FBQ3hCLGdDQUFJLElBQUkseUNBQXNDLElBQUksQ0FBQyxpQkFBaUIsUUFBSSxDQUFDO0FBQ3pFLGdCQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztBQUNsQyxnQkFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7Ozs7QUFJL0IsZ0NBQUksSUFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7O0FBRW5ELGdCQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs2QkFFekIsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCOzs7Ozs7Ozs2Q0FBVyxrQkFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQzs7Ozs7Ozs7Ozs7a0JBQ3RELElBQUksS0FBSyxDQUFDLCtDQUE0QyxJQUFJLENBQUMsU0FBUyxtQkFDMUQscUJBQXFCLENBQUM7OztnQkFHbkMsSUFBSSxDQUFDLGdCQUFnQjs7Ozs7OzZDQUVsQixpQ0FBcUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDOzs7OzZDQUsvRCxrQ0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDLENBQUM7OztpQkFFekYsSUFBSSxDQUFDLFVBQVU7Ozs7O0FBQ2pCLGdCQUFJLENBQUMsTUFBTSxHQUFHLHdCQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDOzs2Q0FDcEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Ozs7NkNBR3JCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7OztpQkFHM0MsSUFBSSxDQUFDLFdBQVc7Ozs7Ozs2Q0FDWixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTs7Ozs2Q0FFckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUU7Ozs7Ozs7Ozs7S0FDckM7OztXQUVZLHNCQUFDLFNBQVMsRUFBRTtBQUN2QixVQUFNLFNBQVMsR0FBRztBQUNoQixjQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRO0FBQ3pCLFlBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUk7QUFDbkIsWUFBSSxFQUFFLEVBQUU7QUFDUixlQUFPLEVBQUUsSUFBSSxDQUFDLG9CQUFvQjtPQUNuQyxDQUFDOztBQUVGLFVBQUksQ0FBQyxPQUFPLEdBQUcsOEJBQVksU0FBUyxDQUFDLENBQUM7QUFDdEMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQ25DLFVBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFL0QsVUFBSSxDQUFDLGNBQWMsR0FBRyxtQ0FBbUIsU0FBUyxDQUFDLENBQUM7QUFDcEQsVUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDdkY7OztXQUVVOzs7O0FBQ1QsZ0NBQUksSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7O2lCQUVwQyxJQUFJLENBQUMsTUFBTTs7Ozs7OzZDQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFOzs7OzZDQUdwQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTs7Ozs2Q0FDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUU7Ozs7QUFFN0IsZ0JBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixrQkFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2FBQy9COztBQUVELGdCQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzs7Ozs7OztLQUN0Qjs7O1dBMkI2Qjs7Ozs7NkNBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsRUFBRTs7Ozs7Ozs7OztLQUN2RDs7O1NBM0JPLGVBQUc7QUFDVCxVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtBQUNkLFlBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksY0FBYyxDQUFDO0FBQy9DLFlBQUksQ0FBQyxJQUFJLEdBQUcsaUJBQUksS0FBSyxDQUFJLFlBQVksU0FBSSxJQUFJLENBQUcsQ0FBQztPQUNsRDtBQUNELGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQztLQUNsQjtTQUVPLGFBQUMsSUFBSSxFQUFFO0FBQ2IsVUFBSSxDQUFDLElBQUksR0FBRyxpQkFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0I7OztTQUVnQixlQUFHO0FBQ2xCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjtTQUVnQixlQUFrQjtVQUFqQixPQUFPLHlEQUFHLEtBQUs7Ozs7QUFHL0IsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsVUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsWUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLE9BQU8sQ0FBQztPQUMzQztLQUNGOzs7U0F4TUcsY0FBYzs7O3FCQStNTCxjQUFjO1FBQ3BCLGNBQWMsR0FBZCxjQUFjO1FBQUUsYUFBYSxHQUFiLGFBQWE7UUFBRSxjQUFjLEdBQWQsY0FBYyIsImZpbGUiOiJsaWIvd2RhL3dlYmRyaXZlcmFnZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuaW1wb3J0IHsgSldQcm94eSB9IGZyb20gJ2FwcGl1bS1iYXNlLWRyaXZlcic7XG5pbXBvcnQgeyBmcyB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcbmltcG9ydCBsb2cgZnJvbSAnLi4vbG9nZ2VyJztcbmltcG9ydCB7IE5vU2Vzc2lvblByb3h5IH0gZnJvbSBcIi4vbm8tc2Vzc2lvbi1wcm94eVwiO1xuaW1wb3J0IHsgY2hlY2tGb3JEZXBlbmRlbmNpZXMgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IHJlc2V0WENUZXN0UHJvY2Vzc2VzLCBnZXRQSURzTGlzdGVuaW5nT25Qb3J0IH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IFhjb2RlQnVpbGQgZnJvbSAnLi94Y29kZWJ1aWxkJztcbmltcG9ydCBpUHJveHkgZnJvbSAnLi9pcHJveHknO1xuaW1wb3J0IGZraWxsIGZyb20gJ2ZraWxsJztcblxuXG5jb25zdCBCT09UU1RSQVBfUEFUSCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICcuLicsICcuLicsICdXZWJEcml2ZXJBZ2VudCcpO1xuY29uc3QgV0RBX0JVTkRMRV9JRCA9ICdjb20uYXBwbGUudGVzdC5XZWJEcml2ZXJBZ2VudFJ1bm5lci1SdW5uZXInO1xuY29uc3QgV0RBX0xBVU5DSF9USU1FT1VUID0gNjAgKiAxMDAwO1xuY29uc3QgV0RBX0FHRU5UX1BPUlQgPSA4MTAwO1xuY29uc3QgV0RBX0JBU0VfVVJMID0gJ2h0dHA6Ly9sb2NhbGhvc3QnO1xuXG5cbmNsYXNzIFdlYkRyaXZlckFnZW50IHtcbiAgY29uc3RydWN0b3IgKHhjb2RlVmVyc2lvbiwgYXJncyA9IHt9KSB7XG4gICAgdGhpcy54Y29kZVZlcnNpb24gPSB4Y29kZVZlcnNpb247XG5cbiAgICB0aGlzLmRldmljZSA9IGFyZ3MuZGV2aWNlO1xuICAgIHRoaXMucGxhdGZvcm1WZXJzaW9uID0gYXJncy5wbGF0Zm9ybVZlcnNpb247XG4gICAgdGhpcy5ob3N0ID0gYXJncy5ob3N0O1xuICAgIHRoaXMucmVhbERldmljZSA9ICEhYXJncy5yZWFsRGV2aWNlO1xuXG4gICAgdGhpcy5zZXRXREFQYXRocyhhcmdzLmJvb3RzdHJhcFBhdGgsIGFyZ3MuYWdlbnRQYXRoKTtcblxuICAgIHRoaXMud2RhTG9jYWxQb3J0ID0gYXJncy53ZGFMb2NhbFBvcnQ7XG5cbiAgICB0aGlzLnByZWJ1aWxkV0RBID0gYXJncy5wcmVidWlsZFdEQTtcblxuICAgIHRoaXMud2ViRHJpdmVyQWdlbnRVcmwgPSBhcmdzLndlYkRyaXZlckFnZW50VXJsO1xuXG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLndkYUNvbm5lY3Rpb25UaW1lb3V0ID0gYXJncy53ZGFDb25uZWN0aW9uVGltZW91dDtcblxuICAgIHRoaXMudXNlQ2FydGhhZ2VTc2wgPSBfLmlzQm9vbGVhbihhcmdzLnVzZUNhcnRoYWdlU3NsKSAmJiBhcmdzLnVzZUNhcnRoYWdlU3NsO1xuXG4gICAgdGhpcy51c2VYY3Rlc3RydW5GaWxlID0gYXJncy51c2VYY3Rlc3RydW5GaWxlO1xuXG4gICAgdGhpcy54Y29kZWJ1aWxkID0gbmV3IFhjb2RlQnVpbGQodGhpcy54Y29kZVZlcnNpb24sIHRoaXMuZGV2aWNlLCB7XG4gICAgICBwbGF0Zm9ybVZlcnNpb246IHRoaXMucGxhdGZvcm1WZXJzaW9uLFxuICAgICAgYWdlbnRQYXRoOiB0aGlzLmFnZW50UGF0aCxcbiAgICAgIGJvb3RzdHJhcFBhdGg6IHRoaXMuYm9vdHN0cmFwUGF0aCxcbiAgICAgIHJlYWxEZXZpY2U6IHRoaXMucmVhbERldmljZSxcbiAgICAgIHNob3dYY29kZUxvZzogISFhcmdzLnNob3dYY29kZUxvZyxcbiAgICAgIHhjb2RlQ29uZmlnRmlsZTogYXJncy54Y29kZUNvbmZpZ0ZpbGUsXG4gICAgICB4Y29kZU9yZ0lkOiBhcmdzLnhjb2RlT3JnSWQsXG4gICAgICB4Y29kZVNpZ25pbmdJZDogYXJncy54Y29kZVNpZ25pbmdJZCxcbiAgICAgIGtleWNoYWluUGF0aDogYXJncy5rZXljaGFpblBhdGgsXG4gICAgICBrZXljaGFpblBhc3N3b3JkOiBhcmdzLmtleWNoYWluUGFzc3dvcmQsXG4gICAgICB1c2VTaW1wbGVCdWlsZFRlc3Q6IGFyZ3MudXNlU2ltcGxlQnVpbGRUZXN0LFxuICAgICAgdXNlUHJlYnVpbHRXREE6IGFyZ3MudXNlUHJlYnVpbHRXREEsXG4gICAgICB1cGRhdGVkV0RBQnVuZGxlSWQ6IGFyZ3MudXBkYXRlZFdEQUJ1bmRsZUlkLFxuICAgICAgbGF1bmNoVGltZW91dDogYXJncy53ZGFMYXVuY2hUaW1lb3V0IHx8IFdEQV9MQVVOQ0hfVElNRU9VVCxcbiAgICAgIHdkYVJlbW90ZVBvcnQ6IHRoaXMucmVhbERldmljZSA/IFdEQV9BR0VOVF9QT1JUIDogKHRoaXMud2RhTG9jYWxQb3J0IHx8IFdEQV9BR0VOVF9QT1JUKSxcbiAgICAgIHVzZVhjdGVzdHJ1bkZpbGUgOiB0aGlzLnVzZVhjdGVzdHJ1bkZpbGVcbiAgICB9KTtcbiAgfVxuXG4gIHNldFdEQVBhdGhzIChib290c3RyYXBQYXRoLCBhZ2VudFBhdGgpIHtcbiAgICAvLyBhbGxvdyB0aGUgdXNlciB0byBzcGVjaWZ5IGEgcGxhY2UgZm9yIFdEQS4gVGhpcyBpcyB1bmRvY3VtZW50ZWQgYW5kXG4gICAgLy8gb25seSBoZXJlIGZvciB0aGUgcHVycG9zZXMgb2YgdGVzdGluZyBkZXZlbG9wbWVudCBvZiBXREFcbiAgICB0aGlzLmJvb3RzdHJhcFBhdGggPSBib290c3RyYXBQYXRoIHx8IEJPT1RTVFJBUF9QQVRIO1xuICAgIGxvZy5pbmZvKGBVc2luZyBXREEgcGF0aDogJyR7dGhpcy5ib290c3RyYXBQYXRofSdgKTtcblxuICAgIC8vIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IHdlIG5lZWQgdG8gYmUgYWJsZSB0byBzcGVjaWZ5IGFnZW50UGF0aCB0b29cbiAgICB0aGlzLmFnZW50UGF0aCA9IGFnZW50UGF0aCB8fCBwYXRoLnJlc29sdmUodGhpcy5ib290c3RyYXBQYXRoLCAnV2ViRHJpdmVyQWdlbnQueGNvZGVwcm9qJyk7XG4gICAgbG9nLmluZm8oYFVzaW5nIFdEQSBhZ2VudDogJyR7dGhpcy5hZ2VudFBhdGh9J2ApO1xuICB9XG5cbiAgYXN5bmMgY2xlYW51cE9ic29sZXRlUHJvY2Vzc2VzICgpIHtcbiAgICBjb25zdCBwaWRzID0gYXdhaXQgZ2V0UElEc0xpc3RlbmluZ09uUG9ydCh0aGlzLnVybC5wb3J0LFxuICAgICAgKGNtZExpbmUpID0+IChjbWRMaW5lLmluY2x1ZGVzKCcvV2ViRHJpdmVyQWdlbnRSdW5uZXInKSB8fCBjbWRMaW5lLmluY2x1ZGVzKCcvaXByb3h5JykpICYmXG4gICAgICAgICFjbWRMaW5lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGhpcy5kZXZpY2UudWRpZC50b0xvd2VyQ2FzZSgpKSk7XG4gICAgaWYgKCFwaWRzLmxlbmd0aCkge1xuICAgICAgbG9nLmRlYnVnKGBObyBvYnNvbGV0ZSBjYWNoZWQgcHJvY2Vzc2VzIGZyb20gcHJldmlvdXMgV0RBIHNlc3Npb25zIGAgK1xuICAgICAgICAgICAgICAgIGBsaXN0ZW5pbmcgb24gcG9ydCAke3RoaXMudXJsLnBvcnR9IGhhdmUgYmVlbiBmb3VuZGApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKGBEZXRlY3RlZCAke3BpZHMubGVuZ3RofSBvYnNvbGV0ZSBjYWNoZWQgcHJvY2VzcyR7cGlkcy5sZW5ndGggPT09IDEgPyAnJyA6ICdlcyd9IGAgK1xuICAgICAgICAgICAgIGBmcm9tIHByZXZpb3VzIFdEQSBzZXNzaW9ucy4gQ2xlYW5pbmcgdXAuLi5gKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZmtpbGwocGlkcyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nLndhcm4oYEZhaWxlZCB0byBraWxsIG9ic29sZXRlIGNhY2hlZCBwcm9jZXNzJHtwaWRzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ2VzJ30gJyR7cGlkc30nLiBgICtcbiAgICAgICAgICAgICAgIGBPcmlnaW5hbCBlcnJvcjogJHtlLm1lc3NhZ2V9YCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgaXNSdW5uaW5nICgpIHtcbiAgICBjb25zdCBub1Nlc3Npb25Qcm94eSA9IG5ldyBOb1Nlc3Npb25Qcm94eSh7XG4gICAgICBzZXJ2ZXI6IHRoaXMudXJsLmhvc3RuYW1lLFxuICAgICAgcG9ydDogdGhpcy51cmwucG9ydCxcbiAgICAgIGJhc2U6ICcnLFxuICAgICAgdGltZW91dDogMzAwMCxcbiAgICB9KTtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgbm9TZXNzaW9uUHJveHkuY29tbWFuZCgnL3N0YXR1cycsICdHRVQnKTtcbiAgICAgIGlmICghc3RhdHVzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgV0RBIHJlc3BvbnNlIHRvIC9zdGF0dXMgY29tbWFuZCBzaG91bGQgYmUgZGVmaW5lZC5gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgbG9nLmRlYnVnKGBXREEgaXMgbm90IGxpc3RlbmluZyBhdCAnJHt0aGlzLnVybC5ocmVmfSdgKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBhc3luYyB1bmluc3RhbGwgKCkge1xuICAgIGxvZy5kZWJ1ZyhgUmVtb3ZpbmcgV0RBIGFwcGxpY2F0aW9uIGZyb20gZGV2aWNlYCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLnJlbW92ZUFwcChXREFfQlVORExFX0lEKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2cud2FybihgV2ViRHJpdmVyQWdlbnQgdW5pbnN0YWxsIGZhaWxlZC4gUGVyaGFwcywgaXQgaXMgYWxyZWFkeSB1bmluc3RhbGxlZD8gT3JpZ2luYWwgZXJyb3I6ICR7SlNPTi5zdHJpbmdpZnkoZSl9YCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbGF1bmNoIChzZXNzaW9uSWQpIHtcbiAgICBpZiAodGhpcy53ZWJEcml2ZXJBZ2VudFVybCkge1xuICAgICAgbG9nLmluZm8oYFVzaW5nIHByb3ZpZGVkIFdlYmRyaXZlckFnZW50IGF0ICcke3RoaXMud2ViRHJpdmVyQWdlbnRVcmx9J2ApO1xuICAgICAgdGhpcy51cmwgPSB0aGlzLndlYkRyaXZlckFnZW50VXJsO1xuICAgICAgdGhpcy5zZXR1cFByb3hpZXMoc2Vzc2lvbklkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsb2cuaW5mbygnTGF1bmNoaW5nIFdlYkRyaXZlckFnZW50IG9uIHRoZSBkZXZpY2UnKTtcblxuICAgIHRoaXMuc2V0dXBQcm94aWVzKHNlc3Npb25JZCk7XG5cbiAgICBpZiAoIXRoaXMudXNlWGN0ZXN0cnVuRmlsZSAmJiAhYXdhaXQgZnMuZXhpc3RzKHRoaXMuYWdlbnRQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcnlpbmcgdG8gdXNlIFdlYkRyaXZlckFnZW50IHByb2plY3QgYXQgJyR7dGhpcy5hZ2VudFBhdGh9JyBidXQgdGhlIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICdmaWxlIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnVzZVhjdGVzdHJ1bkZpbGUpIHtcbiAgICAgIC8vIG1ha2Ugc3VyZSB0aGF0IHRoZSBXREEgZGVwZW5kZW5jaWVzIGhhdmUgYmVlbiBidWlsdFxuICAgICAgYXdhaXQgY2hlY2tGb3JEZXBlbmRlbmNpZXModGhpcy5ib290c3RyYXBQYXRoLCB0aGlzLnVzZUNhcnRoYWdlU3NsKTtcbiAgICB9XG4gICAgLy8gV2UgbmVlZCB0byBwcm92aWRlIFdEQSBsb2NhbCBwb3J0LCBiZWNhdXNlIGl0IG1pZ2h0IGJlIG9jY3VwaWVkIHdpdGhcbiAgICAvLyBpcHJveHkgaW5zdGFuY2UgaW5pdGlhdGVkIGJ5IHNvbWUgcHJlY2VlZGluZyBydW4gd2l0aCBhIHJlYWwgZGV2aWNlXG4gICAgLy8gKGlwcm94eSBpbnN0YW5jZXMgYXJlIG5vdCBraWxsZWQgb24gc2Vzc2lvbiB0ZXJtaW5hdGlvbiBieSBkZWZhdWx0KVxuICAgIGF3YWl0IHJlc2V0WENUZXN0UHJvY2Vzc2VzKHRoaXMuZGV2aWNlLnVkaWQsICF0aGlzLnJlYWxEZXZpY2UsIHt3ZGFMb2NhbFBvcnQ6IHRoaXMudXJsLnBvcnR9KTtcblxuICAgIGlmICh0aGlzLnJlYWxEZXZpY2UpIHtcbiAgICAgIHRoaXMuaXByb3h5ID0gbmV3IGlQcm94eSh0aGlzLmRldmljZS51ZGlkLCB0aGlzLnVybC5wb3J0LCBXREFfQUdFTlRfUE9SVCk7XG4gICAgICBhd2FpdCB0aGlzLmlwcm94eS5zdGFydCgpO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMueGNvZGVidWlsZC5pbml0KHRoaXMubm9TZXNzaW9uUHJveHkpO1xuXG4gICAgLy8gU3RhcnQgdGhlIHhjb2RlYnVpbGQgcHJvY2Vzc1xuICAgIGlmICh0aGlzLnByZWJ1aWxkV0RBKSB7XG4gICAgICBhd2FpdCB0aGlzLnhjb2RlYnVpbGQucHJlYnVpbGQoKTtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMueGNvZGVidWlsZC5zdGFydCgpO1xuICB9XG5cbiAgc2V0dXBQcm94aWVzIChzZXNzaW9uSWQpIHtcbiAgICBjb25zdCBwcm94eU9wdHMgPSB7XG4gICAgICBzZXJ2ZXI6IHRoaXMudXJsLmhvc3RuYW1lLFxuICAgICAgcG9ydDogdGhpcy51cmwucG9ydCxcbiAgICAgIGJhc2U6ICcnLFxuICAgICAgdGltZW91dDogdGhpcy53ZGFDb25uZWN0aW9uVGltZW91dCxcbiAgICB9O1xuXG4gICAgdGhpcy5qd3Byb3h5ID0gbmV3IEpXUHJveHkocHJveHlPcHRzKTtcbiAgICB0aGlzLmp3cHJveHkuc2Vzc2lvbklkID0gc2Vzc2lvbklkO1xuICAgIHRoaXMucHJveHlSZXFSZXMgPSB0aGlzLmp3cHJveHkucHJveHlSZXFSZXMuYmluZCh0aGlzLmp3cHJveHkpO1xuXG4gICAgdGhpcy5ub1Nlc3Npb25Qcm94eSA9IG5ldyBOb1Nlc3Npb25Qcm94eShwcm94eU9wdHMpO1xuICAgIHRoaXMubm9TZXNzaW9uUHJveHlSZXFSZXMgPSB0aGlzLm5vU2Vzc2lvblByb3h5LnByb3h5UmVxUmVzLmJpbmQodGhpcy5ub1Nlc3Npb25Qcm94eSk7XG4gIH1cblxuICBhc3luYyBxdWl0ICgpIHtcbiAgICBsb2cuaW5mbygnU2h1dHRpbmcgZG93biBzdWItcHJvY2Vzc2VzJyk7XG5cbiAgICBpZiAodGhpcy5pcHJveHkpIHtcbiAgICAgIGF3YWl0IHRoaXMuaXByb3h5LnF1aXQoKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLnhjb2RlYnVpbGQucXVpdCgpO1xuICAgIGF3YWl0IHRoaXMueGNvZGVidWlsZC5yZXNldCgpO1xuXG4gICAgaWYgKHRoaXMuandwcm94eSkge1xuICAgICAgdGhpcy5qd3Byb3h5LnNlc3Npb25JZCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICBnZXQgdXJsICgpIHtcbiAgICBpZiAoIXRoaXMuX3VybCkge1xuICAgICAgbGV0IHBvcnQgPSB0aGlzLndkYUxvY2FsUG9ydCB8fCBXREFfQUdFTlRfUE9SVDtcbiAgICAgIHRoaXMuX3VybCA9IHVybC5wYXJzZShgJHtXREFfQkFTRV9VUkx9OiR7cG9ydH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3VybDtcbiAgfVxuXG4gIHNldCB1cmwgKF91cmwpIHtcbiAgICB0aGlzLl91cmwgPSB1cmwucGFyc2UoX3VybCk7XG4gIH1cblxuICBnZXQgZnVsbHlTdGFydGVkICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydGVkO1xuICB9XG5cbiAgc2V0IGZ1bGx5U3RhcnRlZCAoc3RhcnRlZCA9IGZhbHNlKSB7XG4gICAgLy8gYmVmb3JlIFdEQSBpcyBzdGFydGVkIHdlIGV4cGVjdCBlcnJvcnMgZnJvbSBpcHJveHksIHNpbmNlIGl0IGlzIG5vdFxuICAgIC8vIGNvbW11bmljYXRpbmcgd2l0aCBhbnl0aGluZyB5ZXRcbiAgICB0aGlzLnN0YXJ0ZWQgPSBzdGFydGVkO1xuICAgIGlmICh0aGlzLmlwcm94eSkge1xuICAgICAgdGhpcy5pcHJveHkuZXhwZWN0SVByb3h5RXJyb3JzID0gIXN0YXJ0ZWQ7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmV0cmlldmVEZXJpdmVkRGF0YVBhdGggKCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLnhjb2RlYnVpbGQucmV0cmlldmVEZXJpdmVkRGF0YVBhdGgoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXZWJEcml2ZXJBZ2VudDtcbmV4cG9ydCB7IFdlYkRyaXZlckFnZW50LCBXREFfQlVORExFX0lELCBCT09UU1RSQVBfUEFUSCB9O1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLi8uLiJ9
