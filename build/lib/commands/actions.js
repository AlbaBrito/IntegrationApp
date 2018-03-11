'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appiumSupport = require('appium-support');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _teen_process = require('teen_process');

var _nodeSimctl = require('node-simctl');

var CONTAINER_PATH_MARKER = '@';
// https://regex101.com/r/PLdB0G/2
var CONTAINER_PATH_PATTERN = new RegExp('^' + CONTAINER_PATH_MARKER + '([^/]+)/(.+)');

var commands = {};

function verifyIFusePresence() {
  return _regeneratorRuntime.async(function verifyIFusePresence$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.which('ifuse'));

      case 2:
        if (context$1$0.sent) {
          context$1$0.next = 4;
          break;
        }

        _logger2['default'].errorAndThrow('\'ifuse\' tool is required to be installed on the machine. ' + 'Install it using \'brew cask install osxfuse && brew install ifuse\' or check ' + 'if it is available in PATH environment variable if the tool is already installed. ' + ('Current PATH value: ' + process.env.PATH));

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function mountDevice(device, iFuseArgs) {
  return _regeneratorRuntime.async(function mountDevice$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug('Starting ifuse with args \'' + iFuseArgs + '\'...');
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('ifuse', iFuseArgs));

      case 4:
        context$1$0.next = 9;
        break;

      case 6:
        context$1$0.prev = 6;
        context$1$0.t0 = context$1$0['catch'](1);

        _logger2['default'].errorAndThrow('Cannot mount the media folder of the device with UDID ' + device.udid + '. ' + 'Make sure osxfuse plugin has necessary permissions in System Preferences->Security & Privacy. ' + ('Error code: ' + context$1$0.t0.code + '; stderr output: ' + context$1$0.t0.stderr));

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 6]]);
}

function parseContainerPath(remotePath, containerRootSupplier) {
  var match, containerRoot;
  return _regeneratorRuntime.async(function parseContainerPath$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        match = CONTAINER_PATH_PATTERN.exec(remotePath);

        if (!match) {
          _logger2['default'].errorAndThrow('It is expected that package identifier is separated from the relative path with a single slash. ' + ('\'' + remotePath + '\' is given instead'));
        }

        if (!_lodash2['default'].isFunction(containerRootSupplier)) {
          context$1$0.next = 8;
          break;
        }

        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(containerRootSupplier(match[1]));

      case 5:
        context$1$0.t0 = context$1$0.sent;
        context$1$0.next = 9;
        break;

      case 8:
        context$1$0.t0 = containerRootSupplier;

      case 9:
        containerRoot = context$1$0.t0;
        return context$1$0.abrupt('return', [match[1], _path2['default'].posix.resolve(containerRoot, match[2])]);

      case 11:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

/**
 * Save the given base64 data chunk as a binary file on the Simulator under test.
 *
 * @param {Object} device - The device object, which represents the device under test.
 *                          This object is expected to have the `udid` property containing the
 *                          valid device ID.
 * @param {string} remotePath - The remote path on the device. This variable can be prefixed with
 *                              bundle id, so then the file will be uploaded to the corresponding
 *                              application container instead of the default media folder, for example
 *                              '@com.myapp.bla/RelativePathInContainer/111.png'. The '@' character at the
 *                              beginning of the argument is mandatory in such case.
 *                              The relative folder path is ignored if the file is going to be uploaded
 *                              to the default media folder and only the file name is considered important.
 * @param {string} base64Data - Base-64 encoded content of the file to be uploaded.
 */
function pushFileToSimulator(device, remotePath, base64Data) {
  var _ref, _ref2, bundleId, _dstPath, dstFolder, dstPath;

  return _regeneratorRuntime.async(function pushFileToSimulator$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!remotePath.startsWith(CONTAINER_PATH_MARKER)) {
          context$1$0.next = 17;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(parseContainerPath(remotePath, function callee$1$0(x) {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.next = 2;
                return _regeneratorRuntime.awrap((0, _nodeSimctl.getAppContainer)(device.udid, x));

              case 2:
                return context$2$0.abrupt('return', context$2$0.sent);

              case 3:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        }));

      case 3:
        _ref = context$1$0.sent;
        _ref2 = _slicedToArray(_ref, 2);
        bundleId = _ref2[0];
        _dstPath = _ref2[1];

        _logger2['default'].info('Parsed bundle identifier \'' + bundleId + '\' from \'' + remotePath + '\'. ' + ('Will put the data into \'' + _dstPath + '\''));
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(_path2['default'].dirname(_dstPath)));

      case 10:
        if (context$1$0.sent) {
          context$1$0.next = 14;
          break;
        }

        _logger2['default'].debug('The destination folder \'' + _path2['default'].dirname(_dstPath) + '\' does not exist. Creating...');
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.mkdirp(_path2['default'].dirname(_dstPath)));

      case 14:
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.writeFile(_dstPath, new Buffer(base64Data, 'base64').toString('binary'), 'binary'));

      case 16:
        return context$1$0.abrupt('return');

      case 17:
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(_appiumSupport.tempDir.tempDir());

      case 19:
        dstFolder = context$1$0.sent;
        dstPath = _path2['default'].resolve(dstFolder, _path2['default'].basename(remotePath));
        context$1$0.prev = 21;
        context$1$0.next = 24;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.writeFile(dstPath, new Buffer(base64Data, 'base64').toString('binary'), 'binary'));

      case 24:
        context$1$0.next = 26;
        return _regeneratorRuntime.awrap((0, _nodeSimctl.addMedia)(device.udid, dstPath));

      case 26:
        context$1$0.prev = 26;
        context$1$0.next = 29;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.rimraf(dstFolder));

      case 29:
        return context$1$0.finish(26);

      case 30:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[21,, 26, 30]]);
}

/**
 * Save the given base64 data chunk as a binary file on the device under test.
 * ifuse/osxfuse should be installed and configured on the target machine in order
 * for this function to work properly. Read https://github.com/libimobiledevice/ifuse
 * and https://github.com/osxfuse/osxfuse/wiki/FAQ for more details.
 *
 * @param {Object} device - The device object, which represents the device under test.
 *                          This object is expected to have the `udid` property containing the
 *                          valid device ID.
 * @param {string} remotePath - The remote path on the device. This variable can be prefixed with
 *                              bundle id, so then the file will be uploaded to the corresponding
 *                              application container instead of the default media folder, for example
 *                              '@com.myapp.bla/RelativePathInContainer/111.png'. The '@' character at the
 *                              beginning of the argument is mandatory in such case.
 * @param {string} base64Data - Base-64 encoded content of the file to be uploaded.
 */
function pushFileToRealDevice(device, remotePath, base64Data) {
  var mntRoot, isUnmountSuccessful, dstPath, ifuseArgs, _ref3, _ref32, bundleId, pathInContainer;

  return _regeneratorRuntime.async(function pushFileToRealDevice$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(verifyIFusePresence());

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(_appiumSupport.tempDir.tempDir());

      case 4:
        mntRoot = context$1$0.sent;
        isUnmountSuccessful = true;
        context$1$0.prev = 6;
        dstPath = _path2['default'].resolve(mntRoot, remotePath);
        ifuseArgs = ['-u', device.udid, mntRoot];

        if (!remotePath.startsWith(CONTAINER_PATH_MARKER)) {
          context$1$0.next = 19;
          break;
        }

        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(parseContainerPath(remotePath, mntRoot));

      case 12:
        _ref3 = context$1$0.sent;
        _ref32 = _slicedToArray(_ref3, 2);
        bundleId = _ref32[0];
        pathInContainer = _ref32[1];

        dstPath = pathInContainer;
        _logger2['default'].info('Parsed bundle identifier \'' + bundleId + '\' from \'' + remotePath + '\'. ' + ('Will put the data into \'' + dstPath + '\''));
        ifuseArgs = ['-u', device.udid, '--container', bundleId, mntRoot];

      case 19:
        context$1$0.next = 21;
        return _regeneratorRuntime.awrap(mountDevice(device, ifuseArgs));

      case 21:
        isUnmountSuccessful = false;
        context$1$0.prev = 22;
        context$1$0.next = 25;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(_path2['default'].dirname(dstPath)));

      case 25:
        if (context$1$0.sent) {
          context$1$0.next = 29;
          break;
        }

        _logger2['default'].debug('The destination folder \'' + _path2['default'].dirname(dstPath) + '\' does not exist. Creating...');
        context$1$0.next = 29;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.mkdirp(_path2['default'].dirname(dstPath)));

      case 29:
        context$1$0.next = 31;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.writeFile(dstPath, new Buffer(base64Data, 'base64').toString('binary'), 'binary'));

      case 31:
        context$1$0.prev = 31;
        context$1$0.next = 34;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('umount', [mntRoot]));

      case 34:
        isUnmountSuccessful = true;
        return context$1$0.finish(31);

      case 36:
        context$1$0.prev = 36;

        if (!isUnmountSuccessful) {
          context$1$0.next = 42;
          break;
        }

        context$1$0.next = 40;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.rimraf(mntRoot));

      case 40:
        context$1$0.next = 43;
        break;

      case 42:
        _logger2['default'].warn('Umount has failed, so not removing \'' + mntRoot + '\'');

      case 43:
        return context$1$0.finish(36);

      case 44:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[6,, 36, 44], [22,, 31, 36]]);
}

/**
 * Get the content of given file from iOS Simulator and return it as base-64 encoded string.
 *
 * @param {Object} device - The device object, which represents the device under test.
 *                          This object is expected to have the `udid` property containing the
 *                          valid device ID.
 * @param {string} remotePath - The path to a file, which exists in the corresponding application
 *                              container on Simulator. The expected format of this string:
 *                              @<app_bundle_id>/<path_to_the_file_inside_container>
 * @returns {string} Base-64 encoded content of the file.
 */
function pullFileFromSimulator(device, remotePath) {
  var _ref4, _ref42, bundleId, dstPath, data;

  return _regeneratorRuntime.async(function pullFileFromSimulator$(context$1$0) {
    var _this2 = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!remotePath.startsWith(CONTAINER_PATH_MARKER)) {
          _logger2['default'].errorAndThrow('Only pulling files from application containers is supported for iOS Simulator. ' + 'Provide the remote path in format @<bundle_id>/<path_to_the_file_in_its_container>');
        }
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(parseContainerPath(remotePath, function callee$1$0(x) {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.next = 2;
                return _regeneratorRuntime.awrap((0, _nodeSimctl.getAppContainer)(device.udid, x));

              case 2:
                return context$2$0.abrupt('return', context$2$0.sent);

              case 3:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this2);
        }));

      case 3:
        _ref4 = context$1$0.sent;
        _ref42 = _slicedToArray(_ref4, 2);
        bundleId = _ref42[0];
        dstPath = _ref42[1];

        _logger2['default'].info('Parsed bundle identifier \'' + bundleId + '\' from \'' + remotePath + '\'. ' + ('Will get the data from \'' + dstPath + '\''));
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(dstPath));

      case 10:
        if (context$1$0.sent) {
          context$1$0.next = 12;
          break;
        }

        _logger2['default'].errorAndThrow('The remote file at \'' + dstPath + '\' does not exist');

      case 12:
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.readFile(dstPath));

      case 14:
        data = context$1$0.sent;
        return context$1$0.abrupt('return', new Buffer(data).toString('base64'));

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

/**
 * Get the content of given file from the real device under test and return it as base-64 encoded string.
 *
 * @param {Object} device - The device object, which represents the device under test.
 *                          This object is expected to have the `udid` property containing the
 *                          valid device ID.
 * @param {string} remotePath - The path to an existing remote file on the device. This variable can be prefixed with
 *                              bundle id, so then the file will be downloaded from the corresponding
 *                              application container instead of the default media folder, for example
 *                              '@com.myapp.bla/RelativePathInContainer/111.png'. The '@' character at the
 *                              beginning of the argument is mandatory in such case.
 * @return {string} Base-64 encoded content of the remote file
 */
function pullFileFromRealDevice(device, remotePath) {
  var mntRoot, isUnmountSuccessful, dstPath, ifuseArgs, _ref5, _ref52, bundleId, pathInContainer, data;

  return _regeneratorRuntime.async(function pullFileFromRealDevice$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(verifyIFusePresence());

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(_appiumSupport.tempDir.tempDir());

      case 4:
        mntRoot = context$1$0.sent;
        isUnmountSuccessful = true;
        context$1$0.prev = 6;
        dstPath = _path2['default'].resolve(mntRoot, remotePath);
        ifuseArgs = ['-u', device.udid, mntRoot];

        if (!remotePath.startsWith(CONTAINER_PATH_MARKER)) {
          context$1$0.next = 19;
          break;
        }

        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(parseContainerPath(remotePath, mntRoot));

      case 12:
        _ref5 = context$1$0.sent;
        _ref52 = _slicedToArray(_ref5, 2);
        bundleId = _ref52[0];
        pathInContainer = _ref52[1];

        dstPath = pathInContainer;
        _logger2['default'].info('Parsed bundle identifier \'' + bundleId + '\' from \'' + remotePath + '\'. ' + ('Will get the data from \'' + dstPath + '\''));
        ifuseArgs = ['-u', device.udid, '--container', bundleId, mntRoot];

      case 19:
        context$1$0.next = 21;
        return _regeneratorRuntime.awrap(mountDevice(device, ifuseArgs));

      case 21:
        isUnmountSuccessful = false;
        context$1$0.prev = 22;
        context$1$0.next = 25;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(dstPath));

      case 25:
        if (context$1$0.sent) {
          context$1$0.next = 27;
          break;
        }

        _logger2['default'].errorAndThrow('The remote file at \'' + dstPath + '\' does not exist');

      case 27:
        context$1$0.next = 29;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.readFile(dstPath));

      case 29:
        data = context$1$0.sent;
        return context$1$0.abrupt('return', new Buffer(data).toString('base64'));

      case 31:
        context$1$0.prev = 31;
        context$1$0.next = 34;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('umount', [mntRoot]));

      case 34:
        isUnmountSuccessful = true;
        return context$1$0.finish(31);

      case 36:
        context$1$0.prev = 36;

        if (!isUnmountSuccessful) {
          context$1$0.next = 42;
          break;
        }

        context$1$0.next = 40;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.rimraf(mntRoot));

      case 40:
        context$1$0.next = 43;
        break;

      case 42:
        _logger2['default'].warn('Umount has failed, so not removing \'' + mntRoot + '\'');

      case 43:
        return context$1$0.finish(36);

      case 44:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[6,, 36, 44], [22,, 31, 36]]);
}

commands.pushFile = function callee$0$0(remotePath, base64Data) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (remotePath.endsWith('/')) {
          _logger2['default'].errorAndThrow('It is expected that remote path points to a file and not to a folder. ' + ('\'' + remotePath + '\' is given instead'));
        }

        if (!this.isSimulator()) {
          context$1$0.next = 5;
          break;
        }

        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(pushFileToSimulator(this.opts.device, remotePath, base64Data));

      case 4:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 5:
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(pushFileToRealDevice(this.opts.device, remotePath, base64Data));

      case 7:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.pullFile = function callee$0$0(remotePath) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (remotePath.endsWith('/')) {
          _logger2['default'].errorAndThrow('It is expected that remote path points to a file and not to a folder. ' + ('\'' + remotePath + '\' is given instead'));
        }

        if (!this.isSimulator()) {
          context$1$0.next = 5;
          break;
        }

        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(pullFileFromSimulator(this.opts.device, remotePath));

      case 4:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 5:
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(pullFileFromRealDevice(this.opts.device, remotePath));

      case 7:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

function extractMandatoryOptions(opts, keys) {
  if (opts === undefined) opts = {};

  var result = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      var value = opts[key];
      if (!_lodash2['default'].isString(value) || _lodash2['default'].isEmpty(value)) {
        _logger2['default'].errorAndThrow('\'' + key + '\' is expected to be a valid string. \'' + value + '\' is given instead');
      }
      result[key] = value;
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

  return result;
}

commands.mobileInstallApp = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _extractMandatoryOptions, app, dstPath;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _extractMandatoryOptions = extractMandatoryOptions(opts, ['app']);
        app = _extractMandatoryOptions.app;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.helpers.configureApp(app, '.app'));

      case 4:
        dstPath = context$1$0.sent;

        _logger2['default'].info('Installing \'' + dstPath + '\' to the ' + (this.isRealDevice() ? 'real device' : 'Simulator') + ' ' + ('with UDID ' + this.opts.device.udid));
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(dstPath));

      case 8:
        if (context$1$0.sent) {
          context$1$0.next = 10;
          break;
        }

        _logger2['default'].errorAndThrow('The application at \'' + dstPath + '\' does not exist or is not accessible');

      case 10:
        context$1$0.prev = 10;
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(this.opts.device.installApp(dstPath));

      case 13:
        _logger2['default'].info('Installation of \'' + dstPath + '\' succeeded');

      case 14:
        context$1$0.prev = 14;

        if (!(dstPath !== app)) {
          context$1$0.next = 18;
          break;
        }

        context$1$0.next = 18;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.rimraf(dstPath));

      case 18:
        return context$1$0.finish(14);

      case 19:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[10,, 14, 19]]);
};

commands.mobileIsAppInstalled = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.opts.device.isAppInstalled(extractMandatoryOptions(opts, ['bundleId'])));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.mobileRemoveApp = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _extractMandatoryOptions2, bundleId;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _extractMandatoryOptions2 = extractMandatoryOptions(opts, ['bundleId']);
        bundleId = _extractMandatoryOptions2.bundleId;

        _logger2['default'].info('Uninstalling the application with bundle identifier \'' + bundleId + '\' ' + ('from the ' + (this.isRealDevice() ? 'real device' : 'Simulator') + ' with UDID ' + this.opts.device.udid));
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(this.opts.device.removeApp());

      case 5:
        _logger2['default'].info('Removal of \'' + bundleId + '\' succeeded');

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.mobileLaunchApp = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var wdaOpts;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        wdaOpts = extractMandatoryOptions(opts, ['bundleId']);

        if (opts.arguments) {
          wdaOpts.arguments = _lodash2['default'].isArray(opts.arguments) ? opts.arguments : [opts.arguments];
        }
        if (opts.environment) {
          wdaOpts.environment = opts.environment;
        }
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/apps/launch', 'POST', wdaOpts));

      case 5:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.mobileTerminateApp = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/apps/terminate', 'POST', extractMandatoryOptions(opts, ['bundleId'])));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.mobileActivateApp = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/apps/activate', 'POST', extractMandatoryOptions(opts, ['bundleId'])));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.mobileQueryAppState = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/apps/state', 'POST', extractMandatoryOptions(opts, ['bundleId'])));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

exports['default'] = commands;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9hY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3NCQUFjLFFBQVE7Ozs7NkJBQ00sZ0JBQWdCOztvQkFDM0IsTUFBTTs7OztzQkFDUCxXQUFXOzs7OzRCQUNOLGNBQWM7OzBCQUNPLGFBQWE7O0FBRXZELElBQU0scUJBQXFCLEdBQUcsR0FBRyxDQUFDOztBQUVsQyxJQUFNLHNCQUFzQixHQUFHLElBQUksTUFBTSxPQUFLLHFCQUFxQixrQkFBZSxDQUFDOztBQUVuRixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRWxCLFNBQWUsbUJBQW1COzs7Ozt5Q0FDckIsa0JBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQzs7Ozs7Ozs7QUFDMUIsNEJBQUksYUFBYSxDQUFDLGdKQUM4RSx1RkFDTSw2QkFDN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDOzs7Ozs7O0NBRWhFOztBQUVELFNBQWUsV0FBVyxDQUFFLE1BQU0sRUFBRSxTQUFTOzs7O0FBQzNDLDRCQUFJLEtBQUssaUNBQThCLFNBQVMsV0FBTyxDQUFDOzs7eUNBRWhELHdCQUFLLE9BQU8sRUFBRSxTQUFTLENBQUM7Ozs7Ozs7Ozs7QUFFOUIsNEJBQUksYUFBYSxDQUFDLDJEQUF5RCxNQUFNLENBQUMsSUFBSSwwR0FDNEIscUJBQ2pGLGVBQUUsSUFBSSx5QkFBb0IsZUFBRSxNQUFNLENBQUUsQ0FBQyxDQUFDOzs7Ozs7O0NBRTFFOztBQUVELFNBQWUsa0JBQWtCLENBQUUsVUFBVSxFQUFFLHFCQUFxQjtNQUM1RCxLQUFLLEVBS0wsYUFBYTs7OztBQUxiLGFBQUssR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDOztBQUNyRCxZQUFJLENBQUMsS0FBSyxFQUFFO0FBQ1YsOEJBQUksYUFBYSxDQUFDLDZHQUNJLFVBQVUseUJBQW9CLENBQUMsQ0FBQztTQUN2RDs7YUFDcUIsb0JBQUUsVUFBVSxDQUFDLHFC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LENBQUM7Ozs7Ozs7Ozs7Q0FDdkcsQ0FBQzs7cUJBR2EsUUFBUSIsImZpbGUiOiJsaWIvY29tbWFuZHMvYWN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBmcywgdGVtcERpciB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGxvZyBmcm9tICcuLi9sb2dnZXInO1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ3RlZW5fcHJvY2Vzcyc7XG5pbXBvcnQgeyBhZGRNZWRpYSwgZ2V0QXBwQ29udGFpbmVyIH0gZnJvbSAnbm9kZS1zaW1jdGwnO1xuXG5jb25zdCBDT05UQUlORVJfUEFUSF9NQVJLRVIgPSAnQCc7XG4vLyBodHRwczovL3JlZ2V4MTAxLmNvbS9yL1BMZEIwRy8yXG5jb25zdCBDT05UQUlORVJfUEFUSF9QQVRURVJOID0gbmV3IFJlZ0V4cChgXiR7Q09OVEFJTkVSX1BBVEhfTUFSS0VSfShbXi9dKykvKC4rKWApO1xuXG5sZXQgY29tbWFuZHMgPSB7fTtcblxuYXN5bmMgZnVuY3Rpb24gdmVyaWZ5SUZ1c2VQcmVzZW5jZSAoKSB7XG4gIGlmICghYXdhaXQgZnMud2hpY2goJ2lmdXNlJykpIHtcbiAgICBsb2cuZXJyb3JBbmRUaHJvdyhgJ2lmdXNlJyB0b29sIGlzIHJlcXVpcmVkIHRvIGJlIGluc3RhbGxlZCBvbiB0aGUgbWFjaGluZS4gYCArXG4gICAgICAgICAgICAgICAgICAgICAgYEluc3RhbGwgaXQgdXNpbmcgJ2JyZXcgY2FzayBpbnN0YWxsIG9zeGZ1c2UgJiYgYnJldyBpbnN0YWxsIGlmdXNlJyBvciBjaGVjayBgICtcbiAgICAgICAgICAgICAgICAgICAgICBgaWYgaXQgaXMgYXZhaWxhYmxlIGluIFBBVEggZW52aXJvbm1lbnQgdmFyaWFibGUgaWYgdGhlIHRvb2wgaXMgYWxyZWFkeSBpbnN0YWxsZWQuIGAgK1xuICAgICAgICAgICAgICAgICAgICAgIGBDdXJyZW50IFBBVEggdmFsdWU6ICR7cHJvY2Vzcy5lbnYuUEFUSH1gKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBtb3VudERldmljZSAoZGV2aWNlLCBpRnVzZUFyZ3MpIHtcbiAgbG9nLmRlYnVnKGBTdGFydGluZyBpZnVzZSB3aXRoIGFyZ3MgJyR7aUZ1c2VBcmdzfScuLi5gKTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBleGVjKCdpZnVzZScsIGlGdXNlQXJncyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsb2cuZXJyb3JBbmRUaHJvdyhgQ2Fubm90IG1vdW50IHRoZSBtZWRpYSBmb2xkZXIgb2YgdGhlIGRldmljZSB3aXRoIFVESUQgJHtkZXZpY2UudWRpZH0uIGAgK1xuICAgICAgICAgICAgICAgICAgICAgIGBNYWtlIHN1cmUgb3N4ZnVzZSBwbHVnaW4gaGFzIG5lY2Vzc2FyeSBwZXJtaXNzaW9ucyBpbiBTeXN0ZW0gUHJlZmVyZW5jZXMtPlNlY3VyaXR5ICYgUHJpdmFjeS4gYCArXG4gICAgICAgICAgICAgICAgICAgICAgYEVycm9yIGNvZGU6ICR7ZS5jb2RlfTsgc3RkZXJyIG91dHB1dDogJHtlLnN0ZGVycn1gKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBwYXJzZUNvbnRhaW5lclBhdGggKHJlbW90ZVBhdGgsIGNvbnRhaW5lclJvb3RTdXBwbGllcikge1xuICBjb25zdCBtYXRjaCA9IENPTlRBSU5FUl9QQVRIX1BBVFRFUk4uZXhlYyhyZW1vdGVQYXRoKTtcbiAgaWYgKCFtYXRjaCkge1xuICAgIGxvZy5lcnJvckFuZFRocm93KGBJdCBpcyBleHBlY3RlZCB0aGF0IHBhY2thZ2UgaWRlbnRpZmllciBpcyBzZXBhcmF0ZWQgZnJvbSB0aGUgcmVsYXRpdmUgcGF0aCB3aXRoIGEgc2luZ2xlIHNsYXNoLiBgICtcbiAgICAgICAgICAgICAgICAgICAgICBgJyR7cmVtb3RlUGF0aH0nIGlzIGdpdmVuIGluc3RlYWRgKTtcbiAgfVxuICBjb25zdCBjb250YWluZXJSb290ID0gXy5pc0Z1bmN0aW9uKGNvbnRhaW5lclJvb3RTdXBwbGllcikgP1xuICAgIChhd2FpdCBjb250YWluZXJSb290U3VwcGxpZXIobWF0Y2hbMV0pKSA6XG4gICAgY29udGFpbmVyUm9vdFN1cHBsaWVyO1xuICByZXR1cm4gW21hdGNoWzFdLCBwYXRoLnBvc2l4LnJlc29sdmUoY29udGFpbmVyUm9vdCwgbWF0Y2hbMl0pXTtcbn1cblxuLyoqXG4gKiBTYXZlIHRoZSBnaXZlbiBiYXNlNjQgZGF0YSBjaHVuayBhcyBhIGJpbmFyeSBmaWxlIG9uIHRoZSBTaW11bGF0b3IgdW5kZXIgdGVzdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGV2aWNlIC0gVGhlIGRldmljZSBvYmplY3QsIHdoaWNoIHJlcHJlc2VudHMgdGhlIGRldmljZSB1bmRlciB0ZXN0LlxuICogICAgICAgICAgICAgICAgICAgICAgICAgIFRoaXMgb2JqZWN0IGlzIGV4cGVjdGVkIHRvIGhhdmUgdGhlIGB1ZGlkYCBwcm9wZXJ0eSBjb250YWluaW5nIHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkIGRldmljZSBJRC5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZW1vdGVQYXRoIC0gVGhlIHJlbW90ZSBwYXRoIG9uIHRoZSBkZXZpY2UuIFRoaXMgdmFyaWFibGUgY2FuIGJlIHByZWZpeGVkIHdpdGhcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVuZGxlIGlkLCBzbyB0aGVuIHRoZSBmaWxlIHdpbGwgYmUgdXBsb2FkZWQgdG8gdGhlIGNvcnJlc3BvbmRpbmdcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwbGljYXRpb24gY29udGFpbmVyIGluc3RlYWQgb2YgdGhlIGRlZmF1bHQgbWVkaWEgZm9sZGVyLCBmb3IgZXhhbXBsZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQGNvbS5teWFwcC5ibGEvUmVsYXRpdmVQYXRoSW5Db250YWluZXIvMTExLnBuZycuIFRoZSAnQCcgY2hhcmFjdGVyIGF0IHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWdpbm5pbmcgb2YgdGhlIGFyZ3VtZW50IGlzIG1hbmRhdG9yeSBpbiBzdWNoIGNhc2UuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSByZWxhdGl2ZSBmb2xkZXIgcGF0aCBpcyBpZ25vcmVkIGlmIHRoZSBmaWxlIGlzIGdvaW5nIHRvIGJlIHVwbG9hZGVkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIHRoZSBkZWZhdWx0IG1lZGlhIGZvbGRlciBhbmQgb25seSB0aGUgZmlsZSBuYW1lIGlzIGNvbnNpZGVyZWQgaW1wb3J0YW50LlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2U2NERhdGEgLSBCYXNlLTY0IGVuY29kZWQgY29udGVudCBvZiB0aGUgZmlsZSB0byBiZSB1cGxvYWRlZC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcHVzaEZpbGVUb1NpbXVsYXRvciAoZGV2aWNlLCByZW1vdGVQYXRoLCBiYXNlNjREYXRhKSB7XG4gIGlmIChyZW1vdGVQYXRoLnN0YXJ0c1dpdGgoQ09OVEFJTkVSX1BBVEhfTUFSS0VSKSkge1xuICAgIGNvbnN0IFtidW5kbGVJZCwgZHN0UGF0aF0gPSBhd2FpdCBwYXJzZUNvbnRhaW5lclBhdGgocmVtb3RlUGF0aCxcbiAgICAgIGFzeW5jICh4KSA9PiBhd2FpdCBnZXRBcHBDb250YWluZXIoZGV2aWNlLnVkaWQsIHgpKTtcbiAgICBsb2cuaW5mbyhgUGFyc2VkIGJ1bmRsZSBpZGVudGlmaWVyICcke2J1bmRsZUlkfScgZnJvbSAnJHtyZW1vdGVQYXRofScuIGAgK1xuICAgICAgICAgICAgIGBXaWxsIHB1dCB0aGUgZGF0YSBpbnRvICcke2RzdFBhdGh9J2ApO1xuICAgIGlmICghYXdhaXQgZnMuZXhpc3RzKHBhdGguZGlybmFtZShkc3RQYXRoKSkpIHtcbiAgICAgIGxvZy5kZWJ1ZyhgVGhlIGRlc3RpbmF0aW9uIGZvbGRlciAnJHtwYXRoLmRpcm5hbWUoZHN0UGF0aCl9JyBkb2VzIG5vdCBleGlzdC4gQ3JlYXRpbmcuLi5gKTtcbiAgICAgIGF3YWl0IGZzLm1rZGlycChwYXRoLmRpcm5hbWUoZHN0UGF0aCkpO1xuICAgIH1cbiAgICBhd2FpdCBmcy53cml0ZUZpbGUoZHN0UGF0aCwgbmV3IEJ1ZmZlcihiYXNlNjREYXRhLCAnYmFzZTY0JykudG9TdHJpbmcoJ2JpbmFyeScpLCAnYmluYXJ5Jyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGRzdEZvbGRlciA9IGF3YWl0IHRlbXBEaXIudGVtcERpcigpO1xuICBjb25zdCBkc3RQYXRoID0gcGF0aC5yZXNvbHZlKGRzdEZvbGRlciwgcGF0aC5iYXNlbmFtZShyZW1vdGVQYXRoKSk7XG4gIHRyeSB7XG4gICAgYXdhaXQgZnMud3JpdGVGaWxlKGRzdFBhdGgsIG5ldyBCdWZmZXIoYmFzZTY0RGF0YSwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCdiaW5hcnknKSwgJ2JpbmFyeScpO1xuICAgIGF3YWl0IGFkZE1lZGlhKGRldmljZS51ZGlkLCBkc3RQYXRoKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCBmcy5yaW1yYWYoZHN0Rm9sZGVyKTtcbiAgfVxufVxuXG4vKipcbiAqIFNhdmUgdGhlIGdpdmVuIGJhc2U2NCBkYXRhIGNodW5rIGFzIGEgYmluYXJ5IGZpbGUgb24gdGhlIGRldmljZSB1bmRlciB0ZXN0LlxuICogaWZ1c2Uvb3N4ZnVzZSBzaG91bGQgYmUgaW5zdGFsbGVkIGFuZCBjb25maWd1cmVkIG9uIHRoZSB0YXJnZXQgbWFjaGluZSBpbiBvcmRlclxuICogZm9yIHRoaXMgZnVuY3Rpb24gdG8gd29yayBwcm9wZXJseS4gUmVhZCBodHRwczovL2dpdGh1Yi5jb20vbGliaW1vYmlsZWRldmljZS9pZnVzZVxuICogYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS9vc3hmdXNlL29zeGZ1c2Uvd2lraS9GQVEgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGV2aWNlIC0gVGhlIGRldmljZSBvYmplY3QsIHdoaWNoIHJlcHJlc2VudHMgdGhlIGRldmljZSB1bmRlciB0ZXN0LlxuICogICAgICAgICAgICAgICAgICAgICAgICAgIFRoaXMgb2JqZWN0IGlzIGV4cGVjdGVkIHRvIGhhdmUgdGhlIGB1ZGlkYCBwcm9wZXJ0eSBjb250YWluaW5nIHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkIGRldmljZSBJRC5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZW1vdGVQYXRoIC0gVGhlIHJlbW90ZSBwYXRoIG9uIHRoZSBkZXZpY2UuIFRoaXMgdmFyaWFibGUgY2FuIGJlIHByZWZpeGVkIHdpdGhcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVuZGxlIGlkLCBzbyB0aGVuIHRoZSBmaWxlIHdpbGwgYmUgdXBsb2FkZWQgdG8gdGhlIGNvcnJlc3BvbmRpbmdcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwbGljYXRpb24gY29udGFpbmVyIGluc3RlYWQgb2YgdGhlIGRlZmF1bHQgbWVkaWEgZm9sZGVyLCBmb3IgZXhhbXBsZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQGNvbS5teWFwcC5ibGEvUmVsYXRpdmVQYXRoSW5Db250YWluZXIvMTExLnBuZycuIFRoZSAnQCcgY2hhcmFjdGVyIGF0IHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWdpbm5pbmcgb2YgdGhlIGFyZ3VtZW50IGlzIG1hbmRhdG9yeSBpbiBzdWNoIGNhc2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZTY0RGF0YSAtIEJhc2UtNjQgZW5jb2RlZCBjb250ZW50IG9mIHRoZSBmaWxlIHRvIGJlIHVwbG9hZGVkLlxuICovXG5hc3luYyBmdW5jdGlvbiBwdXNoRmlsZVRvUmVhbERldmljZSAoZGV2aWNlLCByZW1vdGVQYXRoLCBiYXNlNjREYXRhKSB7XG4gIGF3YWl0IHZlcmlmeUlGdXNlUHJlc2VuY2UoKTtcbiAgY29uc3QgbW50Um9vdCA9IGF3YWl0IHRlbXBEaXIudGVtcERpcigpO1xuICBsZXQgaXNVbm1vdW50U3VjY2Vzc2Z1bCA9IHRydWU7XG4gIHRyeSB7XG4gICAgbGV0IGRzdFBhdGggPSBwYXRoLnJlc29sdmUobW50Um9vdCwgcmVtb3RlUGF0aCk7XG4gICAgbGV0IGlmdXNlQXJncyA9IFsnLXUnLCBkZXZpY2UudWRpZCwgbW50Um9vdF07XG4gICAgaWYgKHJlbW90ZVBhdGguc3RhcnRzV2l0aChDT05UQUlORVJfUEFUSF9NQVJLRVIpKSB7XG4gICAgICBjb25zdCBbYnVuZGxlSWQsIHBhdGhJbkNvbnRhaW5lcl0gPSBhd2FpdCBwYXJzZUNvbnRhaW5lclBhdGgocmVtb3RlUGF0aCwgbW50Um9vdCk7XG4gICAgICBkc3RQYXRoID0gcGF0aEluQ29udGFpbmVyO1xuICAgICAgbG9nLmluZm8oYFBhcnNlZCBidW5kbGUgaWRlbnRpZmllciAnJHtidW5kbGVJZH0nIGZyb20gJyR7cmVtb3RlUGF0aH0nLiBgICtcbiAgICAgICAgICAgICAgIGBXaWxsIHB1dCB0aGUgZGF0YSBpbnRvICcke2RzdFBhdGh9J2ApO1xuICAgICAgaWZ1c2VBcmdzID0gWyctdScsIGRldmljZS51ZGlkLCAnLS1jb250YWluZXInLCBidW5kbGVJZCwgbW50Um9vdF07XG4gICAgfVxuICAgIGF3YWl0IG1vdW50RGV2aWNlKGRldmljZSwgaWZ1c2VBcmdzKTtcbiAgICBpc1VubW91bnRTdWNjZXNzZnVsID0gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghYXdhaXQgZnMuZXhpc3RzKHBhdGguZGlybmFtZShkc3RQYXRoKSkpIHtcbiAgICAgICAgbG9nLmRlYnVnKGBUaGUgZGVzdGluYXRpb24gZm9sZGVyICcke3BhdGguZGlybmFtZShkc3RQYXRoKX0nIGRvZXMgbm90IGV4aXN0LiBDcmVhdGluZy4uLmApO1xuICAgICAgICBhd2FpdCBmcy5ta2RpcnAocGF0aC5kaXJuYW1lKGRzdFBhdGgpKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IGZzLndyaXRlRmlsZShkc3RQYXRoLCBuZXcgQnVmZmVyKGJhc2U2NERhdGEsICdiYXNlNjQnKS50b1N0cmluZygnYmluYXJ5JyksICdiaW5hcnknKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgYXdhaXQgZXhlYygndW1vdW50JywgW21udFJvb3RdKTtcbiAgICAgIGlzVW5tb3VudFN1Y2Nlc3NmdWwgPSB0cnVlO1xuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICBpZiAoaXNVbm1vdW50U3VjY2Vzc2Z1bCkge1xuICAgICAgYXdhaXQgZnMucmltcmFmKG1udFJvb3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2FybihgVW1vdW50IGhhcyBmYWlsZWQsIHNvIG5vdCByZW1vdmluZyAnJHttbnRSb290fSdgKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIGNvbnRlbnQgb2YgZ2l2ZW4gZmlsZSBmcm9tIGlPUyBTaW11bGF0b3IgYW5kIHJldHVybiBpdCBhcyBiYXNlLTY0IGVuY29kZWQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXZpY2UgLSBUaGUgZGV2aWNlIG9iamVjdCwgd2hpY2ggcmVwcmVzZW50cyB0aGUgZGV2aWNlIHVuZGVyIHRlc3QuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgVGhpcyBvYmplY3QgaXMgZXhwZWN0ZWQgdG8gaGF2ZSB0aGUgYHVkaWRgIHByb3BlcnR5IGNvbnRhaW5pbmcgdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQgZGV2aWNlIElELlxuICogQHBhcmFtIHtzdHJpbmd9IHJlbW90ZVBhdGggLSBUaGUgcGF0aCB0byBhIGZpbGUsIHdoaWNoIGV4aXN0cyBpbiB0aGUgY29ycmVzcG9uZGluZyBhcHBsaWNhdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXIgb24gU2ltdWxhdG9yLiBUaGUgZXhwZWN0ZWQgZm9ybWF0IG9mIHRoaXMgc3RyaW5nOlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAPGFwcF9idW5kbGVfaWQ+LzxwYXRoX3RvX3RoZV9maWxlX2luc2lkZV9jb250YWluZXI+XG4gKiBAcmV0dXJucyB7c3RyaW5nfSBCYXNlLTY0IGVuY29kZWQgY29udGVudCBvZiB0aGUgZmlsZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcHVsbEZpbGVGcm9tU2ltdWxhdG9yIChkZXZpY2UsIHJlbW90ZVBhdGgpIHtcbiAgaWYgKCFyZW1vdGVQYXRoLnN0YXJ0c1dpdGgoQ09OVEFJTkVSX1BBVEhfTUFSS0VSKSkge1xuICAgIGxvZy5lcnJvckFuZFRocm93KGBPbmx5IHB1bGxpbmcgZmlsZXMgZnJvbSBhcHBsaWNhdGlvbiBjb250YWluZXJzIGlzIHN1cHBvcnRlZCBmb3IgaU9TIFNpbXVsYXRvci4gYCArXG4gICAgICAgICAgICAgICAgICAgICAgYFByb3ZpZGUgdGhlIHJlbW90ZSBwYXRoIGluIGZvcm1hdCBAPGJ1bmRsZV9pZD4vPHBhdGhfdG9fdGhlX2ZpbGVfaW5faXRzX2NvbnRhaW5lcj5gKTtcbiAgfVxuICBjb25zdCBbYnVuZGxlSWQsIGRzdFBhdGhdID0gYXdhaXQgcGFyc2VDb250YWluZXJQYXRoKHJlbW90ZVBhdGgsXG4gICAgYXN5bmMgKHgpID0+IGF3YWl0IGdldEFwcENvbnRhaW5lcihkZXZpY2UudWRpZCwgeCkpO1xuICBsb2cuaW5mbyhgUGFyc2VkIGJ1bmRsZSBpZGVudGlmaWVyICcke2J1bmRsZUlkfScgZnJvbSAnJHtyZW1vdGVQYXRofScuIGAgK1xuICAgICAgICAgICBgV2lsbCBnZXQgdGhlIGRhdGEgZnJvbSAnJHtkc3RQYXRofSdgKTtcbiAgaWYgKCFhd2FpdCBmcy5leGlzdHMoZHN0UGF0aCkpIHtcbiAgICBsb2cuZXJyb3JBbmRUaHJvdyhgVGhlIHJlbW90ZSBmaWxlIGF0ICcke2RzdFBhdGh9JyBkb2VzIG5vdCBleGlzdGApO1xuICB9XG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBmcy5yZWFkRmlsZShkc3RQYXRoKTtcbiAgcmV0dXJuIG5ldyBCdWZmZXIoZGF0YSkudG9TdHJpbmcoJ2Jhc2U2NCcpO1xufVxuXG4vKipcbiAqIEdldCB0aGUgY29udGVudCBvZiBnaXZlbiBmaWxlIGZyb20gdGhlIHJlYWwgZGV2aWNlIHVuZGVyIHRlc3QgYW5kIHJldHVybiBpdCBhcyBiYXNlLTY0IGVuY29kZWQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXZpY2UgLSBUaGUgZGV2aWNlIG9iamVjdCwgd2hpY2ggcmVwcmVzZW50cyB0aGUgZGV2aWNlIHVuZGVyIHRlc3QuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgVGhpcyBvYmplY3QgaXMgZXhwZWN0ZWQgdG8gaGF2ZSB0aGUgYHVkaWRgIHByb3BlcnR5IGNvbnRhaW5pbmcgdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQgZGV2aWNlIElELlxuICogQHBhcmFtIHtzdHJpbmd9IHJlbW90ZVBhdGggLSBUaGUgcGF0aCB0byBhbiBleGlzdGluZyByZW1vdGUgZmlsZSBvbiB0aGUgZGV2aWNlLiBUaGlzIHZhcmlhYmxlIGNhbiBiZSBwcmVmaXhlZCB3aXRoXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZSBpZCwgc28gdGhlbiB0aGUgZmlsZSB3aWxsIGJlIGRvd25sb2FkZWQgZnJvbSB0aGUgY29ycmVzcG9uZGluZ1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbiBjb250YWluZXIgaW5zdGVhZCBvZiB0aGUgZGVmYXVsdCBtZWRpYSBmb2xkZXIsIGZvciBleGFtcGxlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdAY29tLm15YXBwLmJsYS9SZWxhdGl2ZVBhdGhJbkNvbnRhaW5lci8xMTEucG5nJy4gVGhlICdAJyBjaGFyYWN0ZXIgYXQgdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlZ2lubmluZyBvZiB0aGUgYXJndW1lbnQgaXMgbWFuZGF0b3J5IGluIHN1Y2ggY2FzZS5cbiAqIEByZXR1cm4ge3N0cmluZ30gQmFzZS02NCBlbmNvZGVkIGNvbnRlbnQgb2YgdGhlIHJlbW90ZSBmaWxlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHB1bGxGaWxlRnJvbVJlYWxEZXZpY2UgKGRldmljZSwgcmVtb3RlUGF0aCkge1xuICBhd2FpdCB2ZXJpZnlJRnVzZVByZXNlbmNlKCk7XG4gIGNvbnN0IG1udFJvb3QgPSBhd2FpdCB0ZW1wRGlyLnRlbXBEaXIoKTtcbiAgbGV0IGlzVW5tb3VudFN1Y2Nlc3NmdWwgPSB0cnVlO1xuICB0cnkge1xuICAgIGxldCBkc3RQYXRoID0gcGF0aC5yZXNvbHZlKG1udFJvb3QsIHJlbW90ZVBhdGgpO1xuICAgIGxldCBpZnVzZUFyZ3MgPSBbJy11JywgZGV2aWNlLnVkaWQsIG1udFJvb3RdO1xuICAgIGlmIChyZW1vdGVQYXRoLnN0YXJ0c1dpdGgoQ09OVEFJTkVSX1BBVEhfTUFSS0VSKSkge1xuICAgICAgY29uc3QgW2J1bmRsZUlkLCBwYXRoSW5Db250YWluZXJdID0gYXdhaXQgcGFyc2VDb250YWluZXJQYXRoKHJlbW90ZVBhdGgsIG1udFJvb3QpO1xuICAgICAgZHN0UGF0aCA9IHBhdGhJbkNvbnRhaW5lcjtcbiAgICAgIGxvZy5pbmZvKGBQYXJzZWQgYnVuZGxlIGlkZW50aWZpZXIgJyR7YnVuZGxlSWR9JyBmcm9tICcke3JlbW90ZVBhdGh9Jy4gYCArXG4gICAgICAgICAgICAgICBgV2lsbCBnZXQgdGhlIGRhdGEgZnJvbSAnJHtkc3RQYXRofSdgKTtcbiAgICAgIGlmdXNlQXJncyA9IFsnLXUnLCBkZXZpY2UudWRpZCwgJy0tY29udGFpbmVyJywgYnVuZGxlSWQsIG1udFJvb3RdO1xuICAgIH1cbiAgICBhd2FpdCBtb3VudERldmljZShkZXZpY2UsIGlmdXNlQXJncyk7XG4gICAgaXNVbm1vdW50U3VjY2Vzc2Z1bCA9IGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICBpZiAoIWF3YWl0IGZzLmV4aXN0cyhkc3RQYXRoKSkge1xuICAgICAgICBsb2cuZXJyb3JBbmRUaHJvdyhgVGhlIHJlbW90ZSBmaWxlIGF0ICcke2RzdFBhdGh9JyBkb2VzIG5vdCBleGlzdGApO1xuICAgICAgfVxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGZzLnJlYWRGaWxlKGRzdFBhdGgpO1xuICAgICAgcmV0dXJuIG5ldyBCdWZmZXIoZGF0YSkudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBhd2FpdCBleGVjKCd1bW91bnQnLCBbbW50Um9vdF0pO1xuICAgICAgaXNVbm1vdW50U3VjY2Vzc2Z1bCA9IHRydWU7XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIGlmIChpc1VubW91bnRTdWNjZXNzZnVsKSB7XG4gICAgICBhd2FpdCBmcy5yaW1yYWYobW50Um9vdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy53YXJuKGBVbW91bnQgaGFzIGZhaWxlZCwgc28gbm90IHJlbW92aW5nICcke21udFJvb3R9J2ApO1xuICAgIH1cbiAgfVxufVxuXG5jb21tYW5kcy5wdXNoRmlsZSA9IGFzeW5jIGZ1bmN0aW9uIChyZW1vdGVQYXRoLCBiYXNlNjREYXRhKSB7XG4gIGlmIChyZW1vdGVQYXRoLmVuZHNXaXRoKCcvJykpIHtcbiAgICBsb2cuZXJyb3JBbmRUaHJvdyhgSXQgaXMgZXhwZWN0ZWQgdGhhdCByZW1vdGUgcGF0aCBwb2ludHMgdG8gYSBmaWxlIGFuZCBub3QgdG8gYSBmb2xkZXIuIGAgK1xuICAgICAgICAgICAgICAgICAgICAgIGAnJHtyZW1vdGVQYXRofScgaXMgZ2l2ZW4gaW5zdGVhZGApO1xuICB9XG4gIGlmICh0aGlzLmlzU2ltdWxhdG9yKCkpIHtcbiAgICByZXR1cm4gYXdhaXQgcHVzaEZpbGVUb1NpbXVsYXRvcih0aGlzLm9wdHMuZGV2aWNlLCByZW1vdGVQYXRoLCBiYXNlNjREYXRhKTtcbiAgfVxuICByZXR1cm4gYXdhaXQgcHVzaEZpbGVUb1JlYWxEZXZpY2UodGhpcy5vcHRzLmRldmljZSwgcmVtb3RlUGF0aCwgYmFzZTY0RGF0YSk7XG59O1xuXG5jb21tYW5kcy5wdWxsRmlsZSA9IGFzeW5jIGZ1bmN0aW9uIChyZW1vdGVQYXRoKSB7XG4gIGlmIChyZW1vdGVQYXRoLmVuZHNXaXRoKCcvJykpIHtcbiAgICBsb2cuZXJyb3JBbmRUaHJvdyhgSXQgaXMgZXhwZWN0ZWQgdGhhdCByZW1vdGUgcGF0aCBwb2ludHMgdG8gYSBmaWxlIGFuZCBub3QgdG8gYSBmb2xkZXIuIGAgK1xuICAgICAgICAgICAgICAgICAgICAgIGAnJHtyZW1vdGVQYXRofScgaXMgZ2l2ZW4gaW5zdGVhZGApO1xuICB9XG4gIGlmICh0aGlzLmlzU2ltdWxhdG9yKCkpIHtcbiAgICByZXR1cm4gYXdhaXQgcHVsbEZpbGVGcm9tU2ltdWxhdG9yKHRoaXMub3B0cy5kZXZpY2UsIHJlbW90ZVBhdGgpO1xuICB9XG4gIHJldHVybiBhd2FpdCBwdWxsRmlsZUZyb21SZWFsRGV2aWNlKHRoaXMub3B0cy5kZXZpY2UsIHJlbW90ZVBhdGgpO1xufTtcblxuZnVuY3Rpb24gZXh0cmFjdE1hbmRhdG9yeU9wdGlvbnMgKG9wdHMgPSB7fSwga2V5cykge1xuICBjb25zdCByZXN1bHQgPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgIGNvbnN0IHZhbHVlID0gb3B0c1trZXldO1xuICAgIGlmICghXy5pc1N0cmluZyh2YWx1ZSkgfHwgXy5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgbG9nLmVycm9yQW5kVGhyb3coYCcke2tleX0nIGlzIGV4cGVjdGVkIHRvIGJlIGEgdmFsaWQgc3RyaW5nLiAnJHt2YWx1ZX0nIGlzIGdpdmVuIGluc3RlYWRgKTtcbiAgICB9XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5jb21tYW5kcy5tb2JpbGVJbnN0YWxsQXBwID0gYXN5bmMgZnVuY3Rpb24gKG9wdHMgPSB7fSkge1xuICBjb25zdCB7YXBwfSA9IGV4dHJhY3RNYW5kYXRvcnlPcHRpb25zKG9wdHMsIFsnYXBwJ10pO1xuICBjb25zdCBkc3RQYXRoID0gYXdhaXQgdGhpcy5oZWxwZXJzLmNvbmZpZ3VyZUFwcChhcHAsICcuYXBwJyk7XG4gIGxvZy5pbmZvKGBJbnN0YWxsaW5nICcke2RzdFBhdGh9JyB0byB0aGUgJHt0aGlzLmlzUmVhbERldmljZSgpID8gJ3JlYWwgZGV2aWNlJyA6ICdTaW11bGF0b3InfSBgICtcbiAgICAgICAgICAgYHdpdGggVURJRCAke3RoaXMub3B0cy5kZXZpY2UudWRpZH1gKTtcbiAgaWYgKCFhd2FpdCBmcy5leGlzdHMoZHN0UGF0aCkpIHtcbiAgICBsb2cuZXJyb3JBbmRUaHJvdyhgVGhlIGFwcGxpY2F0aW9uIGF0ICcke2RzdFBhdGh9JyBkb2VzIG5vdCBleGlzdCBvciBpcyBub3QgYWNjZXNzaWJsZWApO1xuICB9XG4gIHRyeSB7XG4gICAgYXdhaXQgdGhpcy5vcHRzLmRldmljZS5pbnN0YWxsQXBwKGRzdFBhdGgpO1xuICAgIGxvZy5pbmZvKGBJbnN0YWxsYXRpb24gb2YgJyR7ZHN0UGF0aH0nIHN1Y2NlZWRlZGApO1xuICB9IGZpbmFsbHkge1xuICAgIGlmIChkc3RQYXRoICE9PSBhcHApIHtcbiAgICAgIGF3YWl0IGZzLnJpbXJhZihkc3RQYXRoKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbW1hbmRzLm1vYmlsZUlzQXBwSW5zdGFsbGVkID0gYXN5bmMgZnVuY3Rpb24gKG9wdHMgPSB7fSkge1xuICByZXR1cm4gYXdhaXQgdGhpcy5vcHRzLmRldmljZS5pc0FwcEluc3RhbGxlZChleHRyYWN0TWFuZGF0b3J5T3B0aW9ucyhvcHRzLCBbJ2J1bmRsZUlkJ10pKTtcbn07XG5cbmNvbW1hbmRzLm1vYmlsZVJlbW92ZUFwcCA9IGFzeW5jIGZ1bmN0aW9uIChvcHRzID0ge30pIHtcbiAgY29uc3Qge2J1bmRsZUlkfSA9IGV4dHJhY3RNYW5kYXRvcnlPcHRpb25zKG9wdHMsIFsnYnVuZGxlSWQnXSk7XG4gIGxvZy5pbmZvKGBVbmluc3RhbGxpbmcgdGhlIGFwcGxpY2F0aW9uIHdpdGggYnVuZGxlIGlkZW50aWZpZXIgJyR7YnVuZGxlSWR9JyBgICtcbiAgICBgZnJvbSB0aGUgJHt0aGlzLmlzUmVhbERldmljZSgpID8gJ3JlYWwgZGV2aWNlJyA6ICdTaW11bGF0b3InfSB3aXRoIFVESUQgJHt0aGlzLm9wdHMuZGV2aWNlLnVkaWR9YCk7XG4gIGF3YWl0IHRoaXMub3B0cy5kZXZpY2UucmVtb3ZlQXBwKCk7XG4gIGxvZy5pbmZvKGBSZW1vdmFsIG9mICcke2J1bmRsZUlkfScgc3VjY2VlZGVkYCk7XG59O1xuXG5jb21tYW5kcy5tb2JpbGVMYXVuY2hBcHAgPSBhc3luYyBmdW5jdGlvbiAob3B0cyA9IHt9KSB7XG4gIGNvbnN0IHdkYU9wdHMgPSBleHRyYWN0TWFuZGF0b3J5T3B0aW9ucyhvcHRzLCBbJ2J1bmRsZUlkJ10pO1xuICBpZiAob3B0cy5hcmd1bWVudHMpIHtcbiAgICB3ZGFPcHRzLmFyZ3VtZW50cyA9IF8uaXNBcnJheShvcHRzLmFyZ3VtZW50cykgPyBvcHRzLmFyZ3VtZW50cyA6IFtvcHRzLmFyZ3VtZW50c107XG4gIH1cbiAgaWYgKG9wdHMuZW52aXJvbm1lbnQpIHtcbiAgICB3ZGFPcHRzLmVudmlyb25tZW50ID0gb3B0cy5lbnZpcm9ubWVudDtcbiAgfVxuICByZXR1cm4gYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoJy93ZGEvYXBwcy9sYXVuY2gnLCAnUE9TVCcsIHdkYU9wdHMpO1xufTtcblxuY29tbWFuZHMubW9iaWxlVGVybWluYXRlQXBwID0gYXN5bmMgZnVuY3Rpb24gKG9wdHMgPSB7fSkge1xuICByZXR1cm4gYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoJy93ZGEvYXBwcy90ZXJtaW5hdGUnLCAnUE9TVCcsIGV4dHJhY3RNYW5kYXRvcnlPcHRpb25zKG9wdHMsIFsnYnVuZGxlSWQnXSkpO1xufTtcblxuY29tbWFuZHMubW9iaWxlQWN0aXZhdGVBcHAgPSBhc3luYyBmdW5jdGlvbiAob3B0cyA9IHt9KSB7XG4gIHJldHVybiBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZCgnL3dkYS9hcHBzL2FjdGl2YXRlJywgJ1BPU1QnLCBleHRyYWN0TWFuZGF0b3J5T3B0aW9ucyhvcHRzLCBbJ2J1bmRsZUlkJ10pKTtcbn07XG5cbmNvbW1hbmRzLm1vYmlsZVF1ZXJ5QXBwU3RhdGUgPSBhc3luYyBmdW5jdGlvbiAob3B0cyA9IHt9KSB7XG4gIHJldHVybiBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZCgnL3dkYS9hcHBzL3N0YXRlJywgJ1BPU1QnLCBleHRyYWN0TWFuZGF0b3J5T3B0aW9ucyhvcHRzLCBbJ2J1bmRsZUlkJ10pKTtcbn07XG5cblxuZXhwb3J0IGRlZmF1bHQgY29tbWFuZHM7XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uLy4uIn0=
