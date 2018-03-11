'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _asyncbox = require('asyncbox');

var _teen_process = require('teen_process');

var _appiumSupport = require('appium-support');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _utils = require('./utils');

var _utils2 = require('../utils');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var DEFAULT_SIGNING_ID = "iPhone Developer";
var BUILD_TEST_DELAY = 1000;

var DERIVED_DATA_FOLDER_REGEXP = /(\/.+\/DerivedData\/WebDriverAgent-[^\/]+)/;
var DERIVED_DATA_LOG_REGEXP = /\s+(\/.+\/WebDriverAgentRunner-.+\/.+\.log)/;
var DERIVED_DATA_GREP_EXPRESSION = '/WebDriverAgentRunner-';

var xcodeLog = _appiumSupport.logger.getLogger('Xcode');

var XcodeBuild = (function () {
  function XcodeBuild(xcodeVersion, device) {
    var args = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, XcodeBuild);

    this.xcodeVersion = xcodeVersion;

    this.device = device;

    this.realDevice = args.realDevice;

    this.agentPath = args.agentPath;
    this.bootstrapPath = args.bootstrapPath;

    this.platformVersion = args.platformVersion;

    this.showXcodeLog = !!args.showXcodeLog;

    this.xcodeConfigFile = args.xcodeConfigFile;
    this.xcodeOrgId = args.xcodeOrgId;
    this.xcodeSigningId = args.xcodeSigningId || DEFAULT_SIGNING_ID;
    this.keychainPath = args.keychainPath;
    this.keychainPassword = args.keychainPassword;

    this.prebuildWDA = args.prebuildWDA;
    this.usePrebuiltWDA = args.usePrebuiltWDA;
    this.useSimpleBuildTest = args.useSimpleBuildTest;

    this.useXctestrunFile = args.useXctestrunFile;

    this.launchTimeout = args.launchTimeout;

    this.wdaRemotePort = args.wdaRemotePort;

    this.updatedWDABundleId = args.updatedWDABundleId;
  }

  _createClass(XcodeBuild, [{
    key: 'init',
    value: function init(noSessionProxy) {
      return _regeneratorRuntime.async(function init$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            this.noSessionProxy = noSessionProxy;

            if (!this.useXctestrunFile) {
              context$2$0.next = 7;
              break;
            }

            if (this.xcodeVersion.major <= 7) {
              _logger2['default'].errorAndThrow('useXctestrunFile can only be used with xcode version 8 onwards');
            }
            context$2$0.next = 5;
            return _regeneratorRuntime.awrap((0, _utils.setXctestrunFile)(this.realDevice, this.device.udid, this.platformVersion, this.bootstrapPath, this.wdaRemotePort));

          case 5:
            this.xctestrunFilePath = context$2$0.sent;
            return context$2$0.abrupt('return');

          case 7:
            if (!(this.xcodeVersion.major === 7 || this.xcodeVersion.major === 8 && this.xcodeVersion.minor === 0)) {
              context$2$0.next = 11;
              break;
            }

            _logger2['default'].debug('Using Xcode ' + this.xcodeVersion.versionString + ', so fixing WDA codebase');
            context$2$0.next = 11;
            return _regeneratorRuntime.awrap((0, _utils.fixForXcode7)(this.bootstrapPath, true));

          case 11:
            if (!(this.xcodeVersion.major === 9)) {
              context$2$0.next = 15;
              break;
            }

            _logger2['default'].debug('Using Xcode ' + this.xcodeVersion.versionString + ', so fixing WDA codebase');
            context$2$0.next = 15;
            return _regeneratorRuntime.awrap((0, _utils.fixForXcode9)(this.bootstrapPath, true));

          case 15:
            if (!this.realDevice) {
              context$2$0.next = 21;
              break;
            }

            context$2$0.next = 18;
            return _regeneratorRuntime.awrap((0, _utils.resetProjectFile)(this.agentPath));

          case 18:
            if (!this.updatedWDABundleId) {
              context$2$0.next = 21;
              break;
            }

            context$2$0.next = 21;
            return _regeneratorRuntime.awrap((0, _utils.updateProjectFile)(this.agentPath, this.updatedWDABundleId));

          case 21:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'retrieveDerivedDataPath',
    value: function retrieveDerivedDataPath() {
      var pid, stdout, execInfo, match, logFile, grepData;
      return _regeneratorRuntime.async(function retrieveDerivedDataPath$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!this._derivedDataPath) {
              context$2$0.next = 2;
              break;
            }

            return context$2$0.abrupt('return', this._derivedDataPath);

          case 2:
            context$2$0.next = 4;
            return _regeneratorRuntime.awrap((0, _utils2.getPidUsingPattern)('xcodebuild.*' + this.device.udid));

          case 4:
            pid = context$2$0.sent;

            if (pid) {
              context$2$0.next = 8;
              break;
            }

            _logger2['default'].debug('Cannot find xcodebuild\'s process id, so unable to retrieve DerivedData folder path');
            return context$2$0.abrupt('return');

          case 8:
            stdout = '';
            context$2$0.prev = 9;
            context$2$0.next = 12;
            return _regeneratorRuntime.awrap((0, _teen_process.exec)('lsof', ['-p', pid]));

          case 12:
            execInfo = context$2$0.sent;

            stdout = execInfo.stdout;
            context$2$0.next = 20;
            break;

          case 16:
            context$2$0.prev = 16;
            context$2$0.t0 = context$2$0['catch'](9);

            _logger2['default'].debug('Cannot get the list of files opened by xcodebuild process (pid: ' + pid + ') because of \'' + context$2$0.t0.stderr + '\'');
            return context$2$0.abrupt('return');

          case 20:
            match = DERIVED_DATA_FOLDER_REGEXP.exec(stdout);

            if (match) {
              context$2$0.next = 42;
              break;
            }

            // no match found, so try to find the log file and search inside for the derived data instead
            _logger2['default'].debug('Cannot find a match for DerivedData folder path from lsof. Trying to access logs');
            match = DERIVED_DATA_LOG_REGEXP.exec(stdout);

            if (match) {
              context$2$0.next = 27;
              break;
            }

            // still no go. We are done
            _logger2['default'].debug('Cannot find a match for xcodebuild log file. No derived data folder will be found');
            return context$2$0.abrupt('return');

          case 27:
            logFile = match[1];
            context$2$0.prev = 28;
            context$2$0.next = 31;
            return _regeneratorRuntime.awrap((0, _teen_process.exec)('grep', [DERIVED_DATA_GREP_EXPRESSION, logFile]));

          case 31:
            grepData = context$2$0.sent;

            match = DERIVED_DATA_FOLDER_REGEXP.exec(grepData.stdout);

            if (match) {
              context$2$0.next = 36;
              break;
            }

            // nothing found. We are done
            _logger2['default'].debug('Cannot find the derived data location from the xcodebuild log file \'' + logFile + '\'');
            return context$2$0.abrupt('return');

          case 36:
            context$2$0.next = 42;
            break;

          case 38:
            context$2$0.prev = 38;
            context$2$0.t1 = context$2$0['catch'](28);

            _logger2['default'].warn('Cannot grep on the the xcodebuild log file \'' + logFile + '\'. Original error: ' + context$2$0.t1.message);
            return context$2$0.abrupt('return');

          case 42:

            // at this point we have gotten a match by one of the two ways above, so save it
            this._derivedDataPath = match[1];

            return context$2$0.abrupt('return', this._derivedDataPath);

          case 44:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[9, 16], [28, 38]]);
    }
  }, {
    key: 'reset',
    value: function reset() {
      return _regeneratorRuntime.async(function reset$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!(this.realDevice && this.updatedWDABundleId)) {
              context$2$0.next = 3;
              break;
            }

            context$2$0.next = 3;
            return _regeneratorRuntime.awrap((0, _utils.resetProjectFile)(this.agentPath));

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'prebuild',
    value: function prebuild() {
      return _regeneratorRuntime.async(function prebuild$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!(this.xcodeVersion.major === 7)) {
              context$2$0.next = 3;
              break;
            }

            _logger2['default'].debug('Capability \'prebuildWDA\' set, but on xcode version ' + this.xcodeVersion.versionString + ' so skipping');
            return context$2$0.abrupt('return');

          case 3:

            // first do a build phase
            _logger2['default'].debug('Pre-building WDA before launching test');
            this.usePrebuiltWDA = true;
            context$2$0.next = 7;
            return _regeneratorRuntime.awrap(this.createSubProcess(true));

          case 7:
            this.xcodebuild = context$2$0.sent;
            context$2$0.next = 10;
            return _regeneratorRuntime.awrap(this.start(true));

          case 10:

            this.xcodebuild = null;

            // pause a moment
            context$2$0.next = 13;
            return _regeneratorRuntime.awrap(_bluebird2['default'].delay(BUILD_TEST_DELAY));

          case 13:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'getCommand',
    value: function getCommand() {
      var buildOnly = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var cmd = 'xcodebuild';
      var args = undefined;

      // figure out the targets for xcodebuild
      if (this.xcodeVersion.major < 8) {
        args = ['build', 'test'];
      } else {
        var _ref = this.useSimpleBuildTest ? ['build', 'test'] : ['build-for-testing', 'test-without-building'];

        var _ref2 = _slicedToArray(_ref, 2);

        var buildCmd = _ref2[0];
        var testCmd = _ref2[1];

        if (buildOnly) {
          args = [buildCmd];
        } else if (this.usePrebuiltWDA || this.useXctestrunFile) {
          args = [testCmd];
        } else {
          args = [buildCmd, testCmd];
        }
      }

      if (this.useXctestrunFile) {
        args.push('-xctestrun', this.xctestrunFilePath);
      } else {
        args.push('-project', this.agentPath, '-scheme', 'WebDriverAgentRunner');
      }
      args.push('-destination', 'id=' + this.device.udid);

      var versionMatch = new RegExp(/^(\d+)\.(\d+)/).exec(this.platformVersion);
      if (versionMatch) {
        args.push('IPHONEOS_DEPLOYMENT_TARGET=' + versionMatch[1] + '.' + versionMatch[2]);
      } else {
        _logger2['default'].warn('Cannot parse major and minor version numbers from platformVersion "' + this.platformVersion + '". ' + 'Will build for the default platform instead');
      }

      if (this.realDevice && this.xcodeConfigFile) {
        _logger2['default'].debug('Using Xcode configuration file: \'' + this.xcodeConfigFile + '\'');
        args.push('-xcconfig', this.xcodeConfigFile);
      }

      return { cmd: cmd, args: args };
    }
  }, {
    key: 'createSubProcess',
    value: function createSubProcess() {
      var buildOnly = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var _getCommand, cmd, args, env, xcodebuild, logXcodeOutput;

      return _regeneratorRuntime.async(function createSubProcess$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (this.useXctestrunFile) {
              context$2$0.next = 9;
              break;
            }

            if (!this.realDevice) {
              context$2$0.next = 9;
              break;
            }

            if (!(this.keychainPath && this.keychainPassword)) {
              context$2$0.next = 5;
              break;
            }

            context$2$0.next = 5;
            return _regeneratorRuntime.awrap((0, _utils.setRealDeviceSecurity)(this.keychainPath, this.keychainPassword));

          case 5:
            if (!(this.xcodeOrgId && this.xcodeSigningId && !this.xcodeConfigFile)) {
              context$2$0.next = 9;
              break;
            }

            context$2$0.next = 8;
            return _regeneratorRuntime.awrap((0, _utils.generateXcodeConfigFile)(this.xcodeOrgId, this.xcodeSigningId));

          case 8:
            this.xcodeConfigFile = context$2$0.sent;

          case 9:
            _getCommand = this.getCommand(buildOnly);
            cmd = _getCommand.cmd;
            args = _getCommand.args;

            _logger2['default'].debug('Beginning ' + (buildOnly ? 'build' : 'test') + ' with command \'' + cmd + ' ' + args.join(' ') + '\' ' + ('in directory \'' + this.bootstrapPath + '\''));
            env = {
              USE_PORT: this.wdaRemotePort
            };

            if (process.env.DEVELOPER_DIR) {
              env.DEVELOPER_DIR = process.env.DEVELOPER_DIR;
            }
            xcodebuild = new _teen_process.SubProcess(cmd, args, {
              cwd: this.bootstrapPath,
              env: env,
              detached: true,
              stdio: ['ignore', 'pipe', 'pipe']
            });
            logXcodeOutput = this.showXcodeLog;

            _logger2['default'].debug('Output from xcodebuild ' + (logXcodeOutput ? 'will' : 'will not') + ' be logged. To see xcode logging, use \'showXcodeLog\' desired capability');
            xcodebuild.on('output', function (stdout, stderr) {
              var out = stdout || stderr;
              // we want to pull out the log file that is created, and highlight it
              // for diagnostic purposes
              if (out.indexOf('Writing diagnostic log for test session to') !== -1) {
                // pull out the first line that begins with the path separator
                // which *should* be the line indicating the log file generated
                xcodebuild.logLocation = _lodash2['default'].first(_lodash2['default'].remove(out.trim().split('\n'), function (v) {
                  return v.indexOf(_path2['default'].sep) === 0;
                }));
                _logger2['default'].debug('Log file for xcodebuild test: ' + xcodebuild.logLocation);
              }

              // if we have an error we want to output the logs
              // otherwise the failure is inscrutible
              // but do not log permission errors from trying to write to attachments folder
              if (out.indexOf('Error Domain=') !== -1 && out.indexOf('Error writing attachment data to file') === -1 && out.indexOf('Failed to remove screenshot at path') === -1) {
                logXcodeOutput = true;

                // terrible hack to handle case where xcode return 0 but is failing
                xcodebuild._wda_error_occurred = true;
              }

              if (logXcodeOutput) {
                // do not log permission errors from trying to write to attachments folder
                if (out.indexOf('Error writing attachment data to file') === -1) {
                  var _iteratorNormalCompletion = true;
                  var _didIteratorError = false;
                  var _iteratorError = undefined;

                  try {
                    for (var _iterator = _getIterator(out.split('\n')), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var line = _step.value;

                      xcodeLog.info(line);
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
                }
              }
            });

            return context$2$0.abrupt('return', xcodebuild);

          case 20:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'start',
    value: function start() {
      var buildOnly = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      return _regeneratorRuntime.async(function start$(context$2$0) {
        var _this = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.createSubProcess(buildOnly));

          case 2:
            this.xcodebuild = context$2$0.sent;
            context$2$0.next = 5;
            return _regeneratorRuntime.awrap(new _bluebird2['default'](function (resolve, reject) {
              _this.xcodebuild.on('exit', function callee$3$0(code, signal) {
                var data, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, line;

                return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                  while (1) switch (context$4$0.prev = context$4$0.next) {
                    case 0:
                      _logger2['default'].info('xcodebuild exited with code \'' + code + '\' and signal \'' + signal + '\'');
                      // print out the xcodebuild file if users have asked for it

                      if (!(this.showXcodeLog && this.xcodebuild.logLocation)) {
                        context$4$0.next = 31;
                        break;
                      }

                      xcodeLog.info('Contents of xcodebuild log file \'' + this.xcodebuild.logLocation + '\':');
                      context$4$0.prev = 3;
                      context$4$0.next = 6;
                      return _regeneratorRuntime.awrap(_appiumSupport.fs.readFile(this.xcodebuild.logLocation, 'utf-8'));

                    case 6:
                      data = context$4$0.sent;
                      _iteratorNormalCompletion2 = true;
                      _didIteratorError2 = false;
                      _iteratorError2 = undefined;
                      context$4$0.prev = 10;

                      for (_iterator2 = _getIterator(data.split('\n')); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        line = _step2.value;

                        xcodeLog.info(line);
                      }
                      context$4$0.next = 18;
                      break;

                    case 14:
                      context$4$0.prev = 14;
                      context$4$0.t0 = context$4$0['catch'](10);
                      _didIteratorError2 = true;
                      _iteratorError2 = context$4$0.t0;

                    case 18:
                      context$4$0.prev = 18;
                      context$4$0.prev = 19;

                      if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                        _iterator2['return']();
                      }

                    case 21:
                      context$4$0.prev = 21;

                      if (!_didIteratorError2) {
                        context$4$0.next = 24;
                        break;
                      }

                      throw _iteratorError2;

                    case 24:
                      return context$4$0.finish(21);

                    case 25:
                      return context$4$0.finish(18);

                    case 26:
                      context$4$0.next = 31;
                      break;

                    case 28:
                      context$4$0.prev = 28;
                      context$4$0.t1 = context$4$0['catch'](3);

                      _logger2['default'].debug('Unable to access xcodebuild log file: \'' + context$4$0.t1.message + '\'');

                    case 31:
                      this.xcodebuild.processExited = true;

                      if (!(this.xcodebuild._wda_error_occurred || !signal && code !== 0)) {
                        context$4$0.next = 34;
                        break;
                      }

                      return context$4$0.abrupt('return', reject(new Error('xcodebuild failed with code ' + code)));

                    case 34:
                      if (!buildOnly) {
                        context$4$0.next = 36;
                        break;
                      }

                      return context$4$0.abrupt('return', resolve());

                    case 36:
                    case 'end':
                      return context$4$0.stop();
                  }
                }, null, _this, [[3, 28], [10, 14, 18, 26], [19,, 21, 25]]);
              });

              return (function callee$3$0() {
                var startTime, _status, msg;

                return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                  while (1) switch (context$4$0.prev = context$4$0.next) {
                    case 0:
                      context$4$0.prev = 0;
                      startTime = process.hrtime();
                      context$4$0.next = 4;
                      return _regeneratorRuntime.awrap(this.xcodebuild.start());

                    case 4:
                      this.xcodebuild.proc.unref();

                      if (buildOnly) {
                        context$4$0.next = 10;
                        break;
                      }

                      context$4$0.next = 8;
                      return _regeneratorRuntime.awrap(this.waitForStart(startTime));

                    case 8:
                      _status = context$4$0.sent;

                      resolve(_status);

                    case 10:
                      context$4$0.next = 17;
                      break;

                    case 12:
                      context$4$0.prev = 12;
                      context$4$0.t0 = context$4$0['catch'](0);
                      msg = 'Unable to start WebDriverAgent: ' + context$4$0.t0;

                      _logger2['default'].error(msg);
                      reject(new Error(msg));

                    case 17:
                    case 'end':
                      return context$4$0.stop();
                  }
                }, null, _this, [[0, 12]]);
              })();
            }));

          case 5:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 6:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'waitForStart',
    value: function waitForStart(startTime) {
      var currentStatus, retries, endTime, startupTime;
      return _regeneratorRuntime.async(function waitForStart$(context$2$0) {
        var _this2 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            // try to connect once every 0.5 seconds, until `launchTimeout` is up
            _logger2['default'].debug('Waiting up to ' + this.launchTimeout + 'ms for WebDriverAgent to start');
            currentStatus = null;
            context$2$0.prev = 2;
            retries = parseInt(this.launchTimeout / 500, 10);
            context$2$0.next = 6;
            return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(retries, 500, function callee$2$0() {
              var proxyTimeout;
              return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    if (!this.xcodebuild.processExited) {
                      context$3$0.next = 2;
                      break;
                    }

                    return context$3$0.abrupt('return');

                  case 2:
                    proxyTimeout = this.noSessionProxy.timeout;

                    this.noSessionProxy.timeout = 1000;
                    context$3$0.prev = 4;
                    context$3$0.next = 7;
                    return _regeneratorRuntime.awrap(this.noSessionProxy.command('/status', 'GET'));

                  case 7:
                    currentStatus = context$3$0.sent;

                    if (currentStatus && currentStatus.ios && currentStatus.ios.ip) {
                      this.agentUrl = currentStatus.ios.ip;
                      _logger2['default'].debug('WebDriverAgent running on ip \'' + this.agentUrl + '\'');
                    }
                    context$3$0.next = 14;
                    break;

                  case 11:
                    context$3$0.prev = 11;
                    context$3$0.t0 = context$3$0['catch'](4);
                    throw new Error('Unable to connect to running WebDriverAgent: ' + context$3$0.t0.message);

                  case 14:
                    context$3$0.prev = 14;

                    this.noSessionProxy.timeout = proxyTimeout;
                    return context$3$0.finish(14);

                  case 17:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this2, [[4, 11, 14, 17]]);
            }));

          case 6:
            if (!this.xcodebuild.processExited) {
              context$2$0.next = 8;
              break;
            }

            return context$2$0.abrupt('return', currentStatus);

          case 8:
            endTime = process.hrtime(startTime);
            startupTime = parseInt((endTime[0] * 1e9 + endTime[1]) / 1e6, 10);

            _logger2['default'].debug('WebDriverAgent successfully started after ' + startupTime + 'ms');
            context$2$0.next = 17;
            break;

          case 13:
            context$2$0.prev = 13;
            context$2$0.t0 = context$2$0['catch'](2);

            // at this point, if we have not had any errors from xcode itself (reported
            // elsewhere), we can let this go through and try to create the session
            _logger2['default'].debug(context$2$0.t0.message);
            _logger2['default'].warn('Getting status of WebDriverAgent on device timed out. Continuing');

          case 17:
            return context$2$0.abrupt('return', currentStatus);

          case 18:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[2, 13]]);
    }
  }, {
    key: 'quit',
    value: function quit() {
      return _regeneratorRuntime.async(function quit$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap((0, _utils.killProcess)('xcodebuild', this.xcodebuild));

          case 2:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return XcodeBuild;
})();

exports.XcodeBuild = XcodeBuild;
exports['default'] = XcodeBuild;

// if necessary, update the bundleId to user's specification

// In case the project still has the user specific bundle ID, reset the project file first.
// - We do this reset even if updatedWDABundleId is not specified,
//   since the previous updatedWDABundleId test has generated the user specific bundle ID project file.
// - We don't call resetProjectFile for simulator,
//   since simulator test run will work with any user specific bundle ID.

// try a number of ways to find the derived data folder for this run

// try to find a derived data folder open by xcodebuild

// now parse the log file for the derived data folder

// grep on the log file, since it might be too big to fit it completely into the memory

// if necessary, reset the bundleId to original value

// wrap the start procedure in a promise so that we can catch, and report,
// any startup errors that are thrown as events

// in the case of just building, the process will exit and that is our finish

// there has been an error elsewhere and we need to short-circuit

// there has been an error elsewhere and we need to short-circuit

// must get [s, ns] array into ms
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi93ZGEveGNvZGVidWlsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBQThCLFVBQVU7OzRCQUNQLGNBQWM7OzZCQUNwQixnQkFBZ0I7O3NCQUMzQixXQUFXOzs7O3dCQUNiLFVBQVU7Ozs7cUJBRTJELFNBQVM7O3NCQUN6RCxVQUFVOztzQkFDL0IsUUFBUTs7OztvQkFDTCxNQUFNOzs7O0FBR3ZCLElBQU0sa0JBQWtCLEdBQUcsa0JBQWtCLENBQUM7QUFDOUMsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7O0FBRTlCLElBQU0sMEJBQTBCLEdBQUcsNENBQTRDLENBQUM7QUFDaEYsSUFBTSx1QkFBdUIsR0FBRyw2Q0FBNkMsQ0FBQztBQUM5RSxJQUFNLDRCQUE0QixHQUFHLHdCQUF3QixDQUFDOztBQUU5RCxJQUFNLFFBQVEsR0FBRyxzQkFBTyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7O0lBR3JDLFVBQVU7QUFDRixXQURSLFVBQVUsQ0FDRCxZQUFZLEVBQUUsTUFBTSxFQUFhO1FBQVgsSUFBSSx5REFBRyxFQUFFOzswQkFEeEMsVUFBVTs7QUFFWixRQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQzs7QUFFakMsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7QUFFbEMsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ2hDLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQzs7QUFFeEMsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDOztBQUU1QyxRQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDOztBQUV4QyxRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7QUFDNUMsUUFB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Q0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO0FBQzlELDBCQUFJLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ3JDLDBDQUFJLEtBQUsscUNBQWtDLElBQUksQ0FBQyxRQUFRLFFBQUksQ0FBQztxQkFDOUQ7Ozs7Ozs7MEJBRUssSUFBSSxLQUFLLG1EQUFpRCxlQUFJLE9BQU8sQ0FBRzs7Ozs7QUFFOUUsd0JBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQzs7Ozs7Ozs7YUFFOUMsQ0FBQzs7O2lCQUVFLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYTs7Ozs7Z0RBRXhCLGFBQWE7OztBQUdsQixtQkFBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBRW5DLHVCQUFXLEdBQUcsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUEsR0FBSSxHQUFHLEVBQUUsRUFBRSxDQUFDOztBQUNyRSxnQ0FBSSxLQUFLLGdEQUE4QyxXQUFXLFFBQUssQ0FBQzs7Ozs7Ozs7OztBQUl4RSxnQ0FBSSxLQUFLLENBQUMsZUFBSSxPQUFPLENBQUMsQ0FBQztBQUN2QixnQ0FBSSxJQUFJLG9FQUFvRSxDQUFDOzs7Z0RBRXhFLGFBQWE7Ozs7Ozs7S0FDckI7OztXQUVVOzs7Ozs2Q0FDSCx3QkFBWSxZQUFZLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7Ozs7OztLQUNqRDs7O1NBL1ZHLFVBQVU7OztRQWtXUCxVQUFVLEdBQVYsVUFBVTtxQkFDSixVQUFVIiwiZmlsZSI6ImxpYi93ZGEveGNvZGVidWlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJldHJ5SW50ZXJ2YWwgfSBmcm9tICdhc3luY2JveCc7XG5pbXBvcnQgeyBTdWJQcm9jZXNzLCBleGVjIH0gZnJvbSAndGVlbl9wcm9jZXNzJztcbmltcG9ydCB7IGZzLCBsb2dnZXIgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5pbXBvcnQgbG9nIGZyb20gJy4uL2xvZ2dlcic7XG5pbXBvcnQgQiBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBmaXhGb3JYY29kZTcsIGZpeEZvclhjb2RlOSwgc2V0UmVhbERldmljZVNlY3VyaXR5LCBnZW5lcmF0ZVhjb2RlQ29uZmlnRmlsZSxcbiAgICAgICAgIHNldFhjdGVzdHJ1bkZpbGUsIHVwZGF0ZVByb2plY3RGaWxlLCByZXNldFByb2plY3RGaWxlLCBraWxsUHJvY2VzcyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgZ2V0UGlkVXNpbmdQYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5cbmNvbnN0IERFRkFVTFRfU0lHTklOR19JRCA9IFwiaVBob25lIERldmVsb3BlclwiO1xuY29uc3QgQlVJTERfVEVTVF9ERUxBWSA9IDEwMDA7XG5cbmNvbnN0IERFUklWRURfREFUQV9GT0xERVJfUkVHRVhQID0gLyhcXC8uK1xcL0Rlcml2ZWREYXRhXFwvV2ViRHJpdmVyQWdlbnQtW15cXC9dKykvO1xuY29uc3QgREVSSVZFRF9EQVRBX0xPR19SRUdFWFAgPSAvXFxzKyhcXC8uK1xcL1dlYkRyaXZlckFnZW50UnVubmVyLS4rXFwvLitcXC5sb2cpLztcbmNvbnN0IERFUklWRURfREFUQV9HUkVQX0VYUFJFU1NJT04gPSAnL1dlYkRyaXZlckFnZW50UnVubmVyLSc7XG5cbmNvbnN0IHhjb2RlTG9nID0gbG9nZ2VyLmdldExvZ2dlcignWGNvZGUnKTtcblxuXG5jbGFzcyBYY29kZUJ1aWxkIHtcbiAgY29uc3RydWN0b3IgKHhjb2RlVmVyc2lvbiwgZGV2aWNlLCBhcmdzID0ge30pIHtcbiAgICB0aGlzLnhjb2RlVmVyc2lvbiA9IHhjb2RlVmVyc2lvbjtcblxuICAgIHRoaXMuZGV2aWNlID0gZGV2aWNlO1xuXG4gICAgdGhpcy5yZWFsRGV2aWNlID0gYXJncy5yZWFsRGV2aWNlO1xuXG4gICAgdGhpcy5hZ2VudFBhdGggPSBhcmdzLmFnZW50UGF0aDtcbiAgICB0aGlzLmJvb3RzdHJhcFBhdGggPSBhcmdzLmJvb3RzdHJhcFBhdGg7XG5cbiAgICB0aGlzLnBsYXRmb3JtVmVyc2lvbiA9IGFyZ3MucGxhdGZvcm1WZXJzaW9uO1xuXG4gICAgdGhpcy5zaG93WGNvZGVMb2cgPSAhIWFyZ3Muc2hvd1hjb2RlTG9nO1xuXG4gICAgdGhpcy54Y29kZUNvbmZpZ0ZpbGUgPSBhcmdzLnhjb2RlQ29uZmlnRmlsZTtcbiAgICB0aGlzLnhjb2RlT3JnSWQgPSBhcmdzLnhjb2RlT3JnSWQ7XG4gICAgdGhpcy54Y29kZVNpZ25pbmdJZCA9IGFyZ3MueGNvZGVTaWduaW5nSWQgfHwgREVGQVVMVF9TSUdOSU5HX0lEO1xuICAgIHRoaXMua2V5Y2hhaW5QYXRoID0gYXJncy5rZXljaGFpblBhdGg7XG4gICAgdGhpcy5rZXljaGFpblBhc3N3b3JkID0gYXJncy5rZXljaGFpblBhc3N3b3JkO1xuXG4gICAgdGhpcy5wcmVidWlsZFdEQSA9IGFyZ3MucHJlYnVpbGRXREE7XG4gICAgdGhpcy51c2VQcmVidWlsdFdEQSA9IGFyZ3MudXNlUHJlYnVpbHRXREE7XG4gICAgdGhpcy51c2VTaW1wbGVCdWlsZFRlc3QgPSBhcmdzLnVzZVNpbXBsZUJ1aWxkVGVzdDtcblxuICAgIHRoaXMudXNlWGN0ZXN0cnVuRmlsZSA9IGFyZ3MudXNlWGN0ZXN0cnVuRmlsZTtcblxuICAgIHRoaXMubGF1bmNoVGltZW91dCA9IGFyZ3MubGF1bmNoVGltZW91dDtcblxuICAgIHRoaXMud2RhUmVtb3RlUG9ydCA9IGFyZ3Mud2RhUmVtb3RlUG9ydDtcblxuICAgIHRoaXMudXBkYXRlZFdEQUJ1bmRsZUlkID0gYXJncy51cGRhdGVkV0RBQnVuZGxlSWQ7XG4gIH1cblxuICBhc3luYyBpbml0IChub1Nlc3Npb25Qcm94eSkge1xuICAgIHRoaXMubm9TZXNzaW9uUHJveHkgPSBub1Nlc3Npb25Qcm94eTtcblxuICAgIGlmICh0aGlzLnVzZVhjdGVzdHJ1bkZpbGUpIHtcbiAgICAgIGlmICh0aGlzLnhjb2RlVmVyc2lvbi5tYWpvciA8PSA3KSB7XG4gICAgICAgIGxvZy5lcnJvckFuZFRocm93KCd1c2VYY3Rlc3RydW5GaWxlIGNhbiBvbmx5IGJlIHVzZWQgd2l0aCB4Y29kZSB2ZXJzaW9uIDggb253YXJkcycpO1xuICAgICAgfVxuICAgICAgdGhpcy54Y3Rlc3RydW5GaWxlUGF0aCA9IGF3YWl0IHNldFhjdGVzdHJ1bkZpbGUodGhpcy5yZWFsRGV2aWNlLCB0aGlzLmRldmljZS51ZGlkLCB0aGlzLnBsYXRmb3JtVmVyc2lvbiwgdGhpcy5ib290c3RyYXBQYXRoLCB0aGlzLndkYVJlbW90ZVBvcnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnhjb2RlVmVyc2lvbi5tYWpvciA9PT0gNyB8fCAodGhpcy54Y29kZVZlcnNpb24ubWFqb3IgPT09IDggJiYgdGhpcy54Y29kZVZlcnNpb24ubWlub3IgPT09IDApKSB7XG4gICAgICBsb2cuZGVidWcoYFVzaW5nIFhjb2RlICR7dGhpcy54Y29kZVZlcnNpb24udmVyc2lvblN0cmluZ30sIHNvIGZpeGluZyBXREEgY29kZWJhc2VgKTtcbiAgICAgIGF3YWl0IGZpeEZvclhjb2RlNyh0aGlzLmJvb3RzdHJhcFBhdGgsIHRydWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnhjb2RlVmVyc2lvbi5tYWpvciA9PT0gOSkge1xuICAgICAgbG9nLmRlYnVnKGBVc2luZyBYY29kZSAke3RoaXMueGNvZGVWZXJzaW9uLnZlcnNpb25TdHJpbmd9LCBzbyBmaXhpbmcgV0RBIGNvZGViYXNlYCk7XG4gICAgICBhd2FpdCBmaXhGb3JYY29kZTkodGhpcy5ib290c3RyYXBQYXRoLCB0cnVlKTtcbiAgICB9XG5cbiAgICAvLyBpZiBuZWNlc3NhcnksIHVwZGF0ZSB0aGUgYnVuZGxlSWQgdG8gdXNlcidzIHNwZWNpZmljYXRpb25cbiAgICBpZiAodGhpcy5yZWFsRGV2aWNlKSB7XG4gICAgICAvLyBJbiBjYXNlIHRoZSBwcm9qZWN0IHN0aWxsIGhhcyB0aGUgdXNlciBzcGVjaWZpYyBidW5kbGUgSUQsIHJlc2V0IHRoZSBwcm9qZWN0IGZpbGUgZmlyc3QuXG4gICAgICAvLyAtIFdlIGRvIHRoaXMgcmVzZXQgZXZlbiBpZiB1cGRhdGVkV0RBQnVuZGxlSWQgaXMgbm90IHNwZWNpZmllZCxcbiAgICAgIC8vICAgc2luY2UgdGhlIHByZXZpb3VzIHVwZGF0ZWRXREFCdW5kbGVJZCB0ZXN0IGhhcyBnZW5lcmF0ZWQgdGhlIHVzZXIgc3BlY2lmaWMgYnVuZGxlIElEIHByb2plY3QgZmlsZS5cbiAgICAgIC8vIC0gV2UgZG9uJ3QgY2FsbCByZXNldFByb2plY3RGaWxlIGZvciBzaW11bGF0b3IsXG4gICAgICAvLyAgIHNpbmNlIHNpbXVsYXRvciB0ZXN0IHJ1biB3aWxsIHdvcmsgd2l0aCBhbnkgdXNlciBzcGVjaWZpYyBidW5kbGUgSUQuXG4gICAgICBhd2FpdCByZXNldFByb2plY3RGaWxlKHRoaXMuYWdlbnRQYXRoKTtcbiAgICAgIGlmICh0aGlzLnVwZGF0ZWRXREFCdW5kbGVJZCkge1xuICAgICAgICBhd2FpdCB1cGRhdGVQcm9qZWN0RmlsZSh0aGlzLmFnZW50UGF0aCwgdGhpcy51cGRhdGVkV0RBQnVuZGxlSWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJldHJpZXZlRGVyaXZlZERhdGFQYXRoICgpIHtcbiAgICBpZiAodGhpcy5fZGVyaXZlZERhdGFQYXRoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGVyaXZlZERhdGFQYXRoO1xuICAgIH1cblxuICAgIC8vIHRyeSBhIG51bWJlciBvZiB3YXlzIHRvIGZpbmQgdGhlIGRlcml2ZWQgZGF0YSBmb2xkZXIgZm9yIHRoaXMgcnVuXG4gICAgY29uc3QgcGlkID0gYXdhaXQgZ2V0UGlkVXNpbmdQYXR0ZXJuKGB4Y29kZWJ1aWxkLioke3RoaXMuZGV2aWNlLnVkaWR9YCk7XG4gICAgaWYgKCFwaWQpIHtcbiAgICAgIGxvZy5kZWJ1ZyhgQ2Fubm90IGZpbmQgeGNvZGVidWlsZCdzIHByb2Nlc3MgaWQsIHNvIHVuYWJsZSB0byByZXRyaWV2ZSBEZXJpdmVkRGF0YSBmb2xkZXIgcGF0aGApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgc3Rkb3V0ID0gJyc7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGV4ZWNJbmZvID0gYXdhaXQgZXhlYygnbHNvZicsIFsnLXAnLCBwaWRdKTtcbiAgICAgIHN0ZG91dCA9IGV4ZWNJbmZvLnN0ZG91dDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxvZy5kZWJ1ZyhgQ2Fubm90IGdldCB0aGUgbGlzdCBvZiBmaWxlcyBvcGVuZWQgYnkgeGNvZGVidWlsZCBwcm9jZXNzIChwaWQ6ICR7cGlkfSkgYmVjYXVzZSBvZiAnJHtlcnIuc3RkZXJyfSdgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gdHJ5IHRvIGZpbmQgYSBkZXJpdmVkIGRhdGEgZm9sZGVyIG9wZW4gYnkgeGNvZGVidWlsZFxuICAgIGxldCBtYXRjaCA9IERFUklWRURfREFUQV9GT0xERVJfUkVHRVhQLmV4ZWMoc3Rkb3V0KTtcbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAvLyBubyBtYXRjaCBmb3VuZCwgc28gdHJ5IHRvIGZpbmQgdGhlIGxvZyBmaWxlIGFuZCBzZWFyY2ggaW5zaWRlIGZvciB0aGUgZGVyaXZlZCBkYXRhIGluc3RlYWRcbiAgICAgIGxvZy5kZWJ1ZyhgQ2Fubm90IGZpbmQgYSBtYXRjaCBmb3IgRGVyaXZlZERhdGEgZm9sZGVyIHBhdGggZnJvbSBsc29mLiBUcnlpbmcgdG8gYWNjZXNzIGxvZ3NgKTtcbiAgICAgIG1hdGNoID0gREVSSVZFRF9EQVRBX0xPR19SRUdFWFAuZXhlYyhzdGRvdXQpO1xuICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAvLyBzdGlsbCBubyBnby4gV2UgYXJlIGRvbmVcbiAgICAgICAgbG9nLmRlYnVnKGBDYW5ub3QgZmluZCBhIG1hdGNoIGZvciB4Y29kZWJ1aWxkIGxvZyBmaWxlLiBObyBkZXJpdmVkIGRhdGEgZm9sZGVyIHdpbGwgYmUgZm91bmRgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gbm93IHBhcnNlIHRoZSBsb2cgZmlsZSBmb3IgdGhlIGRlcml2ZWQgZGF0YSBmb2xkZXJcbiAgICAgIGNvbnN0IGxvZ0ZpbGUgPSBtYXRjaFsxXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIGdyZXAgb24gdGhlIGxvZyBmaWxlLCBzaW5jZSBpdCBtaWdodCBiZSB0b28gYmlnIHRvIGZpdCBpdCBjb21wbGV0ZWx5IGludG8gdGhlIG1lbW9yeVxuICAgICAgICBjb25zdCBncmVwRGF0YSA9IGF3YWl0IGV4ZWMoJ2dyZXAnLCBbREVSSVZFRF9EQVRBX0dSRVBfRVhQUkVTU0lPTiwgbG9nRmlsZV0pO1xuICAgICAgICBtYXRjaCA9IERFUklWRURfREFUQV9GT0xERVJfUkVHRVhQLmV4ZWMoZ3JlcERhdGEuc3Rkb3V0KTtcbiAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgIC8vIG5vdGhpbmcgZm91bmQuIFdlIGFyZSBkb25lXG4gICAgICAgICAgbG9nLmRlYnVnKGBDYW5ub3QgZmluZCB0aGUgZGVyaXZlZCBkYXRhIGxvY2F0aW9uIGZyb20gdGhlIHhjb2RlYnVpbGQgbG9nIGZpbGUgJyR7bG9nRmlsZX0nYCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZy53YXJuKGBDYW5ub3QgZ3JlcCBvbiB0aGUgdGhlIHhjb2RlYnVpbGQgbG9nIGZpbGUgJyR7bG9nRmlsZX0nLiBPcmlnaW5hbCBlcnJvcjogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBhdCB0aGlzIHBvaW50IHdlIGhhdmUgZ290dGVuIGEgbWF0Y2ggYnkgb25lIG9mIHRoZSB0d28gd2F5cyBhYm92ZSwgc28gc2F2ZSBpdFxuICAgIHRoaXMuX2Rlcml2ZWREYXRhUGF0aCA9IG1hdGNoWzFdO1xuXG4gICAgcmV0dXJuIHRoaXMuX2Rlcml2ZWREYXRhUGF0aDtcbiAgfVxuXG4gIGFzeW5jIHJlc2V0ICgpIHtcbiAgICAvLyBpZiBuZWNlc3NhcnksIHJlc2V0IHRoZSBidW5kbGVJZCB0byBvcmlnaW5hbCB2YWx1ZVxuICAgIGlmICh0aGlzLnJlYWxEZXZpY2UgJiYgdGhpcy51cGRhdGVkV0RBQnVuZGxlSWQpIHtcbiAgICAgIGF3YWl0IHJlc2V0UHJvamVjdEZpbGUodGhpcy5hZ2VudFBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHByZWJ1aWxkICgpIHtcbiAgICBpZiAodGhpcy54Y29kZVZlcnNpb24ubWFqb3IgPT09IDcpIHtcbiAgICAgIGxvZy5kZWJ1ZyhgQ2FwYWJpbGl0eSAncHJlYnVpbGRXREEnIHNldCwgYnV0IG9uIHhjb2RlIHZlcnNpb24gJHt0aGlzLnhjb2RlVmVyc2lvbi52ZXJzaW9uU3RyaW5nfSBzbyBza2lwcGluZ2ApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGZpcnN0IGRvIGEgYnVpbGQgcGhhc2VcbiAgICBsb2cuZGVidWcoJ1ByZS1idWlsZGluZyBXREEgYmVmb3JlIGxhdW5jaGluZyB0ZXN0Jyk7XG4gICAgdGhpcy51c2VQcmVidWlsdFdEQSA9IHRydWU7XG4gICAgdGhpcy54Y29kZWJ1aWxkID0gYXdhaXQgdGhpcy5jcmVhdGVTdWJQcm9jZXNzKHRydWUpO1xuICAgIGF3YWl0IHRoaXMuc3RhcnQodHJ1ZSk7XG5cbiAgICB0aGlzLnhjb2RlYnVpbGQgPSBudWxsO1xuXG4gICAgLy8gcGF1c2UgYSBtb21lbnRcbiAgICBhd2FpdCBCLmRlbGF5KEJVSUxEX1RFU1RfREVMQVkpO1xuICB9XG5cbiAgZ2V0Q29tbWFuZCAoYnVpbGRPbmx5ID0gZmFsc2UpIHtcbiAgICBsZXQgY21kID0gJ3hjb2RlYnVpbGQnO1xuICAgIGxldCBhcmdzO1xuXG4gICAgLy8gZmlndXJlIG91dCB0aGUgdGFyZ2V0cyBmb3IgeGNvZGVidWlsZFxuICAgIGlmICh0aGlzLnhjb2RlVmVyc2lvbi5tYWpvciA8IDgpIHtcbiAgICAgIGFyZ3MgPVtcbiAgICAgICAgJ2J1aWxkJyxcbiAgICAgICAgJ3Rlc3QnLFxuICAgICAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IFtidWlsZENtZCwgdGVzdENtZF0gPSB0aGlzLnVzZVNpbXBsZUJ1aWxkVGVzdCA/IFsnYnVpbGQnLCAndGVzdCddIDogWydidWlsZC1mb3ItdGVzdGluZycsICd0ZXN0LXdpdGhvdXQtYnVpbGRpbmcnXTtcbiAgICAgIGlmIChidWlsZE9ubHkpIHtcbiAgICAgICAgYXJncyA9IFtidWlsZENtZF07XG4gICAgICB9IGVsc2UgaWYgKHRoaXMudXNlUHJlYnVpbHRXREEgfHwgdGhpcy51c2VYY3Rlc3RydW5GaWxlKSB7XG4gICAgICAgIGFyZ3MgPSBbdGVzdENtZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcmdzID0gW2J1aWxkQ21kLCB0ZXN0Q21kXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy51c2VYY3Rlc3RydW5GaWxlKSB7XG4gICAgICBhcmdzLnB1c2goJy14Y3Rlc3RydW4nLCB0aGlzLnhjdGVzdHJ1bkZpbGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKCctcHJvamVjdCcsIHRoaXMuYWdlbnRQYXRoLCAnLXNjaGVtZScsICdXZWJEcml2ZXJBZ2VudFJ1bm5lcicpO1xuICAgIH1cbiAgICBhcmdzLnB1c2goJy1kZXN0aW5hdGlvbicsIGBpZD0ke3RoaXMuZGV2aWNlLnVkaWR9YCk7XG5cbiAgICBjb25zdCB2ZXJzaW9uTWF0Y2ggPSBuZXcgUmVnRXhwKC9eKFxcZCspXFwuKFxcZCspLykuZXhlYyh0aGlzLnBsYXRmb3JtVmVyc2lvbik7XG4gICAgaWYgKHZlcnNpb25NYXRjaCkge1xuICAgICAgYXJncy5wdXNoKGBJUEhPTkVPU19ERVBMT1lNRU5UX1RBUkdFVD0ke3ZlcnNpb25NYXRjaFsxXX0uJHt2ZXJzaW9uTWF0Y2hbMl19YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy53YXJuKGBDYW5ub3QgcGFyc2UgbWFqb3IgYW5kIG1pbm9yIHZlcnNpb24gbnVtYmVycyBmcm9tIHBsYXRmb3JtVmVyc2lvbiBcIiR7dGhpcy5wbGF0Zm9ybVZlcnNpb259XCIuIGAgK1xuICAgICAgICAgICAgICAgJ1dpbGwgYnVpbGQgZm9yIHRoZSBkZWZhdWx0IHBsYXRmb3JtIGluc3RlYWQnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWFsRGV2aWNlICYmIHRoaXMueGNvZGVDb25maWdGaWxlKSB7XG4gICAgICBsb2cuZGVidWcoYFVzaW5nIFhjb2RlIGNvbmZpZ3VyYXRpb24gZmlsZTogJyR7dGhpcy54Y29kZUNvbmZpZ0ZpbGV9J2ApO1xuICAgICAgYXJncy5wdXNoKCcteGNjb25maWcnLCB0aGlzLnhjb2RlQ29uZmlnRmlsZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtjbWQsIGFyZ3N9O1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlU3ViUHJvY2VzcyAoYnVpbGRPbmx5ID0gZmFsc2UpIHtcbiAgICBpZiAoIXRoaXMudXNlWGN0ZXN0cnVuRmlsZSkge1xuICAgICAgaWYgKHRoaXMucmVhbERldmljZSkge1xuICAgICAgICBpZiAodGhpcy5rZXljaGFpblBhdGggJiYgdGhpcy5rZXljaGFpblBhc3N3b3JkKSB7XG4gICAgICAgICAgYXdhaXQgc2V0UmVhbERldmljZVNlY3VyaXR5KHRoaXMua2V5Y2hhaW5QYXRoLCB0aGlzLmtleWNoYWluUGFzc3dvcmQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnhjb2RlT3JnSWQgJiYgdGhpcy54Y29kZVNpZ25pbmdJZCAmJiAhdGhpcy54Y29kZUNvbmZpZ0ZpbGUpIHtcbiAgICAgICAgICB0aGlzLnhjb2RlQ29uZmlnRmlsZSA9IGF3YWl0IGdlbmVyYXRlWGNvZGVDb25maWdGaWxlKHRoaXMueGNvZGVPcmdJZCwgdGhpcy54Y29kZVNpZ25pbmdJZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQge2NtZCwgYXJnc30gPSB0aGlzLmdldENvbW1hbmQoYnVpbGRPbmx5KTtcbiAgICBsb2cuZGVidWcoYEJlZ2lubmluZyAke2J1aWxkT25seSA/ICdidWlsZCcgOiAndGVzdCd9IHdpdGggY29tbWFuZCAnJHtjbWR9ICR7YXJncy5qb2luKCcgJyl9JyBgICtcbiAgICAgICAgICAgICAgYGluIGRpcmVjdG9yeSAnJHt0aGlzLmJvb3RzdHJhcFBhdGh9J2ApO1xuICAgIGNvbnN0IGVudiA9IHtcbiAgICAgIFVTRV9QT1JUOiB0aGlzLndkYVJlbW90ZVBvcnQsXG4gICAgfTtcbiAgICBpZiAocHJvY2Vzcy5lbnYuREVWRUxPUEVSX0RJUikge1xuICAgICAgZW52LkRFVkVMT1BFUl9ESVIgPSBwcm9jZXNzLmVudi5ERVZFTE9QRVJfRElSO1xuICAgIH1cbiAgICBsZXQgeGNvZGVidWlsZCA9IG5ldyBTdWJQcm9jZXNzKGNtZCwgYXJncywge1xuICAgICAgY3dkOiB0aGlzLmJvb3RzdHJhcFBhdGgsXG4gICAgICBlbnYsXG4gICAgICBkZXRhY2hlZDogdHJ1ZSxcbiAgICAgIHN0ZGlvOiBbJ2lnbm9yZScsICdwaXBlJywgJ3BpcGUnXSxcbiAgICB9KTtcblxuICAgIGxldCBsb2dYY29kZU91dHB1dCA9IHRoaXMuc2hvd1hjb2RlTG9nO1xuICAgIGxvZy5kZWJ1ZyhgT3V0cHV0IGZyb20geGNvZGVidWlsZCAke2xvZ1hjb2RlT3V0cHV0ID8gJ3dpbGwnIDogJ3dpbGwgbm90J30gYmUgbG9nZ2VkLiBUbyBzZWUgeGNvZGUgbG9nZ2luZywgdXNlICdzaG93WGNvZGVMb2cnIGRlc2lyZWQgY2FwYWJpbGl0eWApO1xuICAgIHhjb2RlYnVpbGQub24oJ291dHB1dCcsIChzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgbGV0IG91dCA9IHN0ZG91dCB8fCBzdGRlcnI7XG4gICAgICAvLyB3ZSB3YW50IHRvIHB1bGwgb3V0IHRoZSBsb2cgZmlsZSB0aGF0IGlzIGNyZWF0ZWQsIGFuZCBoaWdobGlnaHQgaXRcbiAgICAgIC8vIGZvciBkaWFnbm9zdGljIHB1cnBvc2VzXG4gICAgICBpZiAob3V0LmluZGV4T2YoJ1dyaXRpbmcgZGlhZ25vc3RpYyBsb2cgZm9yIHRlc3Qgc2Vzc2lvbiB0bycpICE9PSAtMSkge1xuICAgICAgICAvLyBwdWxsIG91dCB0aGUgZmlyc3QgbGluZSB0aGF0IGJlZ2lucyB3aXRoIHRoZSBwYXRoIHNlcGFyYXRvclxuICAgICAgICAvLyB3aGljaCAqc2hvdWxkKiBiZSB0aGUgbGluZSBpbmRpY2F0aW5nIHRoZSBsb2cgZmlsZSBnZW5lcmF0ZWRcbiAgICAgICAgeGNvZGVidWlsZC5sb2dMb2NhdGlvbiA9IF8uZmlyc3QoXy5yZW1vdmUob3V0LnRyaW0oKS5zcGxpdCgnXFxuJyksICh2KSA9PiB2LmluZGV4T2YocGF0aC5zZXApID09PSAwKSk7XG4gICAgICAgIGxvZy5kZWJ1ZyhgTG9nIGZpbGUgZm9yIHhjb2RlYnVpbGQgdGVzdDogJHt4Y29kZWJ1aWxkLmxvZ0xvY2F0aW9ufWApO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiB3ZSBoYXZlIGFuIGVycm9yIHdlIHdhbnQgdG8gb3V0cHV0IHRoZSBsb2dzXG4gICAgICAvLyBvdGhlcndpc2UgdGhlIGZhaWx1cmUgaXMgaW5zY3J1dGlibGVcbiAgICAgIC8vIGJ1dCBkbyBub3QgbG9nIHBlcm1pc3Npb24gZXJyb3JzIGZyb20gdHJ5aW5nIHRvIHdyaXRlIHRvIGF0dGFjaG1lbnRzIGZvbGRlclxuICAgICAgaWYgKG91dC5pbmRleE9mKCdFcnJvciBEb21haW49JykgIT09IC0xICYmXG4gICAgICAgICAgb3V0LmluZGV4T2YoJ0Vycm9yIHdyaXRpbmcgYXR0YWNobWVudCBkYXRhIHRvIGZpbGUnKSA9PT0gLTEgJiZcbiAgICAgICAgICBvdXQuaW5kZXhPZignRmFpbGVkIHRvIHJlbW92ZSBzY3JlZW5zaG90IGF0IHBhdGgnKSA9PT0gLTEpIHtcbiAgICAgICAgbG9nWGNvZGVPdXRwdXQgPSB0cnVlO1xuXG4gICAgICAgIC8vIHRlcnJpYmxlIGhhY2sgdG8gaGFuZGxlIGNhc2Ugd2hlcmUgeGNvZGUgcmV0dXJuIDAgYnV0IGlzIGZhaWxpbmdcbiAgICAgICAgeGNvZGVidWlsZC5fd2RhX2Vycm9yX29jY3VycmVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxvZ1hjb2RlT3V0cHV0KSB7XG4gICAgICAgIC8vIGRvIG5vdCBsb2cgcGVybWlzc2lvbiBlcnJvcnMgZnJvbSB0cnlpbmcgdG8gd3JpdGUgdG8gYXR0YWNobWVudHMgZm9sZGVyXG4gICAgICAgIGlmIChvdXQuaW5kZXhPZignRXJyb3Igd3JpdGluZyBhdHRhY2htZW50IGRhdGEgdG8gZmlsZScpID09PSAtMSkge1xuICAgICAgICAgIGZvciAobGV0IGxpbmUgb2Ygb3V0LnNwbGl0KCdcXG4nKSkge1xuICAgICAgICAgICAgeGNvZGVMb2cuaW5mbyhsaW5lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB4Y29kZWJ1aWxkO1xuICB9XG5cbiAgYXN5bmMgc3RhcnQgKGJ1aWxkT25seSA9IGZhbHNlKSB7XG4gICAgdGhpcy54Y29kZWJ1aWxkID0gYXdhaXQgdGhpcy5jcmVhdGVTdWJQcm9jZXNzKGJ1aWxkT25seSk7XG5cbiAgICAvLyB3cmFwIHRoZSBzdGFydCBwcm9jZWR1cmUgaW4gYSBwcm9taXNlIHNvIHRoYXQgd2UgY2FuIGNhdGNoLCBhbmQgcmVwb3J0LFxuICAgIC8vIGFueSBzdGFydHVwIGVycm9ycyB0aGF0IGFyZSB0aHJvd24gYXMgZXZlbnRzXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBCKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMueGNvZGVidWlsZC5vbignZXhpdCcsIGFzeW5jIChjb2RlLCBzaWduYWwpID0+IHtcbiAgICAgICAgbG9nLmluZm8oYHhjb2RlYnVpbGQgZXhpdGVkIHdpdGggY29kZSAnJHtjb2RlfScgYW5kIHNpZ25hbCAnJHtzaWduYWx9J2ApO1xuICAgICAgICAvLyBwcmludCBvdXQgdGhlIHhjb2RlYnVpbGQgZmlsZSBpZiB1c2VycyBoYXZlIGFza2VkIGZvciBpdFxuICAgICAgICBpZiAodGhpcy5zaG93WGNvZGVMb2cgJiYgdGhpcy54Y29kZWJ1aWxkLmxvZ0xvY2F0aW9uKSB7XG4gICAgICAgICAgeGNvZGVMb2cuaW5mbyhgQ29udGVudHMgb2YgeGNvZGVidWlsZCBsb2cgZmlsZSAnJHt0aGlzLnhjb2RlYnVpbGQubG9nTG9jYXRpb259JzpgKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCBmcy5yZWFkRmlsZSh0aGlzLnhjb2RlYnVpbGQubG9nTG9jYXRpb24sICd1dGYtOCcpO1xuICAgICAgICAgICAgZm9yIChsZXQgbGluZSBvZiBkYXRhLnNwbGl0KCdcXG4nKSkge1xuICAgICAgICAgICAgICB4Y29kZUxvZy5pbmZvKGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nLmRlYnVnKGBVbmFibGUgdG8gYWNjZXNzIHhjb2RlYnVpbGQgbG9nIGZpbGU6ICcke2Vyci5tZXNzYWdlfSdgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy54Y29kZWJ1aWxkLnByb2Nlc3NFeGl0ZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy54Y29kZWJ1aWxkLl93ZGFfZXJyb3Jfb2NjdXJyZWQgfHwgKCFzaWduYWwgJiYgY29kZSAhPT0gMCkpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihgeGNvZGVidWlsZCBmYWlsZWQgd2l0aCBjb2RlICR7Y29kZX1gKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaW4gdGhlIGNhc2Ugb2YganVzdCBidWlsZGluZywgdGhlIHByb2Nlc3Mgd2lsbCBleGl0IGFuZCB0aGF0IGlzIG91ciBmaW5pc2hcbiAgICAgICAgaWYgKGJ1aWxkT25seSkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gKGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBsZXQgc3RhcnRUaW1lID0gcHJvY2Vzcy5ocnRpbWUoKTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnhjb2RlYnVpbGQuc3RhcnQoKTtcbiAgICAgICAgICB0aGlzLnhjb2RlYnVpbGQucHJvYy51bnJlZigpO1xuICAgICAgICAgIGlmICghYnVpbGRPbmx5KSB7XG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gYXdhaXQgdGhpcy53YWl0Rm9yU3RhcnQoc3RhcnRUaW1lKTtcbiAgICAgICAgICAgIHJlc29sdmUoc3RhdHVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGxldCBtc2cgPSBgVW5hYmxlIHRvIHN0YXJ0IFdlYkRyaXZlckFnZW50OiAke2Vycn1gO1xuICAgICAgICAgIGxvZy5lcnJvcihtc2cpO1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IobXNnKSk7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB3YWl0Rm9yU3RhcnQgKHN0YXJ0VGltZSkge1xuICAgIC8vIHRyeSB0byBjb25uZWN0IG9uY2UgZXZlcnkgMC41IHNlY29uZHMsIHVudGlsIGBsYXVuY2hUaW1lb3V0YCBpcyB1cFxuICAgIGxvZy5kZWJ1ZyhgV2FpdGluZyB1cCB0byAke3RoaXMubGF1bmNoVGltZW91dH1tcyBmb3IgV2ViRHJpdmVyQWdlbnQgdG8gc3RhcnRgKTtcbiAgICBsZXQgY3VycmVudFN0YXR1cyA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIGxldCByZXRyaWVzID0gcGFyc2VJbnQodGhpcy5sYXVuY2hUaW1lb3V0IC8gNTAwLCAxMCk7XG4gICAgICBhd2FpdCByZXRyeUludGVydmFsKHJldHJpZXMsIDUwMCwgYXN5bmMgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy54Y29kZWJ1aWxkLnByb2Nlc3NFeGl0ZWQpIHtcbiAgICAgICAgICAvLyB0aGVyZSBoYXMgYmVlbiBhbiBlcnJvciBlbHNld2hlcmUgYW5kIHdlIG5lZWQgdG8gc2hvcnQtY2lyY3VpdFxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcm94eVRpbWVvdXQgPSB0aGlzLm5vU2Vzc2lvblByb3h5LnRpbWVvdXQ7XG4gICAgICAgIHRoaXMubm9TZXNzaW9uUHJveHkudGltZW91dCA9IDEwMDA7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY3VycmVudFN0YXR1cyA9IGF3YWl0IHRoaXMubm9TZXNzaW9uUHJveHkuY29tbWFuZCgnL3N0YXR1cycsICdHRVQnKTtcbiAgICAgICAgICBpZiAoY3VycmVudFN0YXR1cyAmJiBjdXJyZW50U3RhdHVzLmlvcyAmJiBjdXJyZW50U3RhdHVzLmlvcy5pcCkge1xuICAgICAgICAgICAgdGhpcy5hZ2VudFVybCA9IGN1cnJlbnRTdGF0dXMuaW9zLmlwO1xuICAgICAgICAgICAgbG9nLmRlYnVnKGBXZWJEcml2ZXJBZ2VudCBydW5uaW5nIG9uIGlwICcke3RoaXMuYWdlbnRVcmx9J2ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gY29ubmVjdCB0byBydW5uaW5nIFdlYkRyaXZlckFnZW50OiAke2Vyci5tZXNzYWdlfWApO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRoaXMubm9TZXNzaW9uUHJveHkudGltZW91dCA9IHByb3h5VGltZW91dDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLnhjb2RlYnVpbGQucHJvY2Vzc0V4aXRlZCkge1xuICAgICAgICAvLyB0aGVyZSBoYXMgYmVlbiBhbiBlcnJvciBlbHNld2hlcmUgYW5kIHdlIG5lZWQgdG8gc2hvcnQtY2lyY3VpdFxuICAgICAgICByZXR1cm4gY3VycmVudFN0YXR1cztcbiAgICAgIH1cblxuICAgICAgbGV0IGVuZFRpbWUgPSBwcm9jZXNzLmhydGltZShzdGFydFRpbWUpO1xuICAgICAgLy8gbXVzdCBnZXQgW3MsIG5zXSBhcnJheSBpbnRvIG1zXG4gICAgICBsZXQgc3RhcnR1cFRpbWUgPSBwYXJzZUludCgoZW5kVGltZVswXSAqIDFlOSArIGVuZFRpbWVbMV0pIC8gMWU2LCAxMCk7XG4gICAgICBsb2cuZGVidWcoYFdlYkRyaXZlckFnZW50IHN1Y2Nlc3NmdWxseSBzdGFydGVkIGFmdGVyICR7c3RhcnR1cFRpbWV9bXNgKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIGF0IHRoaXMgcG9pbnQsIGlmIHdlIGhhdmUgbm90IGhhZCBhbnkgZXJyb3JzIGZyb20geGNvZGUgaXRzZWxmIChyZXBvcnRlZFxuICAgICAgLy8gZWxzZXdoZXJlKSwgd2UgY2FuIGxldCB0aGlzIGdvIHRocm91Z2ggYW5kIHRyeSB0byBjcmVhdGUgdGhlIHNlc3Npb25cbiAgICAgIGxvZy5kZWJ1ZyhlcnIubWVzc2FnZSk7XG4gICAgICBsb2cud2FybihgR2V0dGluZyBzdGF0dXMgb2YgV2ViRHJpdmVyQWdlbnQgb24gZGV2aWNlIHRpbWVkIG91dC4gQ29udGludWluZ2ApO1xuICAgIH1cbiAgICByZXR1cm4gY3VycmVudFN0YXR1cztcbiAgfVxuXG4gIGFzeW5jIHF1aXQgKCkge1xuICAgIGF3YWl0IGtpbGxQcm9jZXNzKCd4Y29kZWJ1aWxkJywgdGhpcy54Y29kZWJ1aWxkKTtcbiAgfVxufVxuXG5leHBvcnQgeyBYY29kZUJ1aWxkIH07XG5leHBvcnQgZGVmYXVsdCBYY29kZUJ1aWxkO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLi8uLiJ9
