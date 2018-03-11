'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _appiumBaseDriver = require('appium-base-driver');

var _appiumSupport = require('appium-support');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nodeSimctl = require('node-simctl');

var _wdaWebdriveragent = require('./wda/webdriveragent');

var _wdaWebdriveragent2 = _interopRequireDefault(_wdaWebdriveragent);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _simulatorManagement = require('./simulator-management');

var _appiumIosSimulator = require('appium-ios-simulator');

var _asyncbox = require('asyncbox');

var _appiumIosDriver = require('appium-ios-driver');

var _desiredCaps = require('./desired-caps');

var _desiredCaps2 = _interopRequireDefault(_desiredCaps);

var _commandsIndex = require('./commands/index');

var _commandsIndex2 = _interopRequireDefault(_commandsIndex);

var _utils = require('./utils');

var _realDeviceManagement = require('./real-device-management');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _asyncLock = require('async-lock');

var _asyncLock2 = _interopRequireDefault(_asyncLock);

var SAFARI_BUNDLE_ID = 'com.apple.mobilesafari';
var WDA_SIM_STARTUP_RETRIES = 2;
var WDA_REAL_DEV_STARTUP_RETRIES = 1;
var WDA_REAL_DEV_TUTORIAL_URL = 'https://github.com/appium/appium-xcuitest-driver/blob/master/docs/real-device-config.md';
var WDA_STARTUP_RETRY_INTERVAL = 10000;
var DEFAULT_SETTINGS = {
  nativeWebTap: false,
  useJSONSource: false
};
// This lock assures, that each driver session does not
// affect shared resources of the other parallel sessions
var SHARED_RESOURCES_GUARD = new _asyncLock2['default']();

var NO_PROXY_NATIVE_LIST = [['GET', /^\/session\/[^\/]+$/], ['GET', /context/], ['POST', /context/], ['GET', /url/], ['POST', /url/], ['GET', /window/], ['POST', /window/], ['DELETE', /window/], ['POST', /execute/], ['POST', /element$/], ['POST', /elements$/], ['POST', /timeouts/], ['GET', /alert_text/], ['POST', /alert_text/], ['POST', /accept_alert/], ['POST', /dismiss_alert/], ['POST', /alert\/text$/], ['GET', /source/], ['GET', /screenshot/], ['POST', /appium/], ['GET', /appium/], ['POST', /touch/], ['GET', /log/], ['POST', /log/], ['POST', /moveto/], ['POST', /receive_async_response/], // always, in case context switches while waiting
['GET', /location/], ['GET', /attribute/], ['GET', /size/], ['POST', /value/], ['POST', /keys/], ['POST', /back/], ['POST', /session\/[^\/]+\/location/], // geo location, but not element location
['POST', /appium\/device\/lock/], ['POST', /shake/], ['POST', /clear/]];
var NO_PROXY_WEB_LIST = [['GET', /title/], ['POST', /element/], ['POST', /forward/], ['GET', /attribute/], ['GET', /text/], ['POST', /clear/], ['GET', /element/], ['POST', /click/], ['POST', /refresh/], ['GET', /cookie/], ['POST', /cookie/], ['DELETE', /cookie/], ['POST', /frame/], ['POST', /keys/]].concat(NO_PROXY_NATIVE_LIST);

var XCUITestDriver = (function (_BaseDriver) {
  _inherits(XCUITestDriver, _BaseDriver);

  function XCUITestDriver() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var shouldValidateCaps = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, XCUITestDriver);

    _get(Object.getPrototypeOf(XCUITestDriver.prototype), 'constructor', this).call(this, opts, shouldValidateCaps);

    this.desiredCapConstraints = _desiredCaps2['default'];

    this.locatorStrategies = ['xpath', 'id', 'name', 'class name', '-ios predicate string', '-ios class chain', 'accessibility id'];
    this.webLocatorStrategies = ['link text', 'css selector', 'tag name', 'link text', 'partial link text'];
    this.resetIos();
    this.settings = new _appiumBaseDriver.DeviceSettings(DEFAULT_SETTINGS, this.onSettingsUpdate.bind(this));
  }

  _createClass(XCUITestDriver, [{
    key: 'onSettingsUpdate',
    value: function onSettingsUpdate(key, value) {
      return _regeneratorRuntime.async(function onSettingsUpdate$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (key === 'nativeWebTap') {
              this.opts.nativeWebTap = !!value;
            }

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'resetIos',
    value: function resetIos() {
      this.opts = this.opts || {};
      this.wda = null;
      this.opts.device = null;
      this.jwpProxyActive = false;
      this.proxyReqRes = null;
      this.jwpProxyAvoid = [];
      this.safari = false;
      this.cachedWdaStatus = null;

      // some things that commands imported from appium-ios-driver need
      this.curWebFrames = [];
      this.webElementIds = [];
      this._currentUrl = null;
      this.curContext = null;
      this.xcodeVersion = null;
      this.iosSdkVersion = null;
      this.contexts = [];
      this.implicitWaitMs = 0;
      this.asynclibWaitMs = 0;
      this.pageLoadMs = 6000;
      this.landscapeWebCoordsOffset = 0;
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      var status;
      return _regeneratorRuntime.async(function getStatus$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!(typeof this.driverInfo === 'undefined')) {
              context$2$0.next = 4;
              break;
            }

            context$2$0.next = 3;
            return _regeneratorRuntime.awrap((0, _utils.getDriverInfo)());

          case 3:
            this.driverInfo = context$2$0.sent;

          case 4:
            status = { build: { version: this.driverInfo.version } };

            if (this.cachedWdaStatus) {
              status.wda = this.cachedWdaStatus;
            }
            return context$2$0.abrupt('return', status);

          case 7:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'createSession',
    value: function createSession() {
      var _len,
          args,
          _key,
          _ref,
          _ref2,
          sessionId,
          caps,
          args$2$0 = arguments;

      return _regeneratorRuntime.async(function createSession$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            this.lifecycleData = {}; // this is used for keeping track of the state we start so when we delete the session we can put things back
            context$2$0.prev = 1;

            for (_len = args$2$0.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = args$2$0[_key];
            }

            context$2$0.next = 5;
            return _regeneratorRuntime.awrap(_get(Object.getPrototypeOf(XCUITestDriver.prototype), 'createSession', this).apply(this, args));

          case 5:
            _ref = context$2$0.sent;
            _ref2 = _slicedToArray(_ref, 2);
            sessionId = _ref2[0];
            caps = _ref2[1];

            this.opts.sessionId = sessionId;

            context$2$0.next = 12;
            return _regeneratorRuntime.awrap(this.start());

          case 12:

            // merge server capabilities + desired capabilities
            caps = _Object$assign({}, _appiumIosDriver.defaultServerCaps, caps);
            // update the udid with what is actually used
            caps.udid = this.opts.udid;
            // ensure we track nativeWebTap capability as a setting as well

            if (!_lodash2['default'].has(this.opts, 'nativeWebTap')) {
              context$2$0.next = 17;
              break;
            }

            context$2$0.next = 17;
            return _regeneratorRuntime.awrap(this.updateSettings({ nativeWebTap: this.opts.nativeWebTap }));

          case 17:
            if (!_lodash2['default'].has(this.opts, 'useJSONSource')) {
              context$2$0.next = 20;
              break;
            }

            context$2$0.next = 20;
            return _regeneratorRuntime.awrap(this.updateSettings({ useJSONSource: this.opts.useJSONSource }));

          case 20:
            return context$2$0.abrupt('return', [sessionId, caps]);

          case 23:
            context$2$0.prev = 23;
            context$2$0.t0 = context$2$0['catch'](1);

            _logger2['default'].error(context$2$0.t0);
            context$2$0.next = 28;
            return _regeneratorRuntime.awrap(this.deleteSession());

          case 28:
            throw context$2$0.t0;

          case 29:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[1, 23]]);
    }
  }, {
    key: 'start',
    value: function start() {
      var tools, _ref3, device, udid, realDevice, msg, startLogCapture, isLogCaptureStarted;

      return _regeneratorRuntime.async(function start$(context$2$0) {
        var _this = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            this.opts.noReset = !!this.opts.noReset;
            this.opts.fullReset = !!this.opts.fullReset;

            context$2$0.next = 4;
            return _regeneratorRuntime.awrap((0, _utils.printUser)());

          case 4:
            context$2$0.next = 6;
            return _regeneratorRuntime.awrap((0, _utils.printLibimobiledeviceInfo)());

          case 6:
            if (this.xcodeVersion) {
              context$2$0.next = 12;
              break;
            }

            context$2$0.next = 9;
            return _regeneratorRuntime.awrap((0, _utils.getAndCheckXcodeVersion)());

          case 9:
            this.xcodeVersion = context$2$0.sent;
            tools = !this.xcodeVersion.toolsVersion ? '' : '(tools v' + this.xcodeVersion.toolsVersion + ')';

            _logger2['default'].debug('Xcode version set to \'' + this.xcodeVersion.versionString + '\' ' + tools);

          case 12:
            context$2$0.next = 14;
            return _regeneratorRuntime.awrap((0, _utils.getAndCheckIosSdkVersion)());

          case 14:
            this.iosSdkVersion = context$2$0.sent;

            _logger2['default'].debug('iOS SDK Version set to \'' + this.iosSdkVersion + '\'');

            if (!(this.opts.platformVersion && parseFloat(this.opts.platformVersion) < 9.3)) {
              context$2$0.next = 18;
              break;
            }

            throw Error('Platform version must be 9.3 or above. \'' + this.opts.platformVersion + '\' is not supported.');

          case 18:

            this.logEvent('xcodeDetailsRetrieved');

            context$2$0.next = 21;
            return _regeneratorRuntime.awrap(this.determineDevice());

          case 21:
            _ref3 = context$2$0.sent;
            device = _ref3.device;
            udid = _ref3.udid;
            realDevice = _ref3.realDevice;

            _logger2['default'].info('Determining device to run tests on: udid: \'' + udid + '\', real device: ' + realDevice);
            this.opts.device = device;
            this.opts.udid = udid;
            this.opts.realDevice = realDevice;

            if (!(this.isSimulator() && this.opts.customSSLCert)) {
              context$2$0.next = 33;
              break;
            }

            context$2$0.next = 32;
            return _regeneratorRuntime.awrap((0, _appiumIosSimulator.installSSLCert)(this.opts.customSSLCert, this.opts.udid));

          case 32:
            this.logEvent('customCertInstalled');

          case 33:
            if (!(this.opts.enableAsyncExecuteFromHttps && !this.isRealDevice())) {
              context$2$0.next = 40;
              break;
            }

            context$2$0.next = 36;
            return _regeneratorRuntime.awrap((0, _utils.resetXCTestProcesses)(this.opts.udid, true));

          case 36:
            context$2$0.next = 38;
            return _regeneratorRuntime.awrap(this.opts.device.shutdown());

          case 38:
            context$2$0.next = 40;
            return _regeneratorRuntime.awrap(this.startHttpsAsyncServer());

          case 40:
            if (this.opts.platformVersion) {
              context$2$0.next = 48;
              break;
            }

            if (!(this.opts.device && _lodash2['default'].isFunction(this.opts.device.getPlatformVersion))) {
              context$2$0.next = 48;
              break;
            }

            context$2$0.next = 44;
            return _regeneratorRuntime.awrap(this.opts.device.getPlatformVersion());

          case 44:
            this.opts.platformVersion = context$2$0.sent;

            _logger2['default'].info('No platformVersion specified. Using device version: \'' + this.opts.platformVersion + '\'');
            context$2$0.next = 48;
            break;

          case 48:
            // TODO: this is when it is a real device. when we have a real object wire it in

            if (!this.opts.webDriverAgentUrl) {
              // make sure that the xcode we are using can handle the platform
              if (parseFloat(this.opts.platformVersion) > parseFloat(this.iosSdkVersion)) {
                msg = 'Xcode ' + this.xcodeVersion.versionString + ' has a maximum SDK version of ' + this.iosSdkVersion + '. ' + ('It does not support iOS version ' + this.opts.platformVersion);

                _logger2['default'].errorAndThrow(msg);
              }
            } else {
              _logger2['default'].debug('Xcode version will not be validated against iOS SDK version because webDriverAgentUrl capability is set (' + this.opts.webDriverAgentUrl + ').');
            }

            if (!((this.opts.browserName || '').toLowerCase() === 'safari')) {
              context$2$0.next = 59;
              break;
            }

            _logger2['default'].info('Safari test requested');
            this.safari = true;
            this.opts.app = undefined;
            this.opts.processArguments = this.opts.processArguments || {};
            this.opts.bundleId = SAFARI_BUNDLE_ID;
            this._currentUrl = this.opts.safariInitialUrl || (this.isRealDevice() ? 'http://appium.io' : 'http://' + this.opts.address + ':' + this.opts.port + '/welcome');
            this.opts.processArguments.args = ['-u', this._currentUrl];
            context$2$0.next = 61;
            break;

          case 59:
            context$2$0.next = 61;
            return _regeneratorRuntime.awrap(this.configureApp());

          case 61:
            this.logEvent('appConfigured');

            // fail very early if the app doesn't actually exist
            // or if bundle id doesn't point to an installed app

            if (!this.opts.app) {
              context$2$0.next = 65;
              break;
            }

            context$2$0.next = 65;
            return _regeneratorRuntime.awrap((0, _utils.checkAppPresent)(this.opts.app));

          case 65:
            if (this.opts.bundleId) {
              context$2$0.next = 69;
              break;
            }

            context$2$0.next = 68;
            return _regeneratorRuntime.awrap(this.extractBundleId(this.opts.app));

          case 68:
            this.opts.bundleId = context$2$0.sent;

          case 69:
            context$2$0.next = 71;
            return _regeneratorRuntime.awrap(this.runReset());

          case 71:
            startLogCapture = function startLogCapture() {
              var result;
              return _regeneratorRuntime.async(function startLogCapture$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    context$3$0.next = 2;
                    return _regeneratorRuntime.awrap(this.startLogCapture());

                  case 2:
                    result = context$3$0.sent;

                    if (result) {
                      this.logEvent('logCaptureStarted');
                    }
                    return context$3$0.abrupt('return', result);

                  case 5:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this);
            };

            context$2$0.next = 74;
            return _regeneratorRuntime.awrap(startLogCapture());

          case 74:
            isLogCaptureStarted = context$2$0.sent;

            _logger2['default'].info('Setting up ' + (this.isRealDevice() ? 'real device' : 'simulator'));

            if (!this.isSimulator()) {
              context$2$0.next = 90;
              break;
            }

            context$2$0.next = 79;
            return _regeneratorRuntime.awrap(_appiumIosDriver.settings.setLocale(this.opts.device, this.opts, {}, this.isSafari()));

          case 79:
            this.localeConfig = context$2$0.sent;
            context$2$0.next = 82;
            return _regeneratorRuntime.awrap(_appiumIosDriver.settings.setPreferences(this.opts.device, this.opts, this.isSafari()));

          case 82:
            context$2$0.next = 84;
            return _regeneratorRuntime.awrap(this.opts.device.clearCaches('com.apple.mobile.installd.staging'));

          case 84:
            context$2$0.next = 86;
            return _regeneratorRuntime.awrap(this.startSim());

          case 86:
            this.logEvent('simStarted');

            if (isLogCaptureStarted) {
              context$2$0.next = 90;
              break;
            }

            context$2$0.next = 90;
            return _regeneratorRuntime.awrap(startLogCapture());

          case 90:
            if (!this.opts.app) {
              context$2$0.next = 94;
              break;
            }

            context$2$0.next = 93;
            return _regeneratorRuntime.awrap(this.installApp());

          case 93:
            this.logEvent('appInstalled');

          case 94:
            if (!(!this.opts.app && this.opts.bundleId && !this.safari)) {
              context$2$0.next = 99;
              break;
            }

            context$2$0.next = 97;
            return _regeneratorRuntime.awrap(this.opts.device.isAppInstalled(this.opts.bundleId));

          case 97:
            if (context$2$0.sent) {
              context$2$0.next = 99;
              break;
            }

            _logger2['default'].errorAndThrow('App with bundle identifier \'' + this.opts.bundleId + '\' unknown');

          case 99:
            context$2$0.next = 101;
            return _regeneratorRuntime.awrap(SHARED_RESOURCES_GUARD.acquire(XCUITestDriver.name, function callee$2$0() {
              return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    context$3$0.next = 2;
                    return _regeneratorRuntime.awrap(this.startWda(this.opts.sessionId, realDevice));

                  case 2:
                    return context$3$0.abrupt('return', context$3$0.sent);

                  case 3:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this);
            }));

          case 101:
            context$2$0.next = 103;
            return _regeneratorRuntime.awrap(this.setInitialOrientation(this.opts.orientation));

          case 103:
            this.logEvent('orientationSet');

            if (!(this.isRealDevice() && this.opts.startIWDP)) {
              context$2$0.next = 114;
              break;
            }

            context$2$0.prev = 105;
            context$2$0.next = 108;
            return _regeneratorRuntime.awrap(this.startIWDP());

          case 108:
            _logger2['default'].debug('Started ios_webkit_debug proxy server at: ' + this.iwdpServer.endpoint);
            context$2$0.next = 114;
            break;

          case 111:
            context$2$0.prev = 111;
            context$2$0.t0 = context$2$0['catch'](105);

            _logger2['default'].errorAndThrow('Could not start ios_webkit_debug_proxy server: ' + context$2$0.t0.message);

          case 114:
            if (!(this.isSafari() || this.opts.autoWebview)) {
              context$2$0.next = 119;
              break;
            }

            _logger2['default'].debug('Waiting for initial webview');
            context$2$0.next = 118;
            return _regeneratorRuntime.awrap(this.navToInitialWebview());

          case 118:
            this.logEvent('initialWebviewNavigated');

          case 119:
            if (this.isRealDevice()) {
              context$2$0.next = 128;
              break;
            }

            if (!this.opts.calendarAccessAuthorized) {
              context$2$0.next = 125;
              break;
            }

            context$2$0.next = 123;
            return _regeneratorRuntime.awrap(this.opts.device.enableCalendarAccess(this.opts.bundleId));

          case 123:
            context$2$0.next = 128;
            break;

          case 125:
            if (!(this.opts.calendarAccessAuthorized === false)) {
              context$2$0.next = 128;
              break;
            }

            context$2$0.next = 128;
            return _regeneratorRuntime.awrap(this.opts.device.disableCalendarAccess(this.opts.bundleId));

          case 128:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[105, 111]]);
    }
  }, {
    key: 'startWda',
    value: function startWda(sessionId, realDevice) {
      var quitAndUninstall, startupRetries, startupRetryInterval;
      return _regeneratorRuntime.async(function startWda$(context$2$0) {
        var _this2 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            this.wda = new _wdaWebdriveragent2['default'](this.xcodeVersion, this.opts);

            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(this.wda.cleanupObsoleteProcesses());

          case 3:
            if (!this.opts.useNewWDA) {
              context$2$0.next = 12;
              break;
            }

            _logger2['default'].debug('Capability \'useNewWDA\' set to true, so uninstalling WDA before proceeding');
            context$2$0.next = 7;
            return _regeneratorRuntime.awrap(this.wda.quit());

          case 7:
            context$2$0.next = 9;
            return _regeneratorRuntime.awrap(this.wda.uninstall());

          case 9:
            this.logEvent('wdaUninstalled');
            context$2$0.next = 20;
            break;

          case 12:
            context$2$0.t0 = !_appiumSupport.util.hasValue(this.wda.webDriverAgentUrl);

            if (!context$2$0.t0) {
              context$2$0.next = 17;
              break;
            }

            context$2$0.next = 16;
            return _regeneratorRuntime.awrap(this.wda.isRunning());

          case 16:
            context$2$0.t0 = context$2$0.sent;

          case 17:
            if (!context$2$0.t0) {
              context$2$0.next = 20;
              break;
            }

            _logger2['default'].info('Will reuse previously cached WDA instance at \'' + this.wda.url.href + '\'. ' + ('Set the wdaLocalPort capability to a value different from ' + this.wda.url.port + ' ') + 'if this is an undesired behavior.');
            this.wda.webDriverAgentUrl = this.wda.url.href;

          case 20:
            quitAndUninstall = function quitAndUninstall(msg) {
              return _regeneratorRuntime.async(function quitAndUninstall$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    _logger2['default'].debug(msg);
                    _logger2['default'].debug('Quitting and uninstalling WebDriverAgent, then retrying');
                    context$3$0.next = 4;
                    return _regeneratorRuntime.awrap(this.wda.quit());

                  case 4:
                    context$3$0.next = 6;
                    return _regeneratorRuntime.awrap(this.wda.uninstall());

                  case 6:
                    throw new Error(msg);

                  case 7:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this2);
            };

            startupRetries = this.opts.wdaStartupRetries || (this.isRealDevice() ? WDA_REAL_DEV_STARTUP_RETRIES : WDA_SIM_STARTUP_RETRIES);
            startupRetryInterval = this.opts.wdaStartupRetryInterval || WDA_STARTUP_RETRY_INTERVAL;
            context$2$0.next = 25;
            return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(startupRetries, startupRetryInterval, function callee$2$0() {
              var errorMsg;
              return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                var _this3 = this;

                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    this.logEvent('wdaStartAttempted');
                    context$3$0.prev = 1;
                    context$3$0.next = 4;
                    return _regeneratorRuntime.awrap(this.wda.launch(sessionId, realDevice));

                  case 4:
                    this.cachedWdaStatus = context$3$0.sent;
                    context$3$0.next = 14;
                    break;

                  case 7:
                    context$3$0.prev = 7;
                    context$3$0.t0 = context$3$0['catch'](1);

                    this.logEvent('wdaStartFailed');
                    errorMsg = 'Unable to launch WebDriverAgent because of xcodebuild failure: "' + context$3$0.t0.message + '".';

                    if (this.isRealDevice()) {
                      errorMsg += ' Make sure you follow the tutorial at ' + WDA_REAL_DEV_TUTORIAL_URL + '. ' + 'Try to remove the WebDriverAgentRunner application from the device if it is installed ' + 'and reboot the device.';
                    }
                    context$3$0.next = 14;
                    return _regeneratorRuntime.awrap(quitAndUninstall(errorMsg));

                  case 14:

                    this.proxyReqRes = this.wda.proxyReqRes.bind(this.wda);
                    this.jwpProxyActive = true;

                    context$3$0.prev = 16;
                    context$3$0.next = 19;
                    return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(15, 1000, function callee$3$0() {
                      return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                        while (1) switch (context$4$0.prev = context$4$0.next) {
                          case 0:
                            this.logEvent('wdaSessionAttempted');
                            _logger2['default'].debug('Sending createSession command to WDA');
                            context$4$0.prev = 2;
                            context$4$0.t0 = this.cachedWdaStatus;

                            if (context$4$0.t0) {
                              context$4$0.next = 8;
                              break;
                            }

                            context$4$0.next = 7;
                            return _regeneratorRuntime.awrap(this.proxyCommand('/status', 'GET'));

                          case 7:
                            context$4$0.t0 = context$4$0.sent;

                          case 8:
                            this.cachedWdaStatus = context$4$0.t0;
                            context$4$0.next = 11;
                            return _regeneratorRuntime.awrap(this.startWdaSession(this.opts.bundleId, this.opts.processArguments));

                          case 11:
                            context$4$0.next = 17;
                            break;

                          case 13:
                            context$4$0.prev = 13;
                            context$4$0.t1 = context$4$0['catch'](2);

                            _logger2['default'].debug('Failed to create WDA session. Retrying...');
                            throw context$4$0.t1;

                          case 17:
                          case 'end':
                            return context$4$0.stop();
                        }
                      }, null, _this3, [[2, 13]]);
                    }));

                  case 19:
                    this.logEvent('wdaSessionStarted');
                    context$3$0.next = 28;
                    break;

                  case 22:
                    context$3$0.prev = 22;
                    context$3$0.t1 = context$3$0['catch'](16);
                    errorMsg = 'Unable to start WebDriverAgent session because of xcodebuild failure: "' + context$3$0.t1.message + '".';

                    if (this.isRealDevice()) {
                      errorMsg += ' Make sure you follow the tutorial at ' + WDA_REAL_DEV_TUTORIAL_URL + '. ' + 'Try to remove the WebDriverAgentRunner application from the device if it is installed ' + 'and reboot the device.';
                    }
                    context$3$0.next = 28;
                    return _regeneratorRuntime.awrap(quitAndUninstall(errorMsg));

                  case 28:

                    if (!_appiumSupport.util.hasValue(this.opts.preventWDAAttachments)) {
                      // XCTest prior to Xcode 9 SDK has no native way to disable attachments
                      this.opts.preventWDAAttachments = this.xcodeVersion.major < 9;
                      if (this.opts.preventWDAAttachments) {
                        _logger2['default'].info('Enabled WDA attachments prevention by default to save the disk space. ' + 'Set preventWDAAttachments capability to false if this is an undesired behavior.');
                      }
                    }

                    if (!this.opts.preventWDAAttachments) {
                      context$3$0.next = 33;
                      break;
                    }

                    context$3$0.next = 32;
                    return _regeneratorRuntime.awrap((0, _utils.adjustWDAAttachmentsPermissions)(this.wda, this.opts.preventWDAAttachments ? '555' : '755'));

                  case 32:
                    this.logEvent('wdaPermsAdjusted');

                  case 33:
                    if (!this.opts.clearSystemFiles) {
                      context$3$0.next = 36;
                      break;
                    }

                    context$3$0.next = 36;
                    return _regeneratorRuntime.awrap((0, _utils.markSystemFilesForCleanup)(this.wda));

                  case 36:

                    // we expect certain socket errors until this point, but now
                    // mark things as fully working
                    this.wda.fullyStarted = true;
                    this.logEvent('wdaStarted');

                  case 38:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this2, [[1, 7], [16, 22]]);
            }));

          case 25:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }

    // create an alias so we can actually unit test createSession by stubbing
    // this
  }, {
    key: 'extractBundleId',
    value: function extractBundleId(app) {
      return _regeneratorRuntime.async(function extractBundleId$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(_appiumIosDriver.appUtils.extractBundleId(app));

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'runReset',
    value: function runReset() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      return _regeneratorRuntime.async(function runReset$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            this.logEvent('resetStarted');

            if (!this.isRealDevice()) {
              context$2$0.next = 6;
              break;
            }

            context$2$0.next = 4;
            return _regeneratorRuntime.awrap((0, _realDeviceManagement.runRealDeviceReset)(this.opts.device, opts || this.opts));

          case 4:
            context$2$0.next = 8;
            break;

          case 6:
            context$2$0.next = 8;
            return _regeneratorRuntime.awrap((0, _simulatorManagement.runSimulatorReset)(this.opts.device, opts || this.opts));

          case 8:
            this.logEvent('resetComplete');

          case 9:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'deleteSession',
    value: function deleteSession() {
      return _regeneratorRuntime.async(function deleteSession$(context$2$0) {
        var _this4 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(SHARED_RESOURCES_GUARD.acquire(XCUITestDriver.name, function callee$2$0() {
              return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    context$3$0.next = 2;
                    return _regeneratorRuntime.awrap(this.stop());

                  case 2:
                    if (!this.opts.preventWDAAttachments) {
                      context$3$0.next = 5;
                      break;
                    }

                    context$3$0.next = 5;
                    return _regeneratorRuntime.awrap((0, _utils.adjustWDAAttachmentsPermissions)(this.wda, '755'));

                  case 5:
                    if (!this.opts.clearSystemFiles) {
                      context$3$0.next = 10;
                      break;
                    }

                    context$3$0.next = 8;
                    return _regeneratorRuntime.awrap((0, _utils.clearSystemFiles)(this.wda, !!this.opts.showXcodeLog));

                  case 8:
                    context$3$0.next = 11;
                    break;

                  case 10:
                    _logger2['default'].debug('Not clearing log files. Use `clearSystemFiles` capability to turn on.');

                  case 11:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this4);
            }));

          case 2:
            if (!this.isWebContext()) {
              context$2$0.next = 6;
              break;
            }

            _logger2['default'].debug('In a web session. Removing remote debugger');
            context$2$0.next = 6;
            return _regeneratorRuntime.awrap(this.stopRemote());

          case 6:
            if (!(this.opts.resetOnSessionStartOnly === false)) {
              context$2$0.next = 9;
              break;
            }

            context$2$0.next = 9;
            return _regeneratorRuntime.awrap(this.runReset());

          case 9:
            if (!(this.isSimulator() && this.opts.udid && this.opts.customSSLCert)) {
              context$2$0.next = 12;
              break;
            }

            context$2$0.next = 12;
            return _regeneratorRuntime.awrap((0, _appiumIosSimulator.uninstallSSLCert)(this.opts.customSSLCert, this.opts.udid));

          case 12:
            if (!(this.isSimulator() && !this.opts.noReset && !!this.opts.device)) {
              context$2$0.next = 21;
              break;
            }

            if (!this.lifecycleData.createSim) {
              context$2$0.next = 21;
              break;
            }

            context$2$0.next = 16;
            return _regeneratorRuntime.awrap((0, _utils.resetXCTestProcesses)(this.opts.udid, true));

          case 16:
            _logger2['default'].debug('Deleting simulator created for this run (udid: \'' + this.opts.udid + '\')');
            context$2$0.next = 19;
            return _regeneratorRuntime.awrap(this.opts.device.shutdown());

          case 19:
            context$2$0.next = 21;
            return _regeneratorRuntime.awrap(this.opts.device['delete']());

          case 21:

            if (!_lodash2['default'].isEmpty(this.logs)) {
              this.logs.syslog.stopCapture();
              this.logs = {};
            }

            if (this.iwdpServer) {
              this.stopIWDP();
            }

            if (!(this.opts.enableAsyncExecuteFromHttps && !this.isRealDevice())) {
              context$2$0.next = 26;
              break;
            }

            context$2$0.next = 26;
            return _regeneratorRuntime.awrap(this.stopHttpsAsyncServer());

          case 26:

            this.resetIos();

            context$2$0.next = 29;
            return _regeneratorRuntime.awrap(_get(Object.getPrototypeOf(XCUITestDriver.prototype), 'deleteSession', this).call(this));

          case 29:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'stop',
    value: function stop() {
      return _regeneratorRuntime.async(function stop$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            this.jwpProxyActive = false;
            this.proxyReqRes = null;

            if (!(this.wda && this.wda.fullyStarted)) {
              context$2$0.next = 15;
              break;
            }

            if (!this.wda.jwproxy) {
              context$2$0.next = 12;
              break;
            }

            context$2$0.prev = 4;
            context$2$0.next = 7;
            return _regeneratorRuntime.awrap(this.proxyCommand('/session/' + this.sessionId, 'DELETE'));

          case 7:
            context$2$0.next = 12;
            break;

          case 9:
            context$2$0.prev = 9;
            context$2$0.t0 = context$2$0['catch'](4);

            // an error here should not short-circuit the rest of clean up
            _logger2['default'].debug('Unable to DELETE session on WDA: \'' + context$2$0.t0.message + '\'. Continuing shutdown.');

          case 12:
            if (!(this.wda && !this.wda.webDriverAgentUrl && this.opts.useNewWDA)) {
              context$2$0.next = 15;
              break;
            }

            context$2$0.next = 15;
            return _regeneratorRuntime.awrap(this.wda.quit());

          case 15:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[4, 9]]);
    }
  }, {
    key: 'executeCommand',
    value: function executeCommand(cmd) {
      var _get2;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return _regeneratorRuntime.async(function executeCommand$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            _logger2['default'].debug('Executing command \'' + cmd + '\'');

            if (!(cmd === 'receiveAsyncResponse')) {
              context$2$0.next = 5;
              break;
            }

            context$2$0.next = 4;
            return _regeneratorRuntime.awrap(this.receiveAsyncResponse.apply(this, args));

          case 4:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 5:
            if (!(cmd === 'getStatus')) {
              context$2$0.next = 9;
              break;
            }

            context$2$0.next = 8;
            return _regeneratorRuntime.awrap(this.getStatus());

          case 8:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 9:
            context$2$0.next = 11;
            return _regeneratorRuntime.awrap((_get2 = _get(Object.getPrototypeOf(XCUITestDriver.prototype), 'executeCommand', this)).call.apply(_get2, [this, cmd].concat(args)));

          case 11:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 12:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'configureApp',
    value: function configureApp() {
      var appIsPackageOrBundle;
      return _regeneratorRuntime.async(function configureApp$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            appIsPackageOrBundle = function appIsPackageOrBundle(app) {
              return (/^([a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+)+$/.test(app)
              );
            };

            // the app name is a bundleId assign it to the bundleId property
            if (!this.opts.bundleId && appIsPackageOrBundle(this.opts.app)) {
              this.opts.bundleId = this.opts.app;
              this.opts.app = '';
            }
            // we have a bundle ID, but no app, or app is also a bundle

            if (!(this.opts.bundleId && appIsPackageOrBundle(this.opts.bundleId) && (this.opts.app === '' || appIsPackageOrBundle(this.opts.app)))) {
              context$2$0.next = 5;
              break;
            }

            _logger2['default'].debug('App is an iOS bundle, will attempt to run as pre-existing');
            return context$2$0.abrupt('return');

          case 5:
            if (!(this.opts.app && this.opts.app.toLowerCase() === 'settings')) {
              context$2$0.next = 11;
              break;
            }

            this.opts.bundleId = 'com.apple.Preferences';
            this.opts.app = null;
            return context$2$0.abrupt('return');

          case 11:
            if (!(this.opts.app && this.opts.app.toLowerCase() === 'calendar')) {
              context$2$0.next = 15;
              break;
            }

            this.opts.bundleId = 'com.apple.mobilecal';
            this.opts.app = null;
            return context$2$0.abrupt('return');

          case 15:
            context$2$0.prev = 15;
            context$2$0.next = 18;
            return _regeneratorRuntime.awrap(this.helpers.configureApp(this.opts.app, '.app', this.opts.mountRoot, this.opts.windowsShareUserName, this.opts.windowsSharePassword));

          case 18:
            this.opts.app = context$2$0.sent;
            context$2$0.next = 25;
            break;

          case 21:
            context$2$0.prev = 21;
            context$2$0.t0 = context$2$0['catch'](15);

            _logger2['default'].error(context$2$0.t0);
            throw new Error('Bad app: ' + this.opts.app + '. App paths need to be absolute, or relative to the appium ' + 'server install dir, or a URL to compressed file, or a special app name.');

          case 25:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[15, 21]]);
    }
  }, {
    key: 'determineDevice',
    value: function determineDevice() {
      var _device, _device3, devices, _device2, device, _device4;

      return _regeneratorRuntime.async(function determineDevice$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            // in the one case where we create a sim, we will set this state
            this.lifecycleData.createSim = false;

            // if we get generic names, translate them
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap((0, _utils.translateDeviceName)(this.xcodeVersion, this.opts.platformVersion, this.opts.deviceName));

          case 3:
            this.opts.deviceName = context$2$0.sent;
            context$2$0.t0 = this.opts.udid;

            if (!context$2$0.t0) {
              context$2$0.next = 9;
              break;
            }

            context$2$0.next = 8;
            return _regeneratorRuntime.awrap((0, _appiumIosSimulator.simExists)(this.opts.udid));

          case 8:
            context$2$0.t0 = context$2$0.sent;

          case 9:
            if (!context$2$0.t0) {
              context$2$0.next = 14;
              break;
            }

            context$2$0.next = 12;
            return _regeneratorRuntime.awrap((0, _appiumIosSimulator.getSimulator)(this.opts.udid));

          case 12:
            _device = context$2$0.sent;
            return context$2$0.abrupt('return', { device: _device, realDevice: false, udid: this.opts.udid });

          case 14:
            if (!this.opts.udid) {
              context$2$0.next = 43;
              break;
            }

            if (!(this.opts.udid.toLowerCase() === 'auto')) {
              context$2$0.next = 33;
              break;
            }

            context$2$0.prev = 16;
            context$2$0.next = 19;
            return _regeneratorRuntime.awrap((0, _utils.detectUdid)());

          case 19:
            this.opts.udid = context$2$0.sent;
            context$2$0.next = 31;
            break;

          case 22:
            context$2$0.prev = 22;
            context$2$0.t1 = context$2$0['catch'](16);

            // Trying to find matching UDID for Simulator
            _logger2['default'].warn('Cannot detect any connected real devices. Falling back to Simulator. Original error: ' + context$2$0.t1.message);
            context$2$0.next = 27;
            return _regeneratorRuntime.awrap((0, _simulatorManagement.getExistingSim)(this.opts));

          case 27:
            _device3 = context$2$0.sent;

            if (!_device3) {
              // No matching Simulator is found. Throw an error
              _logger2['default'].errorAndThrow('Cannot detect udid for ' + this.opts.deviceName + ' Simulator running iOS ' + this.opts.platformVersion);
            }
            // Matching Simulator exists and is found. Use it
            this.opts.udid = _device3.udid;
            return context$2$0.abrupt('return', { device: _device3, realDevice: false, udid: _device3.udid });

          case 31:
            context$2$0.next = 39;
            break;

          case 33:
            context$2$0.next = 35;
            return _regeneratorRuntime.awrap((0, _realDeviceManagement.getConnectedDevices)());

          case 35:
            devices = context$2$0.sent;

            _logger2['default'].debug('Available devices: ' + devices.join(', '));

            if (!(devices.indexOf(this.opts.udid) === -1)) {
              context$2$0.next = 39;
              break;
            }

            throw new Error('Unknown device or simulator UDID: \'' + this.opts.udid + '\'');

          case 39:
            context$2$0.next = 41;
            return _regeneratorRuntime.awrap((0, _realDeviceManagement.getRealDeviceObj)(this.opts.udid));

          case 41:
            _device2 = context$2$0.sent;
            return context$2$0.abrupt('return', { device: _device2, realDevice: true, udid: this.opts.udid });

          case 43:
            context$2$0.next = 45;
            return _regeneratorRuntime.awrap((0, _simulatorManagement.getExistingSim)(this.opts));

          case 45:
            device = context$2$0.sent;

            if (!device) {
              context$2$0.next = 48;
              break;
            }

            return context$2$0.abrupt('return', { device: device, realDevice: false, udid: device.udid });

          case 48:

            // no device of this type exists, so create one
            _logger2['default'].info('Simulator udid not provided, using desired caps to create a new simulator');
            if (!this.opts.platformVersion) {
              _logger2['default'].info('No platformVersion specified. Using latest version Xcode supports: \'' + this.iosSdkVersion + '\' ' + 'This may cause problems if a simulator does not exist for this platform version.');
              this.opts.platformVersion = this.iosSdkVersion;
            }

            if (!this.opts.noReset) {
              context$2$0.next = 56;
              break;
            }

            context$2$0.next = 53;
            return _regeneratorRuntime.awrap((0, _simulatorManagement.getExistingSim)(this.opts));

          case 53:
            _device4 = context$2$0.sent;

            if (!_device4) {
              context$2$0.next = 56;
              break;
            }

            return context$2$0.abrupt('return', { device: _device4, realDevice: false, udid: _device4.udid });

          case 56:
            context$2$0.next = 58;
            return _regeneratorRuntime.awrap(this.createSim());

          case 58:
            device = context$2$0.sent;
            return context$2$0.abrupt('return', { device: device, realDevice: false, udid: device.udid });

          case 60:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[16, 22]]);
    }
  }, {
    key: 'startSim',
    value: function startSim() {
      var runOpts, orientation;
      return _regeneratorRuntime.async(function startSim$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            runOpts = {
              scaleFactor: this.opts.scaleFactor,
              connectHardwareKeyboard: !!this.opts.connectHardwareKeyboard,
              isHeadless: !!this.opts.isHeadless,
              devicePreferences: {}
            };

            // add the window center, if it is specified
            if (this.opts.SimulatorWindowCenter) {
              runOpts.devicePreferences.SimulatorWindowCenter = this.opts.SimulatorWindowCenter;
            }

            // This is to workaround XCTest bug about changing Simulator
            // orientation is not synchronized to the actual window orientation
            orientation = _lodash2['default'].isString(this.opts.orientation) && this.opts.orientation.toUpperCase();
            context$2$0.t0 = orientation;
            context$2$0.next = context$2$0.t0 === 'LANDSCAPE' ? 6 : context$2$0.t0 === 'PORTRAIT' ? 9 : 12;
            break;

          case 6:
            runOpts.devicePreferences.SimulatorWindowOrientation = 'LandscapeLeft';
            runOpts.devicePreferences.SimulatorWindowRotationAngle = 90;
            return context$2$0.abrupt('break', 12);

          case 9:
            runOpts.devicePreferences.SimulatorWindowOrientation = 'Portrait';
            runOpts.devicePreferences.SimulatorWindowRotationAngle = 0;
            return context$2$0.abrupt('break', 12);

          case 12:
            context$2$0.next = 14;
            return _regeneratorRuntime.awrap(this.opts.device.run(runOpts));

          case 14:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'createSim',
    value: function createSim() {
      var sim;
      return _regeneratorRuntime.async(function createSim$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            this.lifecycleData.createSim = true;

            // create sim for caps
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap((0, _simulatorManagement.createSim)(this.opts, this.sessionId));

          case 3:
            sim = context$2$0.sent;

            _logger2['default'].info('Created simulator with udid \'' + sim.udid + '\'.');

            return context$2$0.abrupt('return', sim);

          case 6:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'launchApp',
    value: function launchApp() {
      var APP_LAUNCH_TIMEOUT, checkStatus, retries;
      return _regeneratorRuntime.async(function launchApp$(context$2$0) {
        var _this5 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            APP_LAUNCH_TIMEOUT = 20 * 1000;

            this.logEvent('appLaunchAttempted');
            context$2$0.next = 4;
            return _regeneratorRuntime.awrap((0, _nodeSimctl.launch)(this.opts.device.udid, this.opts.bundleId));

          case 4:
            checkStatus = function checkStatus() {
              var response, currentApp;
              return _regeneratorRuntime.async(function checkStatus$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    context$3$0.next = 2;
                    return _regeneratorRuntime.awrap(this.proxyCommand('/status', 'GET'));

                  case 2:
                    response = context$3$0.sent;
                    currentApp = response.currentApp.bundleID;

                    if (!(currentApp !== this.opts.bundleId)) {
                      context$3$0.next = 6;
                      break;
                    }

                    throw new Error(this.opts.bundleId + ' not in foreground. ' + currentApp + ' is in foreground');

                  case 6:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this5);
            };

            _logger2['default'].info('Waiting for \'' + this.opts.bundleId + '\' to be in foreground');
            retries = parseInt(APP_LAUNCH_TIMEOUT / 200, 10);
            context$2$0.next = 9;
            return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(retries, 200, checkStatus));

          case 9:
            _logger2['default'].info(this.opts.bundleId + ' is in foreground');
            this.logEvent('appLaunched');

          case 11:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'startWdaSession',
    value: function startWdaSession(bundleId, processArguments) {
      var args, env, shouldWaitForQuiescence, maxTypingFrequency, shouldUseSingletonTestManager, shouldUseTestManagerForVisibilityDetection, desired;
      return _regeneratorRuntime.async(function startWdaSession$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            args = processArguments ? processArguments.args : [];
            env = processArguments ? processArguments.env : {};
            shouldWaitForQuiescence = _appiumSupport.util.hasValue(this.opts.waitForQuiescence) ? this.opts.waitForQuiescence : true;
            maxTypingFrequency = _appiumSupport.util.hasValue(this.opts.maxTypingFrequency) ? this.opts.maxTypingFrequency : 60;
            shouldUseSingletonTestManager = _appiumSupport.util.hasValue(this.opts.shouldUseSingletonTestManager) ? this.opts.shouldUseSingletonTestManager : true;
            shouldUseTestManagerForVisibilityDetection = false;

            if (_appiumSupport.util.hasValue(this.opts.simpleIsVisibleCheck)) {
              shouldUseTestManagerForVisibilityDetection = this.opts.simpleIsVisibleCheck;
            }
            if (!isNaN(parseFloat(this.opts.platformVersion)) && parseFloat(this.opts.platformVersion).toFixed(1) === '9.3') {
              _logger2['default'].info('Forcing shouldUseSingletonTestManager capability value to true, because of known XCTest issues under 9.3 platform version');
              shouldUseTestManagerForVisibilityDetection = true;
            }
            if (_appiumSupport.util.hasValue(this.opts.language)) {
              args.push('-AppleLanguages', '(' + this.opts.language + ')');
              args.push('-NSLanguages', '(' + this.opts.language + ')');
            }

            if (_appiumSupport.util.hasValue(this.opts.locale)) {
              args.push('-AppleLocale', this.opts.locale);
            }

            desired = {
              desiredCapabilities: {
                bundleId: bundleId,
                arguments: args,
                environment: env,
                shouldWaitForQuiescence: shouldWaitForQuiescence,
                shouldUseTestManagerForVisibilityDetection: shouldUseTestManagerForVisibilityDetection,
                maxTypingFrequency: maxTypingFrequency,
                shouldUseSingletonTestManager: shouldUseSingletonTestManager
              }
            };
            context$2$0.next = 13;
            return _regeneratorRuntime.awrap(this.proxyCommand('/session', 'POST', desired));

          case 13:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }

    // Override Proxy methods from BaseDriver
  }, {
    key: 'proxyActive',
    value: function proxyActive() {
      return this.jwpProxyActive;
    }
  }, {
    key: 'getProxyAvoidList',
    value: function getProxyAvoidList() {
      if (this.isWebview()) {
        return NO_PROXY_WEB_LIST;
      }
      return NO_PROXY_NATIVE_LIST;
    }
  }, {
    key: 'canProxy',
    value: function canProxy() {
      return true;
    }
  }, {
    key: 'isSafari',
    value: function isSafari() {
      return !!this.safari;
    }
  }, {
    key: 'isRealDevice',
    value: function isRealDevice() {
      return this.opts.realDevice;
    }
  }, {
    key: 'isSimulator',
    value: function isSimulator() {
      return !this.opts.realDevice;
    }
  }, {
    key: 'isWebview',
    value: function isWebview() {
      return this.isSafari() || this.isWebContext();
    }
  }, {
    key: 'validateLocatorStrategy',
    value: function validateLocatorStrategy(strategy) {
      _get(Object.getPrototypeOf(XCUITestDriver.prototype), 'validateLocatorStrategy', this).call(this, strategy, this.isWebContext());
    }
  }, {
    key: 'validateDesiredCaps',
    value: function validateDesiredCaps(caps) {
      // check with the base class, and return if it fails
      var res = _get(Object.getPrototypeOf(XCUITestDriver.prototype), 'validateDesiredCaps', this).call(this, caps);
      if (!res) {
        return res;
      }

      // make sure that the capabilities have one of `app` or `bundleId`
      if ((caps.browserName || '').toLowerCase() !== 'safari' && !caps.app && !caps.bundleId) {
        var msg = 'The desired capabilities must include either an app or a bundleId for iOS';
        _logger2['default'].errorAndThrow(msg);
      }

      var verifyProcessArgument = function verifyProcessArgument(processArguments) {
        if (!_lodash2['default'].isNil(processArguments.args) && !_lodash2['default'].isArray(processArguments.args)) {
          _logger2['default'].errorAndThrow('processArguments.args must be an array of string');
        }

        if (!_lodash2['default'].isNil(processArguments.env) && !_lodash2['default'].isObject(caps.processArguments.env)) {
          _logger2['default'].errorAndThrow('processArguments.env must be an object <key,value> pair {a:b, c:d}');
        }
      };

      // `processArguments` should be JSON string or an object with arguments and/ environment details
      if (caps.processArguments) {
        if (_lodash2['default'].isString(caps.processArguments)) {
          try {
            // try to parse the string as JSON
            caps.processArguments = JSON.parse(caps.processArguments);
            verifyProcessArgument(caps.processArguments);
          } catch (err) {
            _logger2['default'].errorAndThrow('processArguments must be a json format or an object with format {args : [], env : {a:b, c:d}}. Both environment and argument can be null. Error: ' + err);
          }
        } else if (_lodash2['default'].isObject(caps.processArguments)) {
          verifyProcessArgument(caps.processArguments);
        } else {
          _logger2['default'].errorAndThrow('processArguments must be an object, or a string JSON object with format {args : [], env : {a:b, c:d}}. Both environment and argument can be null.');
        }
      }

      // there is no point in having `keychainPath` without `keychainPassword`
      if (caps.keychainPath && !caps.keychainPassword || !caps.keychainPath && caps.keychainPassword) {
        _logger2['default'].errorAndThrow('If \'keychainPath\' is set, \'keychainPassword\' must also be set (and vice versa).');
      }

      if (caps.autoAcceptAlerts || caps.autoDismissAlerts) {
        _logger2['default'].warn('The capabilities \'autoAcceptAlerts\' and \'autoDismissAlerts\' ' + 'do not work for XCUITest-based tests. Please adjust your ' + 'alert handling accordingly.');
      }

      // `resetOnSessionStartOnly` should be set to true by default
      this.opts.resetOnSessionStartOnly = !_appiumSupport.util.hasValue(this.opts.resetOnSessionStartOnly) || this.opts.resetOnSessionStartOnly;
      this.opts.useNewWDA = _appiumSupport.util.hasValue(this.opts.useNewWDA) ? this.opts.useNewWDA : false;

      // finally, return true since the superclass check passed, as did this
      return true;
    }
  }, {
    key: 'installApp',
    value: function installApp() {
      var pause;
      return _regeneratorRuntime.async(function installApp$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!this.isSafari()) {
              context$2$0.next = 2;
              break;
            }

            return context$2$0.abrupt('return');

          case 2:
            if (!(this.opts.autoLaunch === false)) {
              context$2$0.next = 4;
              break;
            }

            return context$2$0.abrupt('return');

          case 4:
            if (!this.isRealDevice()) {
              context$2$0.next = 9;
              break;
            }

            context$2$0.next = 7;
            return _regeneratorRuntime.awrap((0, _realDeviceManagement.installToRealDevice)(this.opts.device, this.opts.app, this.opts.bundleId, this.opts.noReset));

          case 7:
            context$2$0.next = 11;
            break;

          case 9:
            context$2$0.next = 11;
            return _regeneratorRuntime.awrap((0, _simulatorManagement.installToSimulator)(this.opts.device, this.opts.app, this.opts.bundleId, this.opts.noReset));

          case 11:
            if (!_appiumSupport.util.hasValue(this.opts.iosInstallPause)) {
              context$2$0.next = 16;
              break;
            }

            pause = parseInt(this.opts.iosInstallPause, 10);

            _logger2['default'].debug('iosInstallPause set. Pausing ' + pause + ' ms before continuing');
            context$2$0.next = 16;
            return _regeneratorRuntime.awrap(_bluebird2['default'].delay(pause));

          case 16:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'setInitialOrientation',
    value: function setInitialOrientation(orientation) {
      return _regeneratorRuntime.async(function setInitialOrientation$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (_lodash2['default'].isString(orientation)) {
              context$2$0.next = 3;
              break;
            }

            _logger2['default'].info('Skipping setting of the initial display orientation. ' + 'Set the "orientation" capability to either "LANDSCAPE" or "PORTRAIT", if this is an undesired behavior.');
            return context$2$0.abrupt('return');

          case 3:
            orientation = orientation.toUpperCase();

            if (_lodash2['default'].includes(['LANDSCAPE', 'PORTRAIT'], orientation)) {
              context$2$0.next = 7;
              break;
            }

            _logger2['default'].debug('Unable to set initial orientation to \'' + orientation + '\'');
            return context$2$0.abrupt('return');

          case 7:
            _logger2['default'].debug('Setting initial orientation to \'' + orientation + '\'');
            context$2$0.prev = 8;
            context$2$0.next = 11;
            return _regeneratorRuntime.awrap(this.proxyCommand('/orientation', 'POST', { orientation: orientation }));

          case 11:
            this.opts.curOrientation = orientation;
            context$2$0.next = 17;
            break;

          case 14:
            context$2$0.prev = 14;
            context$2$0.t0 = context$2$0['catch'](8);

            _logger2['default'].warn('Setting initial orientation failed with: ' + context$2$0.t0.message);

          case 17:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[8, 14]]);
    }
  }, {
    key: '_getCommandTimeout',
    value: function _getCommandTimeout(cmdName) {
      this.opts.commandTimeouts = (0, _utils.normalizeCommandTimeouts)(this.opts.commandTimeouts);
      if (this.opts.commandTimeouts) {
        if (cmdName && _lodash2['default'].has(this.opts.commandTimeouts, cmdName)) {
          return this.opts.commandTimeouts[cmdName];
        }
        return this.opts.commandTimeouts[_utils.DEFAULT_TIMEOUT_KEY];
      }
    }

    /**
     * Get session capabilities merged with what WDA reports
     * This is a library command but needs to call 'super' so can't be on
     * a helper object
     */
  }, {
    key: 'getSession',
    value: function getSession() {
      var driverSession, wdaCaps;
      return _regeneratorRuntime.async(function getSession$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(_get(Object.getPrototypeOf(XCUITestDriver.prototype), 'getSession', this).call(this));

          case 2:
            driverSession = context$2$0.sent;
            context$2$0.next = 5;
            return _regeneratorRuntime.awrap(this.proxyCommand('/', 'GET'));

          case 5:
            wdaCaps = context$2$0.sent;

            _logger2['default'].info("Merging WDA caps over Appium caps for session detail response");
            return context$2$0.abrupt('return', _Object$assign({ udid: this.opts.udid }, driverSession, wdaCaps.capabilities));

          case 8:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'startIWDP',
    value: function startIWDP() {
      return _regeneratorRuntime.async(function startIWDP$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            this.logEvent('iwdpStarting');
            this.iwdpServer = new _appiumIosDriver.IWDP(this.opts.webkitDebugProxyPort, this.opts.udid);
            context$2$0.next = 4;
            return _regeneratorRuntime.awrap(this.iwdpServer.start());

          case 4:
            this.logEvent('iwdpStarted');

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'stopIWDP',
    value: function stopIWDP() {
      return _regeneratorRuntime.async(function stopIWDP$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!this.iwdpServer) {
              context$2$0.next = 4;
              break;
            }

            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(this.iwdpServer.stop());

          case 3:
            delete this.iwdpServer;

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'reset',
    value: function reset() {
      var opts, shutdownHandler;
      return _regeneratorRuntime.async(function reset$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!this.opts.noReset) {
              context$2$0.next = 12;
              break;
            }

            opts = _lodash2['default'].cloneDeep(this.opts);

            opts.noReset = false;
            opts.fullReset = false;
            shutdownHandler = this.resetOnUnexpectedShutdown;

            this.resetOnUnexpectedShutdown = function () {};
            context$2$0.prev = 6;
            context$2$0.next = 9;
            return _regeneratorRuntime.awrap(this.runReset(opts));

          case 9:
            context$2$0.prev = 9;

            this.resetOnUnexpectedShutdown = shutdownHandler;
            return context$2$0.finish(9);

          case 12:
            context$2$0.next = 14;
            return _regeneratorRuntime.awrap(_get(Object.getPrototypeOf(XCUITestDriver.prototype), 'reset', this).call(this));

          case 14:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[6,, 9, 12]]);
    }
  }, {
    key: 'driverData',
    get: function get() {
      // TODO fill out resource info here
      return {};
    }
  }]);

  return XCUITestDriver;
})(_appiumBaseDriver.BaseDriver);

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {

  for (var _iterator = _getIterator(_lodash2['default'].toPairs(_commandsIndex2['default'])), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var _step$value = _slicedToArray(_step.value, 2);

    var cmd = _step$value[0];
    var fn = _step$value[1];

    XCUITestDriver.prototype[cmd] = fn;
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator['return']) {
      _iterator['return']();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

exports['default'] = XCUITestDriver;
exports.XCUITestDriver = XCUITestDriver;

// TODO add validation on caps

// ensure we track useJSONSource capability as a setting as well

// shutdown the simulator so that the ssl cert is recognized

// at this point if there is no platformVersion, get it from the device

// Cleanup of installd cache helps to save disk space while running multiple tests
// without restarting the Simulator: https://github.com/appium/appium/issues/9410

// Retry log capture if Simulator was not running before

// if we only have bundle identifier and no app, fail if it is not already installed

// local helper for the two places we need to uninstall wda and re-start it

// reset the permissions on the derived data folder, if necessary

// TODO: once this fix gets into base driver remove from here

// check for supported build-in apps

// download if necessary

// check for a particular simulator

// make sure it is a connected device. If not, the udid passed in is invalid

// figure out the correct simulator to use, given the desired capabilities

// check for an existing simulator

// Check for existing simulator just with correct capabilities

// if user has passed in desiredCaps.autoLaunch = false
// meaning they will manage app install / launching

// https://github.com/appium/appium/issues/6889

// call super to get event timings, etc...

// This is to make sure reset happens even if noReset is set to true
//# sourceMappingURL=data:application/json;charset=utf8;base64,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O2lCQUNULElBQUksQ0FBQyxVQUFVOzs7Ozs7NkNBQ1gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUU7OztBQUM1QixtQkFBTyxJQUFJLENBQUMsVUFBVSxDQUFDOzs7Ozs7O0tBRTFCOzs7V0FFVztVQUdKLElBQUksRUFHRixlQUFlOzs7O2lCQUxuQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87Ozs7O0FBRWYsZ0JBQUksR0FBRyxvQkFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzs7QUFDakMsZ0JBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLGdCQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUNqQiwyQkFBZSxHQUFHLElBQUksQ0FBQyx5QkFBeUI7O0FBQ3RELGdCQUFJLENBQUMseUJBQXlCLEdBQUcsWUFBTSxFQUFFLENBQUM7Ozs2Q0FFbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Ozs7O0FBRXpCLGdCQUFJLENBQUMseUJBQXlCLEdBQUcsZUFBZSxDQUFDOzs7Ozt3RUFyMUJuRCxjQUFjOzs7Ozs7O0tBeTFCakI7OztTQWp5QmMsZUFBRzs7QUFFaEIsYUFBTyxFQUFFLENBQUM7S0FDWDs7O1NBM0RHLGNBQWM7Ozs7Ozs7OztBQTYxQnBCLG9DQUFzQixvQkFBRSxPQUFPLDRCQUFVLDRHQUFFOzs7UUFBakMsR0FBRztRQUFFLEVBQUU7O0FBQ2Ysa0JBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0dBQ3BDOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUdjLGNBQWM7UUFDcEIsY0FBYyxHQUFkLGNBQWMiLCJmaWxlIjoibGliL2RyaXZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2VEcml2ZXIsIERldmljZVNldHRpbmdzIH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcbmltcG9ydCB7IHV0aWwgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgbGF1bmNoIH0gZnJvbSAnbm9kZS1zaW1jdGwnO1xuaW1wb3J0IFdlYkRyaXZlckFnZW50IGZyb20gJy4vd2RhL3dlYmRyaXZlcmFnZW50JztcbmltcG9ydCBsb2cgZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IHsgY3JlYXRlU2ltLCBnZXRFeGlzdGluZ1NpbSwgcnVuU2ltdWxhdG9yUmVzZXQsIGluc3RhbGxUb1NpbXVsYXRvciB9IGZyb20gJy4vc2ltdWxhdG9yLW1hbmFnZW1lbnQnO1xuaW1wb3J0IHsgc2ltRXhpc3RzLCBnZXRTaW11bGF0b3IsIGluc3RhbGxTU0xDZXJ0LCB1bmluc3RhbGxTU0xDZXJ0IH0gZnJvbSAnYXBwaXVtLWlvcy1zaW11bGF0b3InO1xuaW1wb3J0IHsgcmV0cnlJbnRlcnZhbCB9IGZyb20gJ2FzeW5jYm94JztcbmltcG9ydCB7IHNldHRpbmdzIGFzIGlvc1NldHRpbmdzLCBkZWZhdWx0U2VydmVyQ2FwcywgYXBwVXRpbHMsIElXRFAgfSBmcm9tICdhcHBpdW0taW9zLWRyaXZlcic7XG5pbXBvcnQgZGVzaXJlZENhcENvbnN0cmFpbnRzIGZyb20gJy4vZGVzaXJlZC1jYXBzJztcbmltcG9ydCBjb21tYW5kcyBmcm9tICcuL2NvbW1hbmRzL2luZGV4JztcbmltcG9ydCB7IGRldGVjdFVkaWQsIGdldEFuZENoZWNrWGNvZGVWZXJzaW9uLCBnZXRBbmRDaGVja0lvc1Nka1ZlcnNpb24sXG4gICAgICAgICBhZGp1c3RXREFBdHRhY2htZW50c1Blcm1pc3Npb25zLCBjaGVja0FwcFByZXNlbnQsIGdldERyaXZlckluZm8sXG4gICAgICAgICBjbGVhclN5c3RlbUZpbGVzLCB0cmFuc2xhdGVEZXZpY2VOYW1lLCBub3JtYWxpemVDb21tYW5kVGltZW91dHMsXG4gICAgICAgICBERUZBVUxUX1RJTUVPVVRfS0VZLCByZXNldFhDVGVzdFByb2Nlc3NlcywgbWFya1N5c3RlbUZpbGVzRm9yQ2xlYW51cCxcbiAgICAgICAgIHByaW50VXNlciwgcHJpbnRMaWJpbW9iaWxlZGV2aWNlSW5mbyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgZ2V0Q29ubmVjdGVkRGV2aWNlcywgcnVuUmVhbERldmljZVJlc2V0LCBpbnN0YWxsVG9SZWFsRGV2aWNlLFxuICAgICAgICAgZ2V0UmVhbERldmljZU9iaiB9IGZyb20gJy4vcmVhbC1kZXZpY2UtbWFuYWdlbWVudCc7XG5pbXBvcnQgQiBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgQXN5bmNMb2NrIGZyb20gJ2FzeW5jLWxvY2snO1xuXG5cbmNvbnN0IFNBRkFSSV9CVU5ETEVfSUQgPSAnY29tLmFwcGxlLm1vYmlsZXNhZmFyaSc7XG5jb25zdCBXREFfU0lNX1NUQVJUVVBfUkVUUklFUyA9IDI7XG5jb25zdCBXREFfUkVBTF9ERVZfU1RBUlRVUF9SRVRSSUVTID0gMTtcbmNvbnN0IFdEQV9SRUFMX0RFVl9UVVRPUklBTF9VUkwgPSAnaHR0cHM6Ly9naXRodWIuY29tL2FwcGl1bS9hcHBpdW0teGN1aXRlc3QtZHJpdmVyL2Jsb2IvbWFzdGVyL2RvY3MvcmVhbC1kZXZpY2UtY29uZmlnLm1kJztcbmNvbnN0IFdEQV9TVEFSVFVQX1JFVFJZX0lOVEVSVkFMID0gMTAwMDA7XG5jb25zdCBERUZBVUxUX1NFVFRJTkdTID0ge1xuICBuYXRpdmVXZWJUYXA6IGZhbHNlLFxuICB1c2VKU09OU291cmNlOiBmYWxzZSxcbn07XG4vLyBUaGlzIGxvY2sgYXNzdXJlcywgdGhhdCBlYWNoIGRyaXZlciBzZXNzaW9uIGRvZXMgbm90XG4vLyBhZmZlY3Qgc2hhcmVkIHJlc291cmNlcyBvZiB0aGUgb3RoZXIgcGFyYWxsZWwgc2Vzc2lvbnNcbmNvbnN0IFNIQVJFRF9SRVNPVVJDRVNfR1VBUkQgPSBuZXcgQXN5bmNMb2NrKCk7XG5cblxuY29uc3QgTk9fUFJPWFlfTkFUSVZFX0xJU1QgPSBbXG4gIFsnR0VUJywgL15cXC9zZXNzaW9uXFwvW15cXC9dKyQvXSxcbiAgWydHRVQnLCAvY29udGV4dC9dLFxuICBbJ1BPU1QnLCAvY29udGV4dC9dLFxuICBbJ0dFVCcsIC91cmwvXSxcbiAgWydQT1NUJywgL3VybC9dLFxuICBbJ0dFVCcsIC93aW5kb3cvXSxcbiAgWydQT1NUJywgL3dpbmRvdy9dLFxuICBbJ0RFTEVURScsIC93aW5kb3cvXSxcbiAgWydQT1NUJywgL2V4ZWN1dGUvXSxcbiAgWydQT1NUJywgL2VsZW1lbnQkL10sXG4gIFsnUE9TVCcsIC9lbGVtZW50cyQvXSxcbiAgWydQT1NUJywgL3RpbWVvdXRzL10sXG4gIFsnR0VUJywgL2FsZXJ0X3RleHQvXSxcbiAgWydQT1NUJywgL2FsZXJ0X3RleHQvXSxcbiAgWydQT1NUJywgL2FjY2VwdF9hbGVydC9dLFxuICBbJ1BPU1QnLCAvZGlzbWlzc19hbGVydC9dLFxuICBbJ1BPU1QnLCAvYWxlcnRcXC90ZXh0JC9dLFxuICBbJ0dFVCcsIC9zb3VyY2UvXSxcbiAgWydHRVQnLCAvc2NyZWVuc2hvdC9dLFxuICBbJ1BPU1QnLCAvYXBwaXVtL10sXG4gIFsnR0VUJywgL2FwcGl1bS9dLFxuICBbJ1BPU1QnLCAvdG91Y2gvXSxcbiAgWydHRVQnLCAvbG9nL10sXG4gIFsnUE9TVCcsIC9sb2cvXSxcbiAgWydQT1NUJywgL21vdmV0by9dLFxuICBbJ1BPU1QnLCAvcmVjZWl2ZV9hc3luY19yZXNwb25zZS9dLCAvLyBhbHdheXMsIGluIGNhc2UgY29udGV4dCBzd2l0Y2hlcyB3aGlsZSB3YWl0aW5nXG4gIFsnR0VUJywgL2xvY2F0aW9uL10sXG4gIFsnR0VUJywgL2F0dHJpYnV0ZS9dLFxuICBbJ0dFVCcsIC9zaXplL10sXG4gIFsnUE9TVCcsIC92YWx1ZS9dLFxuICBbJ1BPU1QnLCAva2V5cy9dLFxuICBbJ1BPU1QnLCAvYmFjay9dLFxuICBbJ1BPU1QnLCAvc2Vzc2lvblxcL1teXFwvXStcXC9sb2NhdGlvbi9dLCAvLyBnZW8gbG9jYXRpb24sIGJ1dCBub3QgZWxlbWVudCBsb2NhdGlvblxuICBbJ1BPU1QnLCAvYXBwaXVtXFwvZGV2aWNlXFwvbG9jay9dLFxuICBbJ1BPU1QnLCAvc2hha2UvXSxcbiAgWydQT1NUJywgL2NsZWFyL10sXG5dO1xuY29uc3QgTk9fUFJPWFlfV0VCX0xJU1QgPSBbXG4gIFsnR0VUJywgL3RpdGxlL10sXG4gIFsnUE9TVCcsIC9lbGVtZW50L10sXG4gIFsnUE9TVCcsIC9mb3J3YXJkL10sXG4gIFsnR0VUJywgL2F0dHJpYnV0ZS9dLFxuICBbJ0dFVCcsIC90ZXh0L10sXG4gIFsnUE9TVCcsIC9jbGVhci9dLFxuICBbJ0dFVCcsIC9lbGVtZW50L10sXG4gIFsnUE9TVCcsIC9jbGljay9dLFxuICBbJ1BPU1QnLCAvcmVmcmVzaC9dLFxuICBbJ0dFVCcsIC9jb29raWUvXSxcbiAgWydQT1NUJywgL2Nvb2tpZS9dLFxuICBbJ0RFTEVURScsIC9jb29raWUvXSxcbiAgWydQT1NUJywgL2ZyYW1lL10sXG4gIFsnUE9TVCcsIC9rZXlzL10sXG5dLmNvbmNhdChOT19QUk9YWV9OQVRJVkVfTElTVCk7XG5cbmNsYXNzIFhDVUlUZXN0RHJpdmVyIGV4dGVuZHMgQmFzZURyaXZlciB7XG4gIGNvbnN0cnVjdG9yIChvcHRzID0ge30sIHNob3VsZFZhbGlkYXRlQ2FwcyA9IHRydWUpIHtcbiAgICBzdXBlcihvcHRzLCBzaG91bGRWYWxpZGF0ZUNhcHMpO1xuXG4gICAgdGhpcy5kZXNpcmVkQ2FwQ29uc3RyYWludHMgPSBkZXNpcmVkQ2FwQ29uc3RyYWludHM7XG5cbiAgICB0aGlzLmxvY2F0b3JTdHJhdGVnaWVzID0gW1xuICAgICAgJ3hwYXRoJyxcbiAgICAgICdpZCcsXG4gICAgICAnbmFtZScsXG4gICAgICAnY2xhc3MgbmFtZScsXG4gICAgICAnLWlvcyBwcmVkaWNhdGUgc3RyaW5nJyxcbiAgICAgICctaW9zIGNsYXNzIGNoYWluJyxcbiAgICAgICdhY2Nlc3NpYmlsaXR5IGlkJ1xuICAgIF07XG4gICAgdGhpcy53ZWJMb2NhdG9yU3RyYXRlZ2llcyA9IFtcbiAgICAgICdsaW5rIHRleHQnLFxuICAgICAgJ2NzcyBzZWxlY3RvcicsXG4gICAgICAndGFnIG5hbWUnLFxuICAgICAgJ2xpbmsgdGV4dCcsXG4gICAgICAncGFydGlhbCBsaW5rIHRleHQnXG4gICAgXTtcbiAgICB0aGlzLnJlc2V0SW9zKCk7XG4gICAgdGhpcy5zZXR0aW5ncyA9IG5ldyBEZXZpY2VTZXR0aW5ncyhERUZBVUxUX1NFVFRJTkdTLCB0aGlzLm9uU2V0dGluZ3NVcGRhdGUuYmluZCh0aGlzKSk7XG4gIH1cblxuICBhc3luYyBvblNldHRpbmdzVXBkYXRlIChrZXksIHZhbHVlKSB7XG4gICAgaWYgKGtleSA9PT0gJ25hdGl2ZVdlYlRhcCcpIHtcbiAgICAgIHRoaXMub3B0cy5uYXRpdmVXZWJUYXAgPSAhIXZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0SW9zICgpIHtcbiAgICB0aGlzLm9wdHMgPSB0aGlzLm9wdHMgfHwge307XG4gICAgdGhpcy53ZGEgPSBudWxsO1xuICAgIHRoaXMub3B0cy5kZXZpY2UgPSBudWxsO1xuICAgIHRoaXMuandwUHJveHlBY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLnByb3h5UmVxUmVzID0gbnVsbDtcbiAgICB0aGlzLmp3cFByb3h5QXZvaWQgPSBbXTtcbiAgICB0aGlzLnNhZmFyaSA9IGZhbHNlO1xuICAgIHRoaXMuY2FjaGVkV2RhU3RhdHVzID0gbnVsbDtcblxuICAgIC8vIHNvbWUgdGhpbmdzIHRoYXQgY29tbWFuZHMgaW1wb3J0ZWQgZnJvbSBhcHBpdW0taW9zLWRyaXZlciBuZWVkXG4gICAgdGhpcy5jdXJXZWJGcmFtZXMgPSBbXTtcbiAgICB0aGlzLndlYkVsZW1lbnRJZHMgPSBbXTtcbiAgICB0aGlzLl9jdXJyZW50VXJsID0gbnVsbDtcbiAgICB0aGlzLmN1ckNvbnRleHQgPSBudWxsO1xuICAgIHRoaXMueGNvZGVWZXJzaW9uID0gbnVsbDtcbiAgICB0aGlzLmlvc1Nka1ZlcnNpb24gPSBudWxsO1xuICAgIHRoaXMuY29udGV4dHMgPSBbXTtcbiAgICB0aGlzLmltcGxpY2l0V2FpdE1zID0gMDtcbiAgICB0aGlzLmFzeW5jbGliV2FpdE1zID0gMDtcbiAgICB0aGlzLnBhZ2VMb2FkTXMgPSA2MDAwO1xuICAgIHRoaXMubGFuZHNjYXBlV2ViQ29vcmRzT2Zmc2V0ID0gMDtcbiAgfVxuXG4gIGdldCBkcml2ZXJEYXRhICgpIHtcbiAgICAvLyBUT0RPIGZpbGwgb3V0IHJlc291cmNlIGluZm8gaGVyZVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGFzeW5jIGdldFN0YXR1cyAoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmRyaXZlckluZm8gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLmRyaXZlckluZm8gPSBhd2FpdCBnZXREcml2ZXJJbmZvKCk7XG4gICAgfVxuICAgIGxldCBzdGF0dXMgPSB7YnVpbGQ6IHt2ZXJzaW9uOiB0aGlzLmRyaXZlckluZm8udmVyc2lvbn19O1xuICAgIGlmICh0aGlzLmNhY2hlZFdkYVN0YXR1cykge1xuICAgICAgc3RhdHVzLndkYSA9IHRoaXMuY2FjaGVkV2RhU3RhdHVzO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdHVzO1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlU2Vzc2lvbiAoLi4uYXJncykge1xuICAgIHRoaXMubGlmZWN5Y2xlRGF0YSA9IHt9OyAvLyB0aGlzIGlzIHVzZWQgZm9yIGtlZXBpbmcgdHJhY2sgb2YgdGhlIHN0YXRlIHdlIHN0YXJ0IHNvIHdoZW4gd2UgZGVsZXRlIHRoZSBzZXNzaW9uIHdlIGNhbiBwdXQgdGhpbmdzIGJhY2tcbiAgICB0cnkge1xuICAgICAgLy8gVE9ETyBhZGQgdmFsaWRhdGlvbiBvbiBjYXBzXG4gICAgICBsZXQgW3Nlc3Npb25JZCwgY2Fwc10gPSBhd2FpdCBzdXBlci5jcmVhdGVTZXNzaW9uKC4uLmFyZ3MpO1xuICAgICAgdGhpcy5vcHRzLnNlc3Npb25JZCA9IHNlc3Npb25JZDtcblxuICAgICAgYXdhaXQgdGhpcy5zdGFydCgpO1xuXG4gICAgICAvLyBtZXJnZSBzZXJ2ZXIgY2FwYWJpbGl0aWVzICsgZGVzaXJlZCBjYXBhYmlsaXRpZXNcbiAgICAgIGNhcHMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0U2VydmVyQ2FwcywgY2Fwcyk7XG4gICAgICAvLyB1cGRhdGUgdGhlIHVkaWQgd2l0aCB3aGF0IGlzIGFjdHVhbGx5IHVzZWRcbiAgICAgIGNhcHMudWRpZCA9IHRoaXMub3B0cy51ZGlkO1xuICAgICAgLy8gZW5zdXJlIHdlIHRyYWNrIG5hdGl2ZVdlYlRhcCBjYXBhYmlsaXR5IGFzIGEgc2V0dGluZyBhcyB3ZWxsXG4gICAgICBpZiAoXy5oYXModGhpcy5vcHRzLCAnbmF0aXZlV2ViVGFwJykpIHtcbiAgICAgICAgYXdhaXQgdGhpcy51cGRhdGVTZXR0aW5ncyh7bmF0aXZlV2ViVGFwOiB0aGlzLm9wdHMubmF0aXZlV2ViVGFwfSk7XG4gICAgICB9XG4gICAgICAvLyBlbnN1cmUgd2UgdHJhY2sgdXNlSlNPTlNvdXJjZSBjYXBhYmlsaXR5IGFzIGEgc2V0dGluZyBhcyB3ZWxsXG4gICAgICBpZiAoXy5oYXModGhpcy5vcHRzLCAndXNlSlNPTlNvdXJjZScpKSB7XG4gICAgICAgIGF3YWl0IHRoaXMudXBkYXRlU2V0dGluZ3Moe3VzZUpTT05Tb3VyY2U6IHRoaXMub3B0cy51c2VKU09OU291cmNlfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW3Nlc3Npb25JZCwgY2Fwc107XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nLmVycm9yKGUpO1xuICAgICAgYXdhaXQgdGhpcy5kZWxldGVTZXNzaW9uKCk7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHN0YXJ0ICgpIHtcbiAgICB0aGlzLm9wdHMubm9SZXNldCA9ICEhdGhpcy5vcHRzLm5vUmVzZXQ7XG4gICAgdGhpcy5vcHRzLmZ1bGxSZXNldCA9ICEhdGhpcy5vcHRzLmZ1bGxSZXNldDtcblxuICAgIGF3YWl0IHByaW50VXNlcigpO1xuICAgIGF3YWl0IHByaW50TGliaW1vYmlsZWRldmljZUluZm8oKTtcblxuICAgIGlmICghdGhpcy54Y29kZVZlcnNpb24pIHtcbiAgICAgIHRoaXMueGNvZGVWZXJzaW9uID0gYXdhaXQgZ2V0QW5kQ2hlY2tYY29kZVZlcnNpb24oKTtcbiAgICAgIGxldCB0b29scyA9ICF0aGlzLnhjb2RlVmVyc2lvbi50b29sc1ZlcnNpb24gPyAnJyA6IGAodG9vbHMgdiR7dGhpcy54Y29kZVZlcnNpb24udG9vbHNWZXJzaW9ufSlgO1xuICAgICAgbG9nLmRlYnVnKGBYY29kZSB2ZXJzaW9uIHNldCB0byAnJHt0aGlzLnhjb2RlVmVyc2lvbi52ZXJzaW9uU3RyaW5nfScgJHt0b29sc31gKTtcbiAgICB9XG5cbiAgICB0aGlzLmlvc1Nka1ZlcnNpb24gPSBhd2FpdCBnZXRBbmRDaGVja0lvc1Nka1ZlcnNpb24oKTtcbiAgICBsb2cuZGVidWcoYGlPUyBTREsgVmVyc2lvbiBzZXQgdG8gJyR7dGhpcy5pb3NTZGtWZXJzaW9ufSdgKTtcblxuICAgIGlmICh0aGlzLm9wdHMucGxhdGZvcm1WZXJzaW9uICYmIHBhcnNlRmxvYXQodGhpcy5vcHRzLnBsYXRmb3JtVmVyc2lvbikgPCA5LjMpIHtcbiAgICAgIHRocm93IEVycm9yKGBQbGF0Zm9ybSB2ZXJzaW9uIG11c3QgYmUgOS4zIG9yIGFib3ZlLiAnJHt0aGlzLm9wdHMucGxhdGZvcm1WZXJzaW9ufScgaXMgbm90IHN1cHBvcnRlZC5gKTtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ0V2ZW50KCd4Y29kZURldGFpbHNSZXRyaWV2ZWQnKTtcblxuICAgIGxldCB7ZGV2aWNlLCB1ZGlkLCByZWFsRGV2aWNlfSA9IGF3YWl0IHRoaXMuZGV0ZXJtaW5lRGV2aWNlKCk7XG4gICAgbG9nLmluZm8oYERldGVybWluaW5nIGRldmljZSB0byBydW4gdGVzdHMgb246IHVkaWQ6ICcke3VkaWR9JywgcmVhbCBkZXZpY2U6ICR7cmVhbERldmljZX1gKTtcbiAgICB0aGlzLm9wdHMuZGV2aWNlID0gZGV2aWNlO1xuICAgIHRoaXMub3B0cy51ZGlkID0gdWRpZDtcbiAgICB0aGlzLm9wdHMucmVhbERldmljZSA9IHJlYWxEZXZpY2U7XG5cbiAgICBpZiAodGhpcy5pc1NpbXVsYXRvcigpICYmIHRoaXMub3B0cy5jdXN0b21TU0xDZXJ0KSB7XG4gICAgICBhd2FpdCBpbnN0YWxsU1NMQ2VydCh0aGlzLm9wdHMuY3VzdG9tU1NMQ2VydCwgdGhpcy5vcHRzLnVkaWQpO1xuICAgICAgdGhpcy5sb2dFdmVudCgnY3VzdG9tQ2VydEluc3RhbGxlZCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdHMuZW5hYmxlQXN5bmNFeGVjdXRlRnJvbUh0dHBzICYmICF0aGlzLmlzUmVhbERldmljZSgpKSB7XG4gICAgICBhd2FpdCByZXNldFhDVGVzdFByb2Nlc3Nlcyh0aGlzLm9wdHMudWRpZCwgdHJ1ZSk7XG4gICAgICAvLyBzaHV0ZG93biB0aGUgc2ltdWxhdG9yIHNvIHRoYXQgdGhlIHNzbCBjZXJ0IGlzIHJlY29nbml6ZWRcbiAgICAgIGF3YWl0IHRoaXMub3B0cy5kZXZpY2Uuc2h1dGRvd24oKTtcbiAgICAgIGF3YWl0IHRoaXMuc3RhcnRIdHRwc0FzeW5jU2VydmVyKCk7XG4gICAgfVxuXG4gICAgLy8gYXQgdGhpcyBwb2ludCBpZiB0aGVyZSBpcyBubyBwbGF0Zm9ybVZlcnNpb24sIGdldCBpdCBmcm9tIHRoZSBkZXZpY2VcbiAgICBpZiAoIXRoaXMub3B0cy5wbGF0Zm9ybVZlcnNpb24pIHtcbiAgICAgIGlmICh0aGlzLm9wdHMuZGV2aWNlICYmIF8uaXNGdW5jdGlvbih0aGlzLm9wdHMuZGV2aWNlLmdldFBsYXRmb3JtVmVyc2lvbikpIHtcbiAgICAgICAgdGhpcy5vcHRzLnBsYXRmb3JtVmVyc2lvbiA9IGF3YWl0IHRoaXMub3B0cy5kZXZpY2UuZ2V0UGxhdGZvcm1WZXJzaW9uKCk7XG4gICAgICAgIGxvZy5pbmZvKGBObyBwbGF0Zm9ybVZlcnNpb24gc3BlY2lmaWVkLiBVc2luZyBkZXZpY2UgdmVyc2lvbjogJyR7dGhpcy5vcHRzLnBsYXRmb3JtVmVyc2lvbn0nYCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiB0aGlzIGlzIHdoZW4gaXQgaXMgYSByZWFsIGRldmljZS4gd2hlbiB3ZSBoYXZlIGEgcmVhbCBvYmplY3Qgd2lyZSBpdCBpblxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5vcHRzLndlYkRyaXZlckFnZW50VXJsKSB7XG4gICAgICAvLyBtYWtlIHN1cmUgdGhhdCB0aGUgeGNvZGUgd2UgYXJlIHVzaW5nIGNhbiBoYW5kbGUgdGhlIHBsYXRmb3JtXG4gICAgICBpZiAocGFyc2VGbG9hdCh0aGlzLm9wdHMucGxhdGZvcm1WZXJzaW9uKSA+IHBhcnNlRmxvYXQodGhpcy5pb3NTZGtWZXJzaW9uKSkge1xuICAgICAgICBsZXQgbXNnID0gYFhjb2RlICR7dGhpcy54Y29kZVZlcnNpb24udmVyc2lvblN0cmluZ30gaGFzIGEgbWF4aW11bSBTREsgdmVyc2lvbiBvZiAke3RoaXMuaW9zU2RrVmVyc2lvbn0uIGAgK1xuICAgICAgICAgICAgICAgICAgYEl0IGRvZXMgbm90IHN1cHBvcnQgaU9TIHZlcnNpb24gJHt0aGlzLm9wdHMucGxhdGZvcm1WZXJzaW9ufWA7XG4gICAgICAgIGxvZy5lcnJvckFuZFRocm93KG1zZyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy5kZWJ1ZyhgWGNvZGUgdmVyc2lvbiB3aWxsIG5vdCBiZSB2YWxpZGF0ZWQgYWdhaW5zdCBpT1MgU0RLIHZlcnNpb24gYmVjYXVzZSB3ZWJEcml2ZXJBZ2VudFVybCBjYXBhYmlsaXR5IGlzIHNldCAoJHt0aGlzLm9wdHMud2ViRHJpdmVyQWdlbnRVcmx9KS5gKTtcbiAgICB9XG5cbiAgICBpZiAoKHRoaXMub3B0cy5icm93c2VyTmFtZSB8fCAnJykudG9Mb3dlckNhc2UoKSA9PT0gJ3NhZmFyaScpIHtcbiAgICAgIGxvZy5pbmZvKCdTYWZhcmkgdGVzdCByZXF1ZXN0ZWQnKTtcbiAgICAgIHRoaXMuc2FmYXJpID0gdHJ1ZTtcbiAgICAgIHRoaXMub3B0cy5hcHAgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLm9wdHMucHJvY2Vzc0FyZ3VtZW50cyA9IHRoaXMub3B0cy5wcm9jZXNzQXJndW1lbnRzIHx8IHt9O1xuICAgICAgdGhpcy5vcHRzLmJ1bmRsZUlkID0gU0FGQVJJX0JVTkRMRV9JRDtcbiAgICAgIHRoaXMuX2N1cnJlbnRVcmwgPSB0aGlzLm9wdHMuc2FmYXJpSW5pdGlhbFVybCB8fCAoXG4gICAgICAgIHRoaXMuaXNSZWFsRGV2aWNlKCkgP1xuICAgICAgICAnaHR0cDovL2FwcGl1bS5pbycgOlxuICAgICAgICBgaHR0cDovLyR7dGhpcy5vcHRzLmFkZHJlc3N9OiR7dGhpcy5vcHRzLnBvcnR9L3dlbGNvbWVgXG4gICAgICApO1xuICAgICAgdGhpcy5vcHRzLnByb2Nlc3NBcmd1bWVudHMuYXJncyA9IFsnLXUnLCB0aGlzLl9jdXJyZW50VXJsXTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5jb25maWd1cmVBcHAoKTtcbiAgICB9XG4gICAgdGhpcy5sb2dFdmVudCgnYXBwQ29uZmlndXJlZCcpO1xuXG4gICAgLy8gZmFpbCB2ZXJ5IGVhcmx5IGlmIHRoZSBhcHAgZG9lc24ndCBhY3R1YWxseSBleGlzdFxuICAgIC8vIG9yIGlmIGJ1bmRsZSBpZCBkb2Vzbid0IHBvaW50IHRvIGFuIGluc3RhbGxlZCBhcHBcbiAgICBpZiAodGhpcy5vcHRzLmFwcCkge1xuICAgICAgYXdhaXQgY2hlY2tBcHBQcmVzZW50KHRoaXMub3B0cy5hcHApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5vcHRzLmJ1bmRsZUlkKSB7XG4gICAgICB0aGlzLm9wdHMuYnVuZGxlSWQgPSBhd2FpdCB0aGlzLmV4dHJhY3RCdW5kbGVJZCh0aGlzLm9wdHMuYXBwKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLnJ1blJlc2V0KCk7XG5cbiAgICBjb25zdCBzdGFydExvZ0NhcHR1cmUgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnN0YXJ0TG9nQ2FwdHVyZSgpO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICB0aGlzLmxvZ0V2ZW50KCdsb2dDYXB0dXJlU3RhcnRlZCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIGNvbnN0IGlzTG9nQ2FwdHVyZVN0YXJ0ZWQgPSBhd2FpdCBzdGFydExvZ0NhcHR1cmUoKTtcblxuICAgIGxvZy5pbmZvKGBTZXR0aW5nIHVwICR7dGhpcy5pc1JlYWxEZXZpY2UoKSA/ICdyZWFsIGRldmljZScgOiAnc2ltdWxhdG9yJ31gKTtcblxuICAgIGlmICh0aGlzLmlzU2ltdWxhdG9yKCkpIHtcbiAgICAgIHRoaXMubG9jYWxlQ29uZmlnID0gYXdhaXQgaW9zU2V0dGluZ3Muc2V0TG9jYWxlKHRoaXMub3B0cy5kZXZpY2UsIHRoaXMub3B0cywge30sIHRoaXMuaXNTYWZhcmkoKSk7XG4gICAgICBhd2FpdCBpb3NTZXR0aW5ncy5zZXRQcmVmZXJlbmNlcyh0aGlzLm9wdHMuZGV2aWNlLCB0aGlzLm9wdHMsIHRoaXMuaXNTYWZhcmkoKSk7XG4gICAgICAvLyBDbGVhbnVwIG9mIGluc3RhbGxkIGNhY2hlIGhlbHBzIHRvIHNhdmUgZGlzayBzcGFjZSB3aGlsZSBydW5uaW5nIG11bHRpcGxlIHRlc3RzXG4gICAgICAvLyB3aXRob3V0IHJlc3RhcnRpbmcgdGhlIFNpbXVsYXRvcjogaHR0cHM6Ly9naXRodWIuY29tL2FwcGl1bS9hcHBpdW0vaXNzdWVzLzk0MTBcbiAgICAgIGF3YWl0IHRoaXMub3B0cy5kZXZpY2UuY2xlYXJDYWNoZXMoJ2NvbS5hcHBsZS5tb2JpbGUuaW5zdGFsbGQuc3RhZ2luZycpO1xuXG4gICAgICBhd2FpdCB0aGlzLnN0YXJ0U2ltKCk7XG4gICAgICB0aGlzLmxvZ0V2ZW50KCdzaW1TdGFydGVkJyk7XG4gICAgICBpZiAoIWlzTG9nQ2FwdHVyZVN0YXJ0ZWQpIHtcbiAgICAgICAgLy8gUmV0cnkgbG9nIGNhcHR1cmUgaWYgU2ltdWxhdG9yIHdhcyBub3QgcnVubmluZyBiZWZvcmVcbiAgICAgICAgYXdhaXQgc3RhcnRMb2dDYXB0dXJlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0cy5hcHApIHtcbiAgICAgIGF3YWl0IHRoaXMuaW5zdGFsbEFwcCgpO1xuICAgICAgdGhpcy5sb2dFdmVudCgnYXBwSW5zdGFsbGVkJyk7XG4gICAgfVxuXG4gICAgLy8gaWYgd2Ugb25seSBoYXZlIGJ1bmRsZSBpZGVudGlmaWVyIGFuZCBubyBhcHAsIGZhaWwgaWYgaXQgaXMgbm90IGFscmVhZHkgaW5zdGFsbGVkXG4gICAgaWYgKCF0aGlzLm9wdHMuYXBwICYmIHRoaXMub3B0cy5idW5kbGVJZCAmJiAhdGhpcy5zYWZhcmkpIHtcbiAgICAgIGlmICghYXdhaXQgdGhpcy5vcHRzLmRldmljZS5pc0FwcEluc3RhbGxlZCh0aGlzLm9wdHMuYnVuZGxlSWQpKSB7XG4gICAgICAgIGxvZy5lcnJvckFuZFRocm93KGBBcHAgd2l0aCBidW5kbGUgaWRlbnRpZmllciAnJHt0aGlzLm9wdHMuYnVuZGxlSWR9JyB1bmtub3duYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgU0hBUkVEX1JFU09VUkNFU19HVUFSRC5hY3F1aXJlKFhDVUlUZXN0RHJpdmVyLm5hbWUsXG4gICAgICBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLnN0YXJ0V2RhKHRoaXMub3B0cy5zZXNzaW9uSWQsIHJlYWxEZXZpY2UpKTtcblxuICAgIGF3YWl0IHRoaXMuc2V0SW5pdGlhbE9yaWVudGF0aW9uKHRoaXMub3B0cy5vcmllbnRhdGlvbik7XG4gICAgdGhpcy5sb2dFdmVudCgnb3JpZW50YXRpb25TZXQnKTtcblxuICAgIGlmICh0aGlzLmlzUmVhbERldmljZSgpICYmIHRoaXMub3B0cy5zdGFydElXRFApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc3RhcnRJV0RQKCk7XG4gICAgICAgIGxvZy5kZWJ1ZyhgU3RhcnRlZCBpb3Nfd2Via2l0X2RlYnVnIHByb3h5IHNlcnZlciBhdDogJHt0aGlzLml3ZHBTZXJ2ZXIuZW5kcG9pbnR9YCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgbG9nLmVycm9yQW5kVGhyb3coYENvdWxkIG5vdCBzdGFydCBpb3Nfd2Via2l0X2RlYnVnX3Byb3h5IHNlcnZlcjogJHtlcnIubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1NhZmFyaSgpIHx8IHRoaXMub3B0cy5hdXRvV2Vidmlldykge1xuICAgICAgbG9nLmRlYnVnKCdXYWl0aW5nIGZvciBpbml0aWFsIHdlYnZpZXcnKTtcbiAgICAgIGF3YWl0IHRoaXMubmF2VG9Jbml0aWFsV2VidmlldygpO1xuICAgICAgdGhpcy5sb2dFdmVudCgnaW5pdGlhbFdlYnZpZXdOYXZpZ2F0ZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNSZWFsRGV2aWNlKCkpIHtcbiAgICAgIGlmICh0aGlzLm9wdHMuY2FsZW5kYXJBY2Nlc3NBdXRob3JpemVkKSB7XG4gICAgICAgIGF3YWl0IHRoaXMub3B0cy5kZXZpY2UuZW5hYmxlQ2FsZW5kYXJBY2Nlc3ModGhpcy5vcHRzLmJ1bmRsZUlkKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRzLmNhbGVuZGFyQWNjZXNzQXV0aG9yaXplZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5vcHRzLmRldmljZS5kaXNhYmxlQ2FsZW5kYXJBY2Nlc3ModGhpcy5vcHRzLmJ1bmRsZUlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBzdGFydFdkYSAoc2Vzc2lvbklkLCByZWFsRGV2aWNlKSB7XG4gICAgdGhpcy53ZGEgPSBuZXcgV2ViRHJpdmVyQWdlbnQodGhpcy54Y29kZVZlcnNpb24sIHRoaXMub3B0cyk7XG5cbiAgICBhd2FpdCB0aGlzLndkYS5jbGVhbnVwT2Jzb2xldGVQcm9jZXNzZXMoKTtcblxuICAgIGlmICh0aGlzLm9wdHMudXNlTmV3V0RBKSB7XG4gICAgICBsb2cuZGVidWcoYENhcGFiaWxpdHkgJ3VzZU5ld1dEQScgc2V0IHRvIHRydWUsIHNvIHVuaW5zdGFsbGluZyBXREEgYmVmb3JlIHByb2NlZWRpbmdgKTtcbiAgICAgIGF3YWl0IHRoaXMud2RhLnF1aXQoKTtcbiAgICAgIGF3YWl0IHRoaXMud2RhLnVuaW5zdGFsbCgpO1xuICAgICAgdGhpcy5sb2dFdmVudCgnd2RhVW5pbnN0YWxsZWQnKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlsLmhhc1ZhbHVlKHRoaXMud2RhLndlYkRyaXZlckFnZW50VXJsKSAmJiAoYXdhaXQgdGhpcy53ZGEuaXNSdW5uaW5nKCkpKSB7XG4gICAgICBsb2cuaW5mbyhgV2lsbCByZXVzZSBwcmV2aW91c2x5IGNhY2hlZCBXREEgaW5zdGFuY2UgYXQgJyR7dGhpcy53ZGEudXJsLmhyZWZ9Jy4gYCArXG4gICAgICAgICAgICAgICBgU2V0IHRoZSB3ZGFMb2NhbFBvcnQgY2FwYWJpbGl0eSB0byBhIHZhbHVlIGRpZmZlcmVudCBmcm9tICR7dGhpcy53ZGEudXJsLnBvcnR9IGAgK1xuICAgICAgICAgICAgICAgYGlmIHRoaXMgaXMgYW4gdW5kZXNpcmVkIGJlaGF2aW9yLmApO1xuICAgICAgdGhpcy53ZGEud2ViRHJpdmVyQWdlbnRVcmwgPSB0aGlzLndkYS51cmwuaHJlZjtcbiAgICB9XG5cbiAgICAvLyBsb2NhbCBoZWxwZXIgZm9yIHRoZSB0d28gcGxhY2VzIHdlIG5lZWQgdG8gdW5pbnN0YWxsIHdkYSBhbmQgcmUtc3RhcnQgaXRcbiAgICBjb25zdCBxdWl0QW5kVW5pbnN0YWxsID0gYXN5bmMgKG1zZykgPT4ge1xuICAgICAgbG9nLmRlYnVnKG1zZyk7XG4gICAgICBsb2cuZGVidWcoJ1F1aXR0aW5nIGFuZCB1bmluc3RhbGxpbmcgV2ViRHJpdmVyQWdlbnQsIHRoZW4gcmV0cnlpbmcnKTtcbiAgICAgIGF3YWl0IHRoaXMud2RhLnF1aXQoKTtcbiAgICAgIGF3YWl0IHRoaXMud2RhLnVuaW5zdGFsbCgpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgfTtcblxuICAgIGNvbnN0IHN0YXJ0dXBSZXRyaWVzID0gdGhpcy5vcHRzLndkYVN0YXJ0dXBSZXRyaWVzIHx8ICh0aGlzLmlzUmVhbERldmljZSgpID8gV0RBX1JFQUxfREVWX1NUQVJUVVBfUkVUUklFUyA6IFdEQV9TSU1fU1RBUlRVUF9SRVRSSUVTKTtcbiAgICBjb25zdCBzdGFydHVwUmV0cnlJbnRlcnZhbCA9IHRoaXMub3B0cy53ZGFTdGFydHVwUmV0cnlJbnRlcnZhbCB8fCBXREFfU1RBUlRVUF9SRVRSWV9JTlRFUlZBTDtcbiAgICBhd2FpdCByZXRyeUludGVydmFsKHN0YXJ0dXBSZXRyaWVzLCBzdGFydHVwUmV0cnlJbnRlcnZhbCwgYXN5bmMgKCkgPT4ge1xuICAgICAgdGhpcy5sb2dFdmVudCgnd2RhU3RhcnRBdHRlbXB0ZWQnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuY2FjaGVkV2RhU3RhdHVzID0gYXdhaXQgdGhpcy53ZGEubGF1bmNoKHNlc3Npb25JZCwgcmVhbERldmljZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhpcy5sb2dFdmVudCgnd2RhU3RhcnRGYWlsZWQnKTtcbiAgICAgICAgbGV0IGVycm9yTXNnID0gYFVuYWJsZSB0byBsYXVuY2ggV2ViRHJpdmVyQWdlbnQgYmVjYXVzZSBvZiB4Y29kZWJ1aWxkIGZhaWx1cmU6IFwiJHtlcnIubWVzc2FnZX1cIi5gO1xuICAgICAgICBpZiAodGhpcy5pc1JlYWxEZXZpY2UoKSkge1xuICAgICAgICAgIGVycm9yTXNnICs9IGAgTWFrZSBzdXJlIHlvdSBmb2xsb3cgdGhlIHR1dG9yaWFsIGF0ICR7V0RBX1JFQUxfREVWX1RVVE9SSUFMX1VSTH0uIGAgK1xuICAgICAgICAgICAgICAgICAgICAgIGBUcnkgdG8gcmVtb3ZlIHRoZSBXZWJEcml2ZXJBZ2VudFJ1bm5lciBhcHBsaWNhdGlvbiBmcm9tIHRoZSBkZXZpY2UgaWYgaXQgaXMgaW5zdGFsbGVkIGAgK1xuICAgICAgICAgICAgICAgICAgICAgIGBhbmQgcmVib290IHRoZSBkZXZpY2UuYDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBxdWl0QW5kVW5pbnN0YWxsKGVycm9yTXNnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm94eVJlcVJlcyA9IHRoaXMud2RhLnByb3h5UmVxUmVzLmJpbmQodGhpcy53ZGEpO1xuICAgICAgdGhpcy5qd3BQcm94eUFjdGl2ZSA9IHRydWU7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHJldHJ5SW50ZXJ2YWwoMTUsIDEwMDAsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICB0aGlzLmxvZ0V2ZW50KCd3ZGFTZXNzaW9uQXR0ZW1wdGVkJyk7XG4gICAgICAgICAgbG9nLmRlYnVnKCdTZW5kaW5nIGNyZWF0ZVNlc3Npb24gY29tbWFuZCB0byBXREEnKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jYWNoZWRXZGFTdGF0dXMgPSB0aGlzLmNhY2hlZFdkYVN0YXR1cyB8fCBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZCgnL3N0YXR1cycsICdHRVQnKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc3RhcnRXZGFTZXNzaW9uKHRoaXMub3B0cy5idW5kbGVJZCwgdGhpcy5vcHRzLnByb2Nlc3NBcmd1bWVudHMpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nLmRlYnVnKCdGYWlsZWQgdG8gY3JlYXRlIFdEQSBzZXNzaW9uLiBSZXRyeWluZy4uLicpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubG9nRXZlbnQoJ3dkYVNlc3Npb25TdGFydGVkJyk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgbGV0IGVycm9yTXNnID0gYFVuYWJsZSB0byBzdGFydCBXZWJEcml2ZXJBZ2VudCBzZXNzaW9uIGJlY2F1c2Ugb2YgeGNvZGVidWlsZCBmYWlsdXJlOiBcIiR7ZXJyLm1lc3NhZ2V9XCIuYDtcbiAgICAgICAgaWYgKHRoaXMuaXNSZWFsRGV2aWNlKCkpIHtcbiAgICAgICAgICBlcnJvck1zZyArPSBgIE1ha2Ugc3VyZSB5b3UgZm9sbG93IHRoZSB0dXRvcmlhbCBhdCAke1dEQV9SRUFMX0RFVl9UVVRPUklBTF9VUkx9LiBgICtcbiAgICAgICAgICAgICAgICAgICAgICBgVHJ5IHRvIHJlbW92ZSB0aGUgV2ViRHJpdmVyQWdlbnRSdW5uZXIgYXBwbGljYXRpb24gZnJvbSB0aGUgZGV2aWNlIGlmIGl0IGlzIGluc3RhbGxlZCBgICtcbiAgICAgICAgICAgICAgICAgICAgICBgYW5kIHJlYm9vdCB0aGUgZGV2aWNlLmA7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgcXVpdEFuZFVuaW5zdGFsbChlcnJvck1zZyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdXRpbC5oYXNWYWx1ZSh0aGlzLm9wdHMucHJldmVudFdEQUF0dGFjaG1lbnRzKSkge1xuICAgICAgICAvLyBYQ1Rlc3QgcHJpb3IgdG8gWGNvZGUgOSBTREsgaGFzIG5vIG5hdGl2ZSB3YXkgdG8gZGlzYWJsZSBhdHRhY2htZW50c1xuICAgICAgICB0aGlzLm9wdHMucHJldmVudFdEQUF0dGFjaG1lbnRzID0gdGhpcy54Y29kZVZlcnNpb24ubWFqb3IgPCA5O1xuICAgICAgICBpZiAodGhpcy5vcHRzLnByZXZlbnRXREFBdHRhY2htZW50cykge1xuICAgICAgICAgIGxvZy5pbmZvKCdFbmFibGVkIFdEQSBhdHRhY2htZW50cyBwcmV2ZW50aW9uIGJ5IGRlZmF1bHQgdG8gc2F2ZSB0aGUgZGlzayBzcGFjZS4gJyArXG4gICAgICAgICAgICAnU2V0IHByZXZlbnRXREFBdHRhY2htZW50cyBjYXBhYmlsaXR5IHRvIGZhbHNlIGlmIHRoaXMgaXMgYW4gdW5kZXNpcmVkIGJlaGF2aW9yLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRzLnByZXZlbnRXREFBdHRhY2htZW50cykge1xuICAgICAgICBhd2FpdCBhZGp1c3RXREFBdHRhY2htZW50c1Blcm1pc3Npb25zKHRoaXMud2RhLCB0aGlzLm9wdHMucHJldmVudFdEQUF0dGFjaG1lbnRzID8gJzU1NScgOiAnNzU1Jyk7XG4gICAgICAgIHRoaXMubG9nRXZlbnQoJ3dkYVBlcm1zQWRqdXN0ZWQnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0cy5jbGVhclN5c3RlbUZpbGVzKSB7XG4gICAgICAgIGF3YWl0IG1hcmtTeXN0ZW1GaWxlc0ZvckNsZWFudXAodGhpcy53ZGEpO1xuICAgICAgfVxuXG4gICAgICAvLyB3ZSBleHBlY3QgY2VydGFpbiBzb2NrZXQgZXJyb3JzIHVudGlsIHRoaXMgcG9pbnQsIGJ1dCBub3dcbiAgICAgIC8vIG1hcmsgdGhpbmdzIGFzIGZ1bGx5IHdvcmtpbmdcbiAgICAgIHRoaXMud2RhLmZ1bGx5U3RhcnRlZCA9IHRydWU7XG4gICAgICB0aGlzLmxvZ0V2ZW50KCd3ZGFTdGFydGVkJyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBjcmVhdGUgYW4gYWxpYXMgc28gd2UgY2FuIGFjdHVhbGx5IHVuaXQgdGVzdCBjcmVhdGVTZXNzaW9uIGJ5IHN0dWJiaW5nXG4gIC8vIHRoaXNcbiAgYXN5bmMgZXh0cmFjdEJ1bmRsZUlkIChhcHApIHtcbiAgICByZXR1cm4gYXdhaXQgYXBwVXRpbHMuZXh0cmFjdEJ1bmRsZUlkKGFwcCk7XG4gIH1cblxuICBhc3luYyBydW5SZXNldCAob3B0cyA9IG51bGwpIHtcbiAgICB0aGlzLmxvZ0V2ZW50KCdyZXNldFN0YXJ0ZWQnKTtcbiAgICBpZiAodGhpcy5pc1JlYWxEZXZpY2UoKSkge1xuICAgICAgYXdhaXQgcnVuUmVhbERldmljZVJlc2V0KHRoaXMub3B0cy5kZXZpY2UsIG9wdHMgfHwgdGhpcy5vcHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgcnVuU2ltdWxhdG9yUmVzZXQodGhpcy5vcHRzLmRldmljZSwgb3B0cyB8fCB0aGlzLm9wdHMpO1xuICAgIH1cbiAgICB0aGlzLmxvZ0V2ZW50KCdyZXNldENvbXBsZXRlJyk7XG4gIH1cblxuICBhc3luYyBkZWxldGVTZXNzaW9uICgpIHtcbiAgICBhd2FpdCBTSEFSRURfUkVTT1VSQ0VTX0dVQVJELmFjcXVpcmUoWENVSVRlc3REcml2ZXIubmFtZSwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKCk7XG5cbiAgICAgIC8vIHJlc2V0IHRoZSBwZXJtaXNzaW9ucyBvbiB0aGUgZGVyaXZlZCBkYXRhIGZvbGRlciwgaWYgbmVjZXNzYXJ5XG4gICAgICBpZiAodGhpcy5vcHRzLnByZXZlbnRXREFBdHRhY2htZW50cykge1xuICAgICAgICBhd2FpdCBhZGp1c3RXREFBdHRhY2htZW50c1Blcm1pc3Npb25zKHRoaXMud2RhLCAnNzU1Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdHMuY2xlYXJTeXN0ZW1GaWxlcykge1xuICAgICAgICBhd2FpdCBjbGVhclN5c3RlbUZpbGVzKHRoaXMud2RhLCAhIXRoaXMub3B0cy5zaG93WGNvZGVMb2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nLmRlYnVnKCdOb3QgY2xlYXJpbmcgbG9nIGZpbGVzLiBVc2UgYGNsZWFyU3lzdGVtRmlsZXNgIGNhcGFiaWxpdHkgdG8gdHVybiBvbi4nKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmlzV2ViQ29udGV4dCgpKSB7XG4gICAgICBsb2cuZGVidWcoJ0luIGEgd2ViIHNlc3Npb24uIFJlbW92aW5nIHJlbW90ZSBkZWJ1Z2dlcicpO1xuICAgICAgYXdhaXQgdGhpcy5zdG9wUmVtb3RlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0cy5yZXNldE9uU2Vzc2lvblN0YXJ0T25seSA9PT0gZmFsc2UpIHtcbiAgICAgIGF3YWl0IHRoaXMucnVuUmVzZXQoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1NpbXVsYXRvcigpICYmIHRoaXMub3B0cy51ZGlkICYmIHRoaXMub3B0cy5jdXN0b21TU0xDZXJ0KSB7XG4gICAgICBhd2FpdCB1bmluc3RhbGxTU0xDZXJ0KHRoaXMub3B0cy5jdXN0b21TU0xDZXJ0LCB0aGlzLm9wdHMudWRpZCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNTaW11bGF0b3IoKSAmJiAhdGhpcy5vcHRzLm5vUmVzZXQgJiYgISF0aGlzLm9wdHMuZGV2aWNlKSB7XG4gICAgICBpZiAodGhpcy5saWZlY3ljbGVEYXRhLmNyZWF0ZVNpbSkge1xuICAgICAgICBhd2FpdCByZXNldFhDVGVzdFByb2Nlc3Nlcyh0aGlzLm9wdHMudWRpZCwgdHJ1ZSk7XG4gICAgICAgIGxvZy5kZWJ1ZyhgRGVsZXRpbmcgc2ltdWxhdG9yIGNyZWF0ZWQgZm9yIHRoaXMgcnVuICh1ZGlkOiAnJHt0aGlzLm9wdHMudWRpZH0nKWApO1xuICAgICAgICBhd2FpdCB0aGlzLm9wdHMuZGV2aWNlLnNodXRkb3duKCk7XG4gICAgICAgIGF3YWl0IHRoaXMub3B0cy5kZXZpY2UuZGVsZXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFfLmlzRW1wdHkodGhpcy5sb2dzKSkge1xuICAgICAgdGhpcy5sb2dzLnN5c2xvZy5zdG9wQ2FwdHVyZSgpO1xuICAgICAgdGhpcy5sb2dzID0ge307XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXdkcFNlcnZlcikge1xuICAgICAgdGhpcy5zdG9wSVdEUCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdHMuZW5hYmxlQXN5bmNFeGVjdXRlRnJvbUh0dHBzICYmICF0aGlzLmlzUmVhbERldmljZSgpKSB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3BIdHRwc0FzeW5jU2VydmVyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNldElvcygpO1xuXG4gICAgYXdhaXQgc3VwZXIuZGVsZXRlU2Vzc2lvbigpO1xuICB9XG5cbiAgYXN5bmMgc3RvcCAoKSB7XG4gICAgdGhpcy5qd3BQcm94eUFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMucHJveHlSZXFSZXMgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMud2RhICYmIHRoaXMud2RhLmZ1bGx5U3RhcnRlZCkge1xuICAgICAgaWYgKHRoaXMud2RhLmp3cHJveHkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZChgL3Nlc3Npb24vJHt0aGlzLnNlc3Npb25JZH1gLCAnREVMRVRFJyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIC8vIGFuIGVycm9yIGhlcmUgc2hvdWxkIG5vdCBzaG9ydC1jaXJjdWl0IHRoZSByZXN0IG9mIGNsZWFuIHVwXG4gICAgICAgICAgbG9nLmRlYnVnKGBVbmFibGUgdG8gREVMRVRFIHNlc3Npb24gb24gV0RBOiAnJHtlcnIubWVzc2FnZX0nLiBDb250aW51aW5nIHNodXRkb3duLmApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy53ZGEgJiYgIXRoaXMud2RhLndlYkRyaXZlckFnZW50VXJsICYmIHRoaXMub3B0cy51c2VOZXdXREEpIHtcbiAgICAgICAgYXdhaXQgdGhpcy53ZGEucXVpdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGV4ZWN1dGVDb21tYW5kIChjbWQsIC4uLmFyZ3MpIHtcbiAgICBsb2cuZGVidWcoYEV4ZWN1dGluZyBjb21tYW5kICcke2NtZH0nYCk7XG5cbiAgICBpZiAoY21kID09PSAncmVjZWl2ZUFzeW5jUmVzcG9uc2UnKSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5yZWNlaXZlQXN5bmNSZXNwb25zZSguLi5hcmdzKTtcbiAgICB9XG4gICAgLy8gVE9ETzogb25jZSB0aGlzIGZpeCBnZXRzIGludG8gYmFzZSBkcml2ZXIgcmVtb3ZlIGZyb20gaGVyZVxuICAgIGlmIChjbWQgPT09ICdnZXRTdGF0dXMnKSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRTdGF0dXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHN1cGVyLmV4ZWN1dGVDb21tYW5kKGNtZCwgLi4uYXJncyk7XG4gIH1cblxuICBhc3luYyBjb25maWd1cmVBcHAgKCkge1xuICAgIGZ1bmN0aW9uIGFwcElzUGFja2FnZU9yQnVuZGxlIChhcHApIHtcbiAgICAgIHJldHVybiAoL14oW2EtekEtWjAtOVxcLV9dK1xcLlthLXpBLVowLTlcXC1fXSspKyQvKS50ZXN0KGFwcCk7XG4gICAgfVxuXG4gICAgLy8gdGhlIGFwcCBuYW1lIGlzIGEgYnVuZGxlSWQgYXNzaWduIGl0IHRvIHRoZSBidW5kbGVJZCBwcm9wZXJ0eVxuICAgIGlmICghdGhpcy5vcHRzLmJ1bmRsZUlkICYmIGFwcElzUGFja2FnZU9yQnVuZGxlKHRoaXMub3B0cy5hcHApKSB7XG4gICAgICB0aGlzLm9wdHMuYnVuZGxlSWQgPSB0aGlzLm9wdHMuYXBwO1xuICAgICAgdGhpcy5vcHRzLmFwcCA9ICcnO1xuICAgIH1cbiAgICAvLyB3ZSBoYXZlIGEgYnVuZGxlIElELCBidXQgbm8gYXBwLCBvciBhcHAgaXMgYWxzbyBhIGJ1bmRsZVxuICAgIGlmICgodGhpcy5vcHRzLmJ1bmRsZUlkICYmIGFwcElzUGFja2FnZU9yQnVuZGxlKHRoaXMub3B0cy5idW5kbGVJZCkpICYmXG4gICAgICAgICh0aGlzLm9wdHMuYXBwID09PSAnJyB8fCBhcHBJc1BhY2thZ2VPckJ1bmRsZSh0aGlzLm9wdHMuYXBwKSkpIHtcbiAgICAgIGxvZy5kZWJ1ZygnQXBwIGlzIGFuIGlPUyBidW5kbGUsIHdpbGwgYXR0ZW1wdCB0byBydW4gYXMgcHJlLWV4aXN0aW5nJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgZm9yIHN1cHBvcnRlZCBidWlsZC1pbiBhcHBzXG4gICAgaWYgKHRoaXMub3B0cy5hcHAgJiYgdGhpcy5vcHRzLmFwcC50b0xvd2VyQ2FzZSgpID09PSAnc2V0dGluZ3MnKSB7XG4gICAgICB0aGlzLm9wdHMuYnVuZGxlSWQgPSAnY29tLmFwcGxlLlByZWZlcmVuY2VzJztcbiAgICAgIHRoaXMub3B0cy5hcHAgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRzLmFwcCAmJiB0aGlzLm9wdHMuYXBwLnRvTG93ZXJDYXNlKCkgPT09ICdjYWxlbmRhcicpIHtcbiAgICAgIHRoaXMub3B0cy5idW5kbGVJZCA9ICdjb20uYXBwbGUubW9iaWxlY2FsJztcbiAgICAgIHRoaXMub3B0cy5hcHAgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBkb3dubG9hZCBpZiBuZWNlc3NhcnlcbiAgICAgIHRoaXMub3B0cy5hcHAgPSBhd2FpdCB0aGlzLmhlbHBlcnMuY29uZmlndXJlQXBwKHRoaXMub3B0cy5hcHAsICcuYXBwJywgdGhpcy5vcHRzLm1vdW50Um9vdCwgdGhpcy5vcHRzLndpbmRvd3NTaGFyZVVzZXJOYW1lLCB0aGlzLm9wdHMud2luZG93c1NoYXJlUGFzc3dvcmQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgbG9nLmVycm9yKGVycik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBCYWQgYXBwOiAke3RoaXMub3B0cy5hcHB9LiBBcHAgcGF0aHMgbmVlZCB0byBiZSBhYnNvbHV0ZSwgb3IgcmVsYXRpdmUgdG8gdGhlIGFwcGl1bSBgICtcbiAgICAgICAgJ3NlcnZlciBpbnN0YWxsIGRpciwgb3IgYSBVUkwgdG8gY29tcHJlc3NlZCBmaWxlLCBvciBhIHNwZWNpYWwgYXBwIG5hbWUuJyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGV0ZXJtaW5lRGV2aWNlICgpIHtcbiAgICAvLyBpbiB0aGUgb25lIGNhc2Ugd2hlcmUgd2UgY3JlYXRlIGEgc2ltLCB3ZSB3aWxsIHNldCB0aGlzIHN0YXRlXG4gICAgdGhpcy5saWZlY3ljbGVEYXRhLmNyZWF0ZVNpbSA9IGZhbHNlO1xuXG4gICAgLy8gaWYgd2UgZ2V0IGdlbmVyaWMgbmFtZXMsIHRyYW5zbGF0ZSB0aGVtXG4gICAgdGhpcy5vcHRzLmRldmljZU5hbWUgPSBhd2FpdCB0cmFuc2xhdGVEZXZpY2VOYW1lKHRoaXMueGNvZGVWZXJzaW9uLCB0aGlzLm9wdHMucGxhdGZvcm1WZXJzaW9uLCB0aGlzLm9wdHMuZGV2aWNlTmFtZSk7XG5cbiAgICAvLyBjaGVjayBmb3IgYSBwYXJ0aWN1bGFyIHNpbXVsYXRvclxuICAgIGlmICh0aGlzLm9wdHMudWRpZCAmJiAoYXdhaXQgc2ltRXhpc3RzKHRoaXMub3B0cy51ZGlkKSkpIHtcbiAgICAgIGNvbnN0IGRldmljZSA9IGF3YWl0IGdldFNpbXVsYXRvcih0aGlzLm9wdHMudWRpZCk7XG4gICAgICByZXR1cm4ge2RldmljZSwgcmVhbERldmljZTogZmFsc2UsIHVkaWQ6IHRoaXMub3B0cy51ZGlkfTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRzLnVkaWQpIHtcbiAgICAgIGlmICh0aGlzLm9wdHMudWRpZC50b0xvd2VyQ2FzZSgpID09PSAnYXV0bycpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLm9wdHMudWRpZCA9IGF3YWl0IGRldGVjdFVkaWQoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgLy8gVHJ5aW5nIHRvIGZpbmQgbWF0Y2hpbmcgVURJRCBmb3IgU2ltdWxhdG9yXG4gICAgICAgICAgbG9nLndhcm4oYENhbm5vdCBkZXRlY3QgYW55IGNvbm5lY3RlZCByZWFsIGRldmljZXMuIEZhbGxpbmcgYmFjayB0byBTaW11bGF0b3IuIE9yaWdpbmFsIGVycm9yOiAke2Vyci5tZXNzYWdlfWApO1xuICAgICAgICAgIGNvbnN0IGRldmljZSA9IGF3YWl0IGdldEV4aXN0aW5nU2ltKHRoaXMub3B0cyk7XG4gICAgICAgICAgaWYgKCFkZXZpY2UpIHtcbiAgICAgICAgICAgIC8vIE5vIG1hdGNoaW5nIFNpbXVsYXRvciBpcyBmb3VuZC4gVGhyb3cgYW4gZXJyb3JcbiAgICAgICAgICAgIGxvZy5lcnJvckFuZFRocm93KGBDYW5ub3QgZGV0ZWN0IHVkaWQgZm9yICR7dGhpcy5vcHRzLmRldmljZU5hbWV9IFNpbXVsYXRvciBydW5uaW5nIGlPUyAke3RoaXMub3B0cy5wbGF0Zm9ybVZlcnNpb259YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIE1hdGNoaW5nIFNpbXVsYXRvciBleGlzdHMgYW5kIGlzIGZvdW5kLiBVc2UgaXRcbiAgICAgICAgICB0aGlzLm9wdHMudWRpZCA9IGRldmljZS51ZGlkO1xuICAgICAgICAgIHJldHVybiB7ZGV2aWNlLCByZWFsRGV2aWNlOiBmYWxzZSwgdWRpZDogZGV2aWNlLnVkaWR9O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBtYWtlIHN1cmUgaXQgaXMgYSBjb25uZWN0ZWQgZGV2aWNlLiBJZiBub3QsIHRoZSB1ZGlkIHBhc3NlZCBpbiBpcyBpbnZhbGlkXG4gICAgICAgIGNvbnN0IGRldmljZXMgPSBhd2FpdCBnZXRDb25uZWN0ZWREZXZpY2VzKCk7XG4gICAgICAgIGxvZy5kZWJ1ZyhgQXZhaWxhYmxlIGRldmljZXM6ICR7ZGV2aWNlcy5qb2luKCcsICcpfWApO1xuICAgICAgICBpZiAoZGV2aWNlcy5pbmRleE9mKHRoaXMub3B0cy51ZGlkKSA9PT0gLTEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZGV2aWNlIG9yIHNpbXVsYXRvciBVRElEOiAnJHt0aGlzLm9wdHMudWRpZH0nYCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgZGV2aWNlID0gYXdhaXQgZ2V0UmVhbERldmljZU9iaih0aGlzLm9wdHMudWRpZCk7XG4gICAgICByZXR1cm4ge2RldmljZSwgcmVhbERldmljZTogdHJ1ZSwgdWRpZDogdGhpcy5vcHRzLnVkaWR9O1xuICAgIH1cblxuICAgIC8vIGZpZ3VyZSBvdXQgdGhlIGNvcnJlY3Qgc2ltdWxhdG9yIHRvIHVzZSwgZ2l2ZW4gdGhlIGRlc2lyZWQgY2FwYWJpbGl0aWVzXG4gICAgbGV0IGRldmljZSA9IGF3YWl0IGdldEV4aXN0aW5nU2ltKHRoaXMub3B0cyk7XG5cbiAgICAvLyBjaGVjayBmb3IgYW4gZXhpc3Rpbmcgc2ltdWxhdG9yXG4gICAgaWYgKGRldmljZSkge1xuICAgICAgcmV0dXJuIHtkZXZpY2UsIHJlYWxEZXZpY2U6IGZhbHNlLCB1ZGlkOiBkZXZpY2UudWRpZH07XG4gICAgfVxuXG4gICAgLy8gbm8gZGV2aWNlIG9mIHRoaXMgdHlwZSBleGlzdHMsIHNvIGNyZWF0ZSBvbmVcbiAgICBsb2cuaW5mbygnU2ltdWxhdG9yIHVkaWQgbm90IHByb3ZpZGVkLCB1c2luZyBkZXNpcmVkIGNhcHMgdG8gY3JlYXRlIGEgbmV3IHNpbXVsYXRvcicpO1xuICAgIGlmICghdGhpcy5vcHRzLnBsYXRmb3JtVmVyc2lvbikge1xuICAgICAgbG9nLmluZm8oYE5vIHBsYXRmb3JtVmVyc2lvbiBzcGVjaWZpZWQuIFVzaW5nIGxhdGVzdCB2ZXJzaW9uIFhjb2RlIHN1cHBvcnRzOiAnJHt0aGlzLmlvc1Nka1ZlcnNpb259JyBgICtcbiAgICAgICAgICAgICAgIGBUaGlzIG1heSBjYXVzZSBwcm9ibGVtcyBpZiBhIHNpbXVsYXRvciBkb2VzIG5vdCBleGlzdCBmb3IgdGhpcyBwbGF0Zm9ybSB2ZXJzaW9uLmApO1xuICAgICAgdGhpcy5vcHRzLnBsYXRmb3JtVmVyc2lvbiA9IHRoaXMuaW9zU2RrVmVyc2lvbjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRzLm5vUmVzZXQpIHtcbiAgICAgIC8vIENoZWNrIGZvciBleGlzdGluZyBzaW11bGF0b3IganVzdCB3aXRoIGNvcnJlY3QgY2FwYWJpbGl0aWVzXG4gICAgICBsZXQgZGV2aWNlID0gYXdhaXQgZ2V0RXhpc3RpbmdTaW0odGhpcy5vcHRzKTtcbiAgICAgIGlmIChkZXZpY2UpIHtcbiAgICAgICAgcmV0dXJuIHtkZXZpY2UsIHJlYWxEZXZpY2U6IGZhbHNlLCB1ZGlkOiBkZXZpY2UudWRpZH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGV2aWNlID0gYXdhaXQgdGhpcy5jcmVhdGVTaW0oKTtcbiAgICByZXR1cm4ge2RldmljZSwgcmVhbERldmljZTogZmFsc2UsIHVkaWQ6IGRldmljZS51ZGlkfTtcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0U2ltICgpIHtcbiAgICBjb25zdCBydW5PcHRzID0ge1xuICAgICAgc2NhbGVGYWN0b3I6IHRoaXMub3B0cy5zY2FsZUZhY3RvcixcbiAgICAgIGNvbm5lY3RIYXJkd2FyZUtleWJvYXJkOiAhIXRoaXMub3B0cy5jb25uZWN0SGFyZHdhcmVLZXlib2FyZCxcbiAgICAgIGlzSGVhZGxlc3M6ICEhdGhpcy5vcHRzLmlzSGVhZGxlc3MsXG4gICAgICBkZXZpY2VQcmVmZXJlbmNlczoge30sXG4gICAgfTtcblxuICAgIC8vIGFkZCB0aGUgd2luZG93IGNlbnRlciwgaWYgaXQgaXMgc3BlY2lmaWVkXG4gICAgaWYgKHRoaXMub3B0cy5TaW11bGF0b3JXaW5kb3dDZW50ZXIpIHtcbiAgICAgIHJ1bk9wdHMuZGV2aWNlUHJlZmVyZW5jZXMuU2ltdWxhdG9yV2luZG93Q2VudGVyID0gdGhpcy5vcHRzLlNpbXVsYXRvcldpbmRvd0NlbnRlcjtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGlzIHRvIHdvcmthcm91bmQgWENUZXN0IGJ1ZyBhYm91dCBjaGFuZ2luZyBTaW11bGF0b3JcbiAgICAvLyBvcmllbnRhdGlvbiBpcyBub3Qgc3luY2hyb25pemVkIHRvIHRoZSBhY3R1YWwgd2luZG93IG9yaWVudGF0aW9uXG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBfLmlzU3RyaW5nKHRoaXMub3B0cy5vcmllbnRhdGlvbikgJiYgdGhpcy5vcHRzLm9yaWVudGF0aW9uLnRvVXBwZXJDYXNlKCk7XG4gICAgc3dpdGNoIChvcmllbnRhdGlvbikge1xuICAgICAgY2FzZSAnTEFORFNDQVBFJzpcbiAgICAgICAgcnVuT3B0cy5kZXZpY2VQcmVmZXJlbmNlcy5TaW11bGF0b3JXaW5kb3dPcmllbnRhdGlvbiA9ICdMYW5kc2NhcGVMZWZ0JztcbiAgICAgICAgcnVuT3B0cy5kZXZpY2VQcmVmZXJlbmNlcy5TaW11bGF0b3JXaW5kb3dSb3RhdGlvbkFuZ2xlID0gOTA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnUE9SVFJBSVQnOlxuICAgICAgICBydW5PcHRzLmRldmljZVByZWZlcmVuY2VzLlNpbXVsYXRvcldpbmRvd09yaWVudGF0aW9uID0gJ1BvcnRyYWl0JztcbiAgICAgICAgcnVuT3B0cy5kZXZpY2VQcmVmZXJlbmNlcy5TaW11bGF0b3JXaW5kb3dSb3RhdGlvbkFuZ2xlID0gMDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5vcHRzLmRldmljZS5ydW4ocnVuT3B0cyk7XG4gIH1cblxuICBhc3luYyBjcmVhdGVTaW0gKCkge1xuICAgIHRoaXMubGlmZWN5Y2xlRGF0YS5jcmVhdGVTaW0gPSB0cnVlO1xuXG4gICAgLy8gY3JlYXRlIHNpbSBmb3IgY2Fwc1xuICAgIGxldCBzaW0gPSBhd2FpdCBjcmVhdGVTaW0odGhpcy5vcHRzLCB0aGlzLnNlc3Npb25JZCk7XG4gICAgbG9nLmluZm8oYENyZWF0ZWQgc2ltdWxhdG9yIHdpdGggdWRpZCAnJHtzaW0udWRpZH0nLmApO1xuXG4gICAgcmV0dXJuIHNpbTtcbiAgfVxuXG4gIGFzeW5jIGxhdW5jaEFwcCAoKSB7XG4gICAgY29uc3QgQVBQX0xBVU5DSF9USU1FT1VUID0gMjAgKiAxMDAwO1xuXG4gICAgdGhpcy5sb2dFdmVudCgnYXBwTGF1bmNoQXR0ZW1wdGVkJyk7XG4gICAgYXdhaXQgbGF1bmNoKHRoaXMub3B0cy5kZXZpY2UudWRpZCwgdGhpcy5vcHRzLmJ1bmRsZUlkKTtcblxuICAgIGxldCBjaGVja1N0YXR1cyA9IGFzeW5jICgpID0+IHtcbiAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMucHJveHlDb21tYW5kKCcvc3RhdHVzJywgJ0dFVCcpO1xuICAgICAgbGV0IGN1cnJlbnRBcHAgPSByZXNwb25zZS5jdXJyZW50QXBwLmJ1bmRsZUlEO1xuICAgICAgaWYgKGN1cnJlbnRBcHAgIT09IHRoaXMub3B0cy5idW5kbGVJZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5vcHRzLmJ1bmRsZUlkfSBub3QgaW4gZm9yZWdyb3VuZC4gJHtjdXJyZW50QXBwfSBpcyBpbiBmb3JlZ3JvdW5kYCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxvZy5pbmZvKGBXYWl0aW5nIGZvciAnJHt0aGlzLm9wdHMuYnVuZGxlSWR9JyB0byBiZSBpbiBmb3JlZ3JvdW5kYCk7XG4gICAgbGV0IHJldHJpZXMgPSBwYXJzZUludChBUFBfTEFVTkNIX1RJTUVPVVQgLyAyMDAsIDEwKTtcbiAgICBhd2FpdCByZXRyeUludGVydmFsKHJldHJpZXMsIDIwMCwgY2hlY2tTdGF0dXMpO1xuICAgIGxvZy5pbmZvKGAke3RoaXMub3B0cy5idW5kbGVJZH0gaXMgaW4gZm9yZWdyb3VuZGApO1xuICAgIHRoaXMubG9nRXZlbnQoJ2FwcExhdW5jaGVkJyk7XG4gIH1cblxuICBhc3luYyBzdGFydFdkYVNlc3Npb24gKGJ1bmRsZUlkLCBwcm9jZXNzQXJndW1lbnRzKSB7XG4gICAgbGV0IGFyZ3MgPSBwcm9jZXNzQXJndW1lbnRzID8gcHJvY2Vzc0FyZ3VtZW50cy5hcmdzIDogW107XG4gICAgbGV0IGVudiA9IHByb2Nlc3NBcmd1bWVudHMgPyBwcm9jZXNzQXJndW1lbnRzLmVudiA6IHt9O1xuXG4gICAgbGV0IHNob3VsZFdhaXRGb3JRdWllc2NlbmNlID0gdXRpbC5oYXNWYWx1ZSh0aGlzLm9wdHMud2FpdEZvclF1aWVzY2VuY2UpID8gdGhpcy5vcHRzLndhaXRGb3JRdWllc2NlbmNlIDogdHJ1ZTtcbiAgICBsZXQgbWF4VHlwaW5nRnJlcXVlbmN5ID0gdXRpbC5oYXNWYWx1ZSh0aGlzLm9wdHMubWF4VHlwaW5nRnJlcXVlbmN5KSA/IHRoaXMub3B0cy5tYXhUeXBpbmdGcmVxdWVuY3kgOiA2MDtcbiAgICBsZXQgc2hvdWxkVXNlU2luZ2xldG9uVGVzdE1hbmFnZXIgPSB1dGlsLmhhc1ZhbHVlKHRoaXMub3B0cy5zaG91bGRVc2VTaW5nbGV0b25UZXN0TWFuYWdlcikgPyB0aGlzLm9wdHMuc2hvdWxkVXNlU2luZ2xldG9uVGVzdE1hbmFnZXIgOiB0cnVlO1xuICAgIGxldCBzaG91bGRVc2VUZXN0TWFuYWdlckZvclZpc2liaWxpdHlEZXRlY3Rpb24gPSBmYWxzZTtcbiAgICBpZiAodXRpbC5oYXNWYWx1ZSh0aGlzLm9wdHMuc2ltcGxlSXNWaXNpYmxlQ2hlY2spKSB7XG4gICAgICBzaG91bGRVc2VUZXN0TWFuYWdlckZvclZpc2liaWxpdHlEZXRlY3Rpb24gPSB0aGlzLm9wdHMuc2ltcGxlSXNWaXNpYmxlQ2hlY2s7XG4gICAgfVxuICAgIGlmICghaXNOYU4ocGFyc2VGbG9hdCh0aGlzLm9wdHMucGxhdGZvcm1WZXJzaW9uKSkgJiYgcGFyc2VGbG9hdCh0aGlzLm9wdHMucGxhdGZvcm1WZXJzaW9uKS50b0ZpeGVkKDEpID09PSAnOS4zJykge1xuICAgICAgbG9nLmluZm8oYEZvcmNpbmcgc2hvdWxkVXNlU2luZ2xldG9uVGVzdE1hbmFnZXIgY2FwYWJpbGl0eSB2YWx1ZSB0byB0cnVlLCBiZWNhdXNlIG9mIGtub3duIFhDVGVzdCBpc3N1ZXMgdW5kZXIgOS4zIHBsYXRmb3JtIHZlcnNpb25gKTtcbiAgICAgIHNob3VsZFVzZVRlc3RNYW5hZ2VyRm9yVmlzaWJpbGl0eURldGVjdGlvbiA9IHRydWU7XG4gICAgfVxuICAgIGlmICh1dGlsLmhhc1ZhbHVlKHRoaXMub3B0cy5sYW5ndWFnZSkpIHtcbiAgICAgIGFyZ3MucHVzaCgnLUFwcGxlTGFuZ3VhZ2VzJywgYCgke3RoaXMub3B0cy5sYW5ndWFnZX0pYCk7XG4gICAgICBhcmdzLnB1c2goJy1OU0xhbmd1YWdlcycsIGAoJHt0aGlzLm9wdHMubGFuZ3VhZ2V9KWApO1xuICAgIH1cblxuICAgIGlmICh1dGlsLmhhc1ZhbHVlKHRoaXMub3B0cy5sb2NhbGUpKSB7XG4gICAgICBhcmdzLnB1c2goJy1BcHBsZUxvY2FsZScsIHRoaXMub3B0cy5sb2NhbGUpO1xuICAgIH1cblxuICAgIGxldCBkZXNpcmVkID0ge1xuICAgICAgZGVzaXJlZENhcGFiaWxpdGllczoge1xuICAgICAgICBidW5kbGVJZCxcbiAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxuICAgICAgICBlbnZpcm9ubWVudDogZW52LFxuICAgICAgICBzaG91bGRXYWl0Rm9yUXVpZXNjZW5jZSxcbiAgICAgICAgc2hvdWxkVXNlVGVzdE1hbmFnZXJGb3JWaXNpYmlsaXR5RGV0ZWN0aW9uLFxuICAgICAgICBtYXhUeXBpbmdGcmVxdWVuY3ksXG4gICAgICAgIHNob3VsZFVzZVNpbmdsZXRvblRlc3RNYW5hZ2VyLFxuICAgICAgfVxuICAgIH07XG5cbiAgICBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZCgnL3Nlc3Npb24nLCAnUE9TVCcsIGRlc2lyZWQpO1xuICB9XG5cbiAgLy8gT3ZlcnJpZGUgUHJveHkgbWV0aG9kcyBmcm9tIEJhc2VEcml2ZXJcbiAgcHJveHlBY3RpdmUgKCkge1xuICAgIHJldHVybiB0aGlzLmp3cFByb3h5QWN0aXZlO1xuICB9XG5cbiAgZ2V0UHJveHlBdm9pZExpc3QgKCkge1xuICAgIGlmICh0aGlzLmlzV2VidmlldygpKSB7XG4gICAgICByZXR1cm4gTk9fUFJPWFlfV0VCX0xJU1Q7XG4gICAgfVxuICAgIHJldHVybiBOT19QUk9YWV9OQVRJVkVfTElTVDtcbiAgfVxuXG4gIGNhblByb3h5ICgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlzU2FmYXJpICgpIHtcbiAgICByZXR1cm4gISF0aGlzLnNhZmFyaTtcbiAgfVxuXG4gIGlzUmVhbERldmljZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0cy5yZWFsRGV2aWNlO1xuICB9XG5cbiAgaXNTaW11bGF0b3IgKCkge1xuICAgIHJldHVybiAhdGhpcy5vcHRzLnJlYWxEZXZpY2U7XG4gIH1cblxuICBpc1dlYnZpZXcgKCkge1xuICAgIHJldHVybiB0aGlzLmlzU2FmYXJpKCkgfHwgdGhpcy5pc1dlYkNvbnRleHQoKTtcbiAgfVxuXG4gIHZhbGlkYXRlTG9jYXRvclN0cmF0ZWd5IChzdHJhdGVneSkge1xuICAgIHN1cGVyLnZhbGlkYXRlTG9jYXRvclN0cmF0ZWd5KHN0cmF0ZWd5LCB0aGlzLmlzV2ViQ29udGV4dCgpKTtcbiAgfVxuXG4gIHZhbGlkYXRlRGVzaXJlZENhcHMgKGNhcHMpIHtcbiAgICAvLyBjaGVjayB3aXRoIHRoZSBiYXNlIGNsYXNzLCBhbmQgcmV0dXJuIGlmIGl0IGZhaWxzXG4gICAgbGV0IHJlcyA9IHN1cGVyLnZhbGlkYXRlRGVzaXJlZENhcHMoY2Fwcyk7XG4gICAgaWYgKCFyZXMpIHtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgLy8gbWFrZSBzdXJlIHRoYXQgdGhlIGNhcGFiaWxpdGllcyBoYXZlIG9uZSBvZiBgYXBwYCBvciBgYnVuZGxlSWRgXG4gICAgaWYgKChjYXBzLmJyb3dzZXJOYW1lIHx8ICcnKS50b0xvd2VyQ2FzZSgpICE9PSAnc2FmYXJpJyAmJlxuICAgICAgICAhY2Fwcy5hcHAgJiYgIWNhcHMuYnVuZGxlSWQpIHtcbiAgICAgIGxldCBtc2cgPSAnVGhlIGRlc2lyZWQgY2FwYWJpbGl0aWVzIG11c3QgaW5jbHVkZSBlaXRoZXIgYW4gYXBwIG9yIGEgYnVuZGxlSWQgZm9yIGlPUyc7XG4gICAgICBsb2cuZXJyb3JBbmRUaHJvdyhtc2cpO1xuICAgIH1cblxuICAgIGxldCB2ZXJpZnlQcm9jZXNzQXJndW1lbnQgPSAocHJvY2Vzc0FyZ3VtZW50cykgPT4ge1xuICAgICAgaWYgKCFfLmlzTmlsKHByb2Nlc3NBcmd1bWVudHMuYXJncykgJiYgIV8uaXNBcnJheShwcm9jZXNzQXJndW1lbnRzLmFyZ3MpKSB7XG4gICAgICAgIGxvZy5lcnJvckFuZFRocm93KCdwcm9jZXNzQXJndW1lbnRzLmFyZ3MgbXVzdCBiZSBhbiBhcnJheSBvZiBzdHJpbmcnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFfLmlzTmlsKHByb2Nlc3NBcmd1bWVudHMuZW52KSAmJiAhXy5pc09iamVjdChjYXBzLnByb2Nlc3NBcmd1bWVudHMuZW52KSkge1xuICAgICAgICBsb2cuZXJyb3JBbmRUaHJvdygncHJvY2Vzc0FyZ3VtZW50cy5lbnYgbXVzdCBiZSBhbiBvYmplY3QgPGtleSx2YWx1ZT4gcGFpciB7YTpiLCBjOmR9Jyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIGBwcm9jZXNzQXJndW1lbnRzYCBzaG91bGQgYmUgSlNPTiBzdHJpbmcgb3IgYW4gb2JqZWN0IHdpdGggYXJndW1lbnRzIGFuZC8gZW52aXJvbm1lbnQgZGV0YWlsc1xuICAgIGlmIChjYXBzLnByb2Nlc3NBcmd1bWVudHMpIHtcbiAgICAgIGlmIChfLmlzU3RyaW5nKGNhcHMucHJvY2Vzc0FyZ3VtZW50cykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyB0cnkgdG8gcGFyc2UgdGhlIHN0cmluZyBhcyBKU09OXG4gICAgICAgICAgY2Fwcy5wcm9jZXNzQXJndW1lbnRzID0gSlNPTi5wYXJzZShjYXBzLnByb2Nlc3NBcmd1bWVudHMpO1xuICAgICAgICAgIHZlcmlmeVByb2Nlc3NBcmd1bWVudChjYXBzLnByb2Nlc3NBcmd1bWVudHMpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBsb2cuZXJyb3JBbmRUaHJvdyhgcHJvY2Vzc0FyZ3VtZW50cyBtdXN0IGJlIGEganNvbiBmb3JtYXQgb3IgYW4gb2JqZWN0IHdpdGggZm9ybWF0IHthcmdzIDogW10sIGVudiA6IHthOmIsIGM6ZH19LiBCb3RoIGVudmlyb25tZW50IGFuZCBhcmd1bWVudCBjYW4gYmUgbnVsbC4gRXJyb3I6ICR7ZXJyfWApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoY2Fwcy5wcm9jZXNzQXJndW1lbnRzKSkge1xuICAgICAgICB2ZXJpZnlQcm9jZXNzQXJndW1lbnQoY2Fwcy5wcm9jZXNzQXJndW1lbnRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZy5lcnJvckFuZFRocm93KCdwcm9jZXNzQXJndW1lbnRzIG11c3QgYmUgYW4gb2JqZWN0LCBvciBhIHN0cmluZyBKU09OIG9iamVjdCB3aXRoIGZvcm1hdCB7YXJncyA6IFtdLCBlbnYgOiB7YTpiLCBjOmR9fS4gQm90aCBlbnZpcm9ubWVudCBhbmQgYXJndW1lbnQgY2FuIGJlIG51bGwuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdGhlcmUgaXMgbm8gcG9pbnQgaW4gaGF2aW5nIGBrZXljaGFpblBhdGhgIHdpdGhvdXQgYGtleWNoYWluUGFzc3dvcmRgXG4gICAgaWYgKChjYXBzLmtleWNoYWluUGF0aCAmJiAhY2Fwcy5rZXljaGFpblBhc3N3b3JkKSB8fCAoIWNhcHMua2V5Y2hhaW5QYXRoICYmIGNhcHMua2V5Y2hhaW5QYXNzd29yZCkpIHtcbiAgICAgIGxvZy5lcnJvckFuZFRocm93KGBJZiAna2V5Y2hhaW5QYXRoJyBpcyBzZXQsICdrZXljaGFpblBhc3N3b3JkJyBtdXN0IGFsc28gYmUgc2V0IChhbmQgdmljZSB2ZXJzYSkuYCk7XG4gICAgfVxuXG4gICAgaWYgKGNhcHMuYXV0b0FjY2VwdEFsZXJ0cyB8fCBjYXBzLmF1dG9EaXNtaXNzQWxlcnRzKSB7XG4gICAgICBsb2cud2FybihgVGhlIGNhcGFiaWxpdGllcyAnYXV0b0FjY2VwdEFsZXJ0cycgYW5kICdhdXRvRGlzbWlzc0FsZXJ0cycgYCArXG4gICAgICAgICAgICAgICBgZG8gbm90IHdvcmsgZm9yIFhDVUlUZXN0LWJhc2VkIHRlc3RzLiBQbGVhc2UgYWRqdXN0IHlvdXIgYCArXG4gICAgICAgICAgICAgICBgYWxlcnQgaGFuZGxpbmcgYWNjb3JkaW5nbHkuYCk7XG4gICAgfVxuXG4gICAgLy8gYHJlc2V0T25TZXNzaW9uU3RhcnRPbmx5YCBzaG91bGQgYmUgc2V0IHRvIHRydWUgYnkgZGVmYXVsdFxuICAgIHRoaXMub3B0cy5yZXNldE9uU2Vzc2lvblN0YXJ0T25seSA9ICF1dGlsLmhhc1ZhbHVlKHRoaXMub3B0cy5yZXNldE9uU2Vzc2lvblN0YXJ0T25seSkgfHwgdGhpcy5vcHRzLnJlc2V0T25TZXNzaW9uU3RhcnRPbmx5O1xuICAgIHRoaXMub3B0cy51c2VOZXdXREEgPSB1dGlsLmhhc1ZhbHVlKHRoaXMub3B0cy51c2VOZXdXREEpID8gdGhpcy5vcHRzLnVzZU5ld1dEQSA6IGZhbHNlO1xuXG4gICAgLy8gZmluYWxseSwgcmV0dXJuIHRydWUgc2luY2UgdGhlIHN1cGVyY2xhc3MgY2hlY2sgcGFzc2VkLCBhcyBkaWQgdGhpc1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYXN5bmMgaW5zdGFsbEFwcCAoKSB7XG4gICAgaWYgKHRoaXMuaXNTYWZhcmkoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBpZiB1c2VyIGhhcyBwYXNzZWQgaW4gZGVzaXJlZENhcHMuYXV0b0xhdW5jaCA9IGZhbHNlXG4gICAgLy8gbWVhbmluZyB0aGV5IHdpbGwgbWFuYWdlIGFwcCBpbnN0YWxsIC8gbGF1bmNoaW5nXG4gICAgaWYgKHRoaXMub3B0cy5hdXRvTGF1bmNoID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzUmVhbERldmljZSgpKSB7XG4gICAgICBhd2FpdCBpbnN0YWxsVG9SZWFsRGV2aWNlICh0aGlzLm9wdHMuZGV2aWNlLCB0aGlzLm9wdHMuYXBwLCB0aGlzLm9wdHMuYnVuZGxlSWQsIHRoaXMub3B0cy5ub1Jlc2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgaW5zdGFsbFRvU2ltdWxhdG9yKHRoaXMub3B0cy5kZXZpY2UsIHRoaXMub3B0cy5hcHAsIHRoaXMub3B0cy5idW5kbGVJZCwgdGhpcy5vcHRzLm5vUmVzZXQpO1xuICAgIH1cblxuICAgIGlmICh1dGlsLmhhc1ZhbHVlKHRoaXMub3B0cy5pb3NJbnN0YWxsUGF1c2UpKSB7XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXBwaXVtL2FwcGl1bS9pc3N1ZXMvNjg4OVxuICAgICAgbGV0IHBhdXNlID0gcGFyc2VJbnQodGhpcy5vcHRzLmlvc0luc3RhbGxQYXVzZSwgMTApO1xuICAgICAgbG9nLmRlYnVnKGBpb3NJbnN0YWxsUGF1c2Ugc2V0LiBQYXVzaW5nICR7cGF1c2V9IG1zIGJlZm9yZSBjb250aW51aW5nYCk7XG4gICAgICBhd2FpdCBCLmRlbGF5KHBhdXNlKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzZXRJbml0aWFsT3JpZW50YXRpb24gKG9yaWVudGF0aW9uKSB7XG4gICAgaWYgKCFfLmlzU3RyaW5nKG9yaWVudGF0aW9uKSkge1xuICAgICAgbG9nLmluZm8oJ1NraXBwaW5nIHNldHRpbmcgb2YgdGhlIGluaXRpYWwgZGlzcGxheSBvcmllbnRhdGlvbi4gJyArXG4gICAgICAgICdTZXQgdGhlIFwib3JpZW50YXRpb25cIiBjYXBhYmlsaXR5IHRvIGVpdGhlciBcIkxBTkRTQ0FQRVwiIG9yIFwiUE9SVFJBSVRcIiwgaWYgdGhpcyBpcyBhbiB1bmRlc2lyZWQgYmVoYXZpb3IuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9yaWVudGF0aW9uID0gb3JpZW50YXRpb24udG9VcHBlckNhc2UoKTtcbiAgICBpZiAoIV8uaW5jbHVkZXMoWydMQU5EU0NBUEUnLCAnUE9SVFJBSVQnXSwgb3JpZW50YXRpb24pKSB7XG4gICAgICBsb2cuZGVidWcoYFVuYWJsZSB0byBzZXQgaW5pdGlhbCBvcmllbnRhdGlvbiB0byAnJHtvcmllbnRhdGlvbn0nYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxvZy5kZWJ1ZyhgU2V0dGluZyBpbml0aWFsIG9yaWVudGF0aW9uIHRvICcke29yaWVudGF0aW9ufSdgKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoJy9vcmllbnRhdGlvbicsICdQT1NUJywge29yaWVudGF0aW9ufSk7XG4gICAgICB0aGlzLm9wdHMuY3VyT3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxvZy53YXJuKGBTZXR0aW5nIGluaXRpYWwgb3JpZW50YXRpb24gZmFpbGVkIHdpdGg6ICR7ZXJyLm1lc3NhZ2V9YCk7XG4gICAgfVxuICB9XG5cbiAgX2dldENvbW1hbmRUaW1lb3V0IChjbWROYW1lKSB7XG4gICAgdGhpcy5vcHRzLmNvbW1hbmRUaW1lb3V0cyA9IG5vcm1hbGl6ZUNvbW1hbmRUaW1lb3V0cyh0aGlzLm9wdHMuY29tbWFuZFRpbWVvdXRzKTtcbiAgICBpZiAodGhpcy5vcHRzLmNvbW1hbmRUaW1lb3V0cykge1xuICAgICAgaWYgKGNtZE5hbWUgJiYgXy5oYXModGhpcy5vcHRzLmNvbW1hbmRUaW1lb3V0cywgY21kTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0cy5jb21tYW5kVGltZW91dHNbY21kTmFtZV07XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vcHRzLmNvbW1hbmRUaW1lb3V0c1tERUZBVUxUX1RJTUVPVVRfS0VZXTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHNlc3Npb24gY2FwYWJpbGl0aWVzIG1lcmdlZCB3aXRoIHdoYXQgV0RBIHJlcG9ydHNcbiAgICogVGhpcyBpcyBhIGxpYnJhcnkgY29tbWFuZCBidXQgbmVlZHMgdG8gY2FsbCAnc3VwZXInIHNvIGNhbid0IGJlIG9uXG4gICAqIGEgaGVscGVyIG9iamVjdFxuICAgKi9cbiAgYXN5bmMgZ2V0U2Vzc2lvbiAoKSB7XG4gICAgLy8gY2FsbCBzdXBlciB0byBnZXQgZXZlbnQgdGltaW5ncywgZXRjLi4uXG4gICAgbGV0IGRyaXZlclNlc3Npb24gPSBhd2FpdCBzdXBlci5nZXRTZXNzaW9uKCk7XG4gICAgbGV0IHdkYUNhcHMgPSBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZCgnLycsICdHRVQnKTtcbiAgICBsb2cuaW5mbyhcIk1lcmdpbmcgV0RBIGNhcHMgb3ZlciBBcHBpdW0gY2FwcyBmb3Igc2Vzc2lvbiBkZXRhaWwgcmVzcG9uc2VcIik7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe3VkaWQ6IHRoaXMub3B0cy51ZGlkfSwgZHJpdmVyU2Vzc2lvbiwgd2RhQ2Fwcy5jYXBhYmlsaXRpZXMpO1xuICB9XG5cbiAgYXN5bmMgc3RhcnRJV0RQICgpIHtcbiAgICB0aGlzLmxvZ0V2ZW50KCdpd2RwU3RhcnRpbmcnKTtcbiAgICB0aGlzLml3ZHBTZXJ2ZXIgPSBuZXcgSVdEUCh0aGlzLm9wdHMud2Via2l0RGVidWdQcm94eVBvcnQsIHRoaXMub3B0cy51ZGlkKTtcbiAgICBhd2FpdCB0aGlzLml3ZHBTZXJ2ZXIuc3RhcnQoKTtcbiAgICB0aGlzLmxvZ0V2ZW50KCdpd2RwU3RhcnRlZCcpO1xuICB9XG5cbiAgYXN5bmMgc3RvcElXRFAgKCkge1xuICAgIGlmICh0aGlzLml3ZHBTZXJ2ZXIpIHtcbiAgICAgIGF3YWl0IHRoaXMuaXdkcFNlcnZlci5zdG9wKCk7XG4gICAgICBkZWxldGUgdGhpcy5pd2RwU2VydmVyO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlc2V0ICgpIHtcbiAgICBpZiAodGhpcy5vcHRzLm5vUmVzZXQpIHtcbiAgICAgIC8vIFRoaXMgaXMgdG8gbWFrZSBzdXJlIHJlc2V0IGhhcHBlbnMgZXZlbiBpZiBub1Jlc2V0IGlzIHNldCB0byB0cnVlXG4gICAgICBsZXQgb3B0cyA9IF8uY2xvbmVEZWVwKHRoaXMub3B0cyk7XG4gICAgICBvcHRzLm5vUmVzZXQgPSBmYWxzZTtcbiAgICAgIG9wdHMuZnVsbFJlc2V0ID0gZmFsc2U7XG4gICAgICBjb25zdCBzaHV0ZG93bkhhbmRsZXIgPSB0aGlzLnJlc2V0T25VbmV4cGVjdGVkU2h1dGRvd247XG4gICAgICB0aGlzLnJlc2V0T25VbmV4cGVjdGVkU2h1dGRvd24gPSAoKSA9PiB7fTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMucnVuUmVzZXQob3B0cyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLnJlc2V0T25VbmV4cGVjdGVkU2h1dGRvd24gPSBzaHV0ZG93bkhhbmRsZXI7XG4gICAgICB9XG4gICAgfVxuICAgIGF3YWl0IHN1cGVyLnJlc2V0KCk7XG4gIH1cblxufVxuXG5mb3IgKGxldCBbY21kLCBmbl0gb2YgXy50b1BhaXJzKGNvbW1hbmRzKSkge1xuICBYQ1VJVGVzdERyaXZlci5wcm90b3R5cGVbY21kXSA9IGZuO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFhDVUlUZXN0RHJpdmVyO1xuZXhwb3J0IHsgWENVSVRlc3REcml2ZXIgfTtcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4ifQ==
