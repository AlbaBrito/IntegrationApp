'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _appiumSupport = require('appium-support');

var _teen_process = require('teen_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var WDA_RUNNER_BUNDLE_ID = 'com.facebook.WebDriverAgentRunner';
var PROJECT_FILE = 'project.pbxproj';
var XCUICOORDINATE_FILE = 'PrivateHeaders/XCTest/XCUICoordinate.h';
var FBMACROS_FILE = 'WebDriverAgentLib/Utilities/FBMacros.h';
var XCUIAPPLICATION_FILE = 'PrivateHeaders/XCTest/XCUIApplication.h';
var FBSESSION_FILE = 'WebDriverAgentLib/Routing/FBSession.m';

function replaceInFile(file, find, replace) {
  var contents, newContents;
  return _regeneratorRuntime.async(function replaceInFile$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.readFile(file, 'utf-8'));

      case 2:
        contents = context$1$0.sent;
        newContents = contents.replace(find, replace);

        if (!(newContents !== contents)) {
          context$1$0.next = 7;
          break;
        }

        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.writeFile(file, newContents, 'utf-8'));

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

/**
 * Update WebDriverAgentRunner project bundle ID with newBundleId.
 * This method assumes project file is in the correct state.
 * @param {string} agentPath - Path to the .xcodeproj directory.
 * @param {string} newBundleId the new bundle ID used to update.
 */
function updateProjectFile(agentPath, newBundleId) {
  var projectFilePath;
  return _regeneratorRuntime.async(function updateProjectFile$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        projectFilePath = agentPath + '/' + PROJECT_FILE;
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.copyFile(projectFilePath, projectFilePath + '.old'));

      case 4:
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(replaceInFile(projectFilePath, new RegExp(WDA_RUNNER_BUNDLE_ID.replace('.', '\.'), 'g'), newBundleId));

      case 6:
        _logger2['default'].debug('Successfully updated \'' + projectFilePath + '\' with bundle id \'' + newBundleId + '\'');
        context$1$0.next = 13;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0['catch'](1);

        _logger2['default'].debug('Error updating project file: ' + context$1$0.t0.message);
        _logger2['default'].warn('Unable to update project file \'' + projectFilePath + '\' with ' + ('bundle id \'' + newBundleId + '\'. WebDriverAgent may not start'));

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 9]]);
}

/**
 * Reset WebDriverAgentRunner project bundle ID to correct state.
 * @param {string} agentPath - Path to the .xcodeproj directory.
 */
function resetProjectFile(agentPath) {
  var projectFilePath;
  return _regeneratorRuntime.async(function resetProjectFile$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        projectFilePath = agentPath + '/' + PROJECT_FILE;
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(projectFilePath + '.old'));

      case 4:
        if (context$1$0.sent) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt('return');

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.mv(projectFilePath + '.old', projectFilePath));

      case 8:
        _logger2['default'].debug('Successfully reset \'' + projectFilePath + '\' with bundle id \'' + WDA_RUNNER_BUNDLE_ID + '\'');
        context$1$0.next = 15;
        break;

      case 11:
        context$1$0.prev = 11;
        context$1$0.t0 = context$1$0['catch'](1);

        _logger2['default'].debug('Error resetting project file: ' + context$1$0.t0.message);
        _logger2['default'].warn('Unable to reset project file \'' + projectFilePath + '\' with ' + ('bundle id \'' + WDA_RUNNER_BUNDLE_ID + '\'. WebDriverAgent has been ') + 'modified and not returned to the original state.');

      case 15:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 11]]);
}

function checkForDependencies(bootstrapPath) {
  var useSsl = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var carthagePath, carthageRoot, args, _arr, _i, std, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, line;

  return _regeneratorRuntime.async(function checkForDependencies$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.which('carthage'));

      case 3:
        carthagePath = context$1$0.sent;

        _logger2['default'].debug('Carthage found: \'' + carthagePath + '\'');
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](0);

        _logger2['default'].errorAndThrow('Carthage binary is not found. Install using `brew install carthage` if it is not installed ' + 'and make sure the root folder, where carthage binary is installed, is present in PATH environment variable. ' + ('The current PATH value: \'' + (process.env.PATH ? process.env.PATH : "<not defined for the Appium process>") + '\''));

      case 10:
        carthageRoot = bootstrapPath + '/Carthage';
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.hasAccess(carthageRoot));

      case 13:
        if (context$1$0.sent) {
          context$1$0.next = 60;
          break;
        }

        _logger2['default'].debug('Running WebDriverAgent bootstrap script to install dependencies');
        context$1$0.prev = 15;
        args = useSsl ? ['-d', '-D'] : ['-d'];
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('Scripts/bootstrap.sh', args, { cwd: bootstrapPath }));

      case 19:
        context$1$0.next = 60;
        break;

      case 21:
        context$1$0.prev = 21;
        context$1$0.t1 = context$1$0['catch'](15);
        _arr = ['stdout', 'stderr'];
        _i = 0;

      case 25:
        if (!(_i < _arr.length)) {
          context$1$0.next = 57;
          break;
        }

        std = _arr[_i];
        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;
        context$1$0.prev = 30;
        _iterator = _getIterator((context$1$0.t1[std] || '').split('\n'));

      case 32:
        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
          context$1$0.next = 40;
          break;
        }

        line = _step.value;

        if (line.length) {
          context$1$0.next = 36;
          break;
        }

        return context$1$0.abrupt('continue', 37);

      case 36:
        _logger2['default'].error(line);

      case 37:
        _iteratorNormalCompletion = true;
        context$1$0.next = 32;
        break;

      case 40:
        context$1$0.next = 46;
        break;

      case 42:
        context$1$0.prev = 42;
        context$1$0.t2 = context$1$0['catch'](30);
        _didIteratorError = true;
        _iteratorError = context$1$0.t2;

      case 46:
        context$1$0.prev = 46;
        context$1$0.prev = 47;

        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }

      case 49:
        context$1$0.prev = 49;

        if (!_didIteratorError) {
          context$1$0.next = 52;
          break;
        }

        throw _iteratorError;

      case 52:
        return context$1$0.finish(49);

      case 53:
        return context$1$0.finish(46);

      case 54:
        _i++;
        context$1$0.next = 25;
        break;

      case 57:
        context$1$0.next = 59;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.rimraf(carthageRoot));

      case 59:
        throw context$1$0.t1;

      case 60:
        context$1$0.next = 62;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.hasAccess(bootstrapPath + '/Resources'));

      case 62:
        if (context$1$0.sent) {
          context$1$0.next = 66;
          break;
        }

        _logger2['default'].debug('Creating WebDriverAgent resources directory');
        context$1$0.next = 66;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.mkdir(bootstrapPath + '/Resources'));

      case 66:
        context$1$0.next = 68;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.hasAccess(bootstrapPath + '/Resources/WebDriverAgent.bundle'));

      case 68:
        if (context$1$0.sent) {
          context$1$0.next = 72;
          break;
        }

        _logger2['default'].debug('Creating WebDriverAgent resource bundle directory');
        context$1$0.next = 72;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.mkdir(bootstrapPath + '/Resources/WebDriverAgent.bundle'));

      case 72:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 7], [15, 21], [30, 42, 46, 54], [47,, 49, 53]]);
}

function setRealDeviceSecurity(keychainPath, keychainPassword) {
  return _regeneratorRuntime.async(function setRealDeviceSecurity$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug('Setting security for iOS device');
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('security', ['-v', 'list-keychains', '-s', keychainPath]));

      case 3:
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('security', ['-v', 'unlock-keychain', '-p', keychainPassword, keychainPath]));

      case 5:
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('security', ['set-keychain-settings', '-t', '3600', '-l', keychainPath]));

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function fixXCUICoordinateFile(bootstrapPath) {
  var initial = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  var file, oldDef, newDef, _ref;

  return _regeneratorRuntime.async(function fixXCUICoordinateFile$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        file = _path2['default'].resolve(bootstrapPath, XCUICOORDINATE_FILE);
        oldDef = '- (void)pressForDuration:(double)arg1 thenDragToCoordinate:(id)arg2;';
        newDef = '- (void)pressForDuration:(NSTimeInterval)duration thenDragToCoordinate:(XCUICoordinate *)otherCoordinate;';

        if (!initial) {
          _ref = [newDef, oldDef];
          oldDef = _ref[0];
          newDef = _ref[1];
        }
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(replaceInFile(file, oldDef, newDef));

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function fixFBSessionFile(bootstrapPath) {
  var initial = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  var file, oldLine, newLine, _ref2;

  return _regeneratorRuntime.async(function fixFBSessionFile$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        file = _path2['default'].resolve(bootstrapPath, FBSESSION_FILE);
        oldLine = 'return [FBApplication fb_activeApplication] ?: self.testedApplication;';
        newLine = 'FBApplication *application = [FBApplication fb_activeApplication] ?: self.testedApplication;\n' + '  return application;';

        if (!initial) {
          _ref2 = [newLine, oldLine];
          oldLine = _ref2[0];
          newLine = _ref2[1];
        }
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(replaceInFile(file, oldLine, newLine));

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function fixForXcode7(bootstrapPath) {
  var initial = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
  var fixXcode9 = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
  return _regeneratorRuntime.async(function fixForXcode7$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!fixXcode9) {
          context$1$0.next = 3;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(fixForXcode9(bootstrapPath, !initial, false));

      case 3:
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(fixXCUICoordinateFile(bootstrapPath, initial));

      case 5:
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(fixFBSessionFile(bootstrapPath, initial));

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function fixFBMacrosFile(bootstrapPath) {
  var initial = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  var file, oldDef, newDef, _ref3;

  return _regeneratorRuntime.async(function fixFBMacrosFile$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        file = _path2['default'].resolve(bootstrapPath, FBMACROS_FILE);
        oldDef = '#define FBStringify(class, property) ({if(NO){[class.new property];} @#property;})';
        newDef = '#define FBStringify(class, property) ({@#property;})';

        if (!initial) {
          _ref3 = [newDef, oldDef];
          oldDef = _ref3[0];
          newDef = _ref3[1];
        }
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(replaceInFile(file, oldDef, newDef));

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function fixXCUIApplicationFile(bootstrapPath) {
  var initial = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  var file, oldDef, newDef, _ref4;

  return _regeneratorRuntime.async(function fixXCUIApplicationFile$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        file = _path2['default'].resolve(bootstrapPath, XCUIAPPLICATION_FILE);
        oldDef = '@property(nonatomic, readonly) NSUInteger state; // @synthesize state=_state;';
        newDef = '@property XCUIApplicationState state;';

        if (!initial) {
          _ref4 = [newDef, oldDef];
          oldDef = _ref4[0];
          newDef = _ref4[1];
        }
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(replaceInFile(file, oldDef, newDef));

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function fixForXcode9(bootstrapPath) {
  var initial = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
  var fixXcode7 = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
  return _regeneratorRuntime.async(function fixForXcode9$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!fixXcode7) {
          context$1$0.next = 3;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(fixForXcode7(bootstrapPath, !initial, false));

      case 3:
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(fixFBMacrosFile(bootstrapPath, initial));

      case 5:
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(fixXCUIApplicationFile(bootstrapPath, initial));

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function generateXcodeConfigFile(orgId, signingId) {
  var contents, xcconfigPath;
  return _regeneratorRuntime.async(function generateXcodeConfigFile$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug('Generating xcode config file for orgId \'' + orgId + '\' and signingId ' + ('\'' + signingId + '\''));
        contents = 'DEVELOPMENT_TEAM = ' + orgId + '\nCODE_SIGN_IDENTITY = ' + signingId + '\n';
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(_appiumSupport.tempDir.path('appium-temp.xcconfig'));

      case 4:
        xcconfigPath = context$1$0.sent;

        _logger2['default'].debug('Writing xcode config file to ' + xcconfigPath);
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.writeFile(xcconfigPath, contents, "utf8"));

      case 8:
        return context$1$0.abrupt('return', xcconfigPath);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

/**
 * Creates xctestrun file per device & platform version.
 * We expects to have WebDriverAgentRunner_iphoneos${platformVersion}-arm64.xctestrun for real device
 * and WebDriverAgentRunner_iphonesimulator${platformVersion}-x86_64.xctestrun for simulator located @bootstrapPath
 *
 * @param {boolean} isRealDevice - Equals to true if the current device is a real device
 * @param {string} udid - The device UDID.
 * @param {string} platformVersion - The platform version of OS.
 * @param {string} bootstrapPath - The folder path containing xctestrun file.
 * @param {string} wdaRemotePort - The remote port WDA is listening on.
 * @return {string} returns xctestrunFilePath for given device
 * @throws if WebDriverAgentRunner_iphoneos${platformVersion}-arm64.xctestrun for real device
 * or WebDriverAgentRunner_iphonesimulator${platformVersion}-x86_64.xctestrun for simulator is not found @bootstrapPath,
 * then it will throw file not found exception
 */
function setXctestrunFile(isRealDevice, udid, platformVersion, bootstrapPath, wdaRemotePort) {
  var xctestrunDeviceFileName, xctestrunFilePath, xctestBaseFileName, originalXctestrunFile, xctestRunContent, updateWDAPort, newXctestRunContent;
  return _regeneratorRuntime.async(function setXctestrunFile$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        xctestrunDeviceFileName = udid + '_' + platformVersion + '.xctestrun';
        xctestrunFilePath = _path2['default'].resolve(bootstrapPath, xctestrunDeviceFileName);
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(xctestrunFilePath));

      case 4:
        if (context$1$0.sent) {
          context$1$0.next = 13;
          break;
        }

        xctestBaseFileName = isRealDevice ? 'WebDriverAgentRunner_iphoneos' + platformVersion + '-arm64.xctestrun' : 'WebDriverAgentRunner_iphonesimulator' + platformVersion + '-x86_64.xctestrun';
        originalXctestrunFile = _path2['default'].resolve(bootstrapPath, xctestBaseFileName);
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(originalXctestrunFile));

      case 9:
        if (context$1$0.sent) {
          context$1$0.next = 11;
          break;
        }

        _logger2['default'].errorAndThrow('if you are using useXctestrunFile capability then you need to have ' + originalXctestrunFile + ' file');

      case 11:
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.copyFile(originalXctestrunFile, xctestrunFilePath));

      case 13:
        context$1$0.next = 15;
        return _regeneratorRuntime.awrap(_appiumSupport.plist.parsePlistFile(xctestrunFilePath));

      case 15:
        xctestRunContent = context$1$0.sent;
        updateWDAPort = {
          WebDriverAgentRunner: {
            EnvironmentVariables: {
              USE_PORT: wdaRemotePort
            }
          }
        };
        newXctestRunContent = _lodash2['default'].merge(xctestRunContent, updateWDAPort);
        context$1$0.next = 20;
        return _regeneratorRuntime.awrap(_appiumSupport.plist.updatePlistFile(xctestrunFilePath, newXctestRunContent, true));

      case 20:
        return context$1$0.abrupt('return', xctestrunFilePath);

      case 21:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function killProcess(name, proc) {
  return _regeneratorRuntime.async(function killProcess$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!(proc && proc.proc)) {
          context$1$0.next = 22;
          break;
        }

        _logger2['default'].info('Shutting down ' + name + ' process (pid ' + proc.proc.pid + ')');
        context$1$0.prev = 2;
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(proc.stop('SIGTERM', 1000));

      case 5:
        context$1$0.next = 22;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](2);

        if (!(context$1$0.t0.message.indexOf('Process didn\'t end after') === -1)) {
          context$1$0.next = 11;
          break;
        }

        throw context$1$0.t0;

      case 11:
        _logger2['default'].debug(name + ' process did not end in a timely fashion: \'' + context$1$0.t0.message + '\'. ' + 'Sending \'SIGKILL\'...');
        context$1$0.prev = 12;
        context$1$0.next = 15;
        return _regeneratorRuntime.awrap(proc.stop('SIGKILL'));

      case 15:
        context$1$0.next = 22;
        break;

      case 17:
        context$1$0.prev = 17;
        context$1$0.t1 = context$1$0['catch'](12);

        if (!(context$1$0.t1.message.indexOf('not currently running') !== -1)) {
          context$1$0.next = 21;
          break;
        }

        return context$1$0.abrupt('return');

      case 21:
        throw context$1$0.t1;

      case 22:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[2, 7], [12, 17]]);
}

/**
 * Generate a random integer.
 *
 * @return {number} A random integer number in range [low, hight). `low`` is inclusive and `high` is exclusive.
 */
function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

exports.updateProjectFile = updateProjectFile;
exports.resetProjectFile = resetProjectFile;
exports.checkForDependencies = checkForDependencies;
exports.setRealDeviceSecurity = setRealDeviceSecurity;
exports.fixForXcode7 = fixForXcode7;
exports.fixForXcode9 = fixForXcode9;
exports.generateXcodeConfigFile = generateXcodeConfigFile;
exports.setXctestrunFile = setXctestrunFile;
exports.killProcess = killProcess;
exports.randomInt = randomInt;

// Assuming projectFilePath is in the correct state, create .old from projectFilePath

// restore projectFilePath from .old file
// no need to reset

// print out the stdout and stderr reports

// remove the carthage directory, or else subsequent runs will see it and
// assume the dependencies are already downloaded

// the way the updated XCTest headers are in the WDA project, building in
// Xcode 8.0 causes a duplicate declaration of method
// so fix the offending line in the local headers

// If this is first time run for given device, then first generate xctestrun file for device.
// We need to have a xctestrun file per device because we cant not have same wda port for all devices.

// the process ended but for some reason we were not informed
//# sourceMappingURL=data:application/json;charset=utf8;base64,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Ozs7Ozs7O0NBUTlEOzs7Ozs7O0FBT0QsU0FBUyxTQUFTLENBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtBQUM3QixTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUEsQUFBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0NBQ3ZEOztRQUVRLGlCQUFpQixHQUFqQixpQkFBaUI7UUFBRSxnQkFBZ0IsR0FBaEIsZ0JBQWdCO1FBQUUsb0JBQW9CLEdBQXBCLG9CQUFvQjtRQUN6RCxxQkFBcUIsR0FBckIscUJBQXFCO1FBQUUsWUFBWSxHQUFaLFlBQVk7UUFBRSxZQUFZLEdBQVosWUFBWTtRQUNqRCx1QkFBdUIsR0FBdkIsdUJBQXVCO1FBQUUsZ0JBQWdCLEdBQWhCLGdCQUFnQjtRQUFFLFdBQVcsR0FBWCxXQUFXO1FBQUUsU0FBUyxHQUFULFNBQVMiLCJmaWxlIjoibGliL3dkYS91dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZzLCB0ZW1wRGlyLCBwbGlzdCB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICd0ZWVuX3Byb2Nlc3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgbG9nIGZyb20gJy4uL2xvZ2dlcic7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5cbmNvbnN0IFdEQV9SVU5ORVJfQlVORExFX0lEID0gJ2NvbS5mYWNlYm9vay5XZWJEcml2ZXJBZ2VudFJ1bm5lcic7XG5jb25zdCBQUk9KRUNUX0ZJTEUgPSAncHJvamVjdC5wYnhwcm9qJztcbmNvbnN0IFhDVUlDT09SRElOQVRFX0ZJTEUgPSAnUHJpdmF0ZUhlYWRlcnMvWENUZXN0L1hDVUlDb29yZGluYXRlLmgnO1xuY29uc3QgRkJNQUNST1NfRklMRSA9ICdXZWJEcml2ZXJBZ2VudExpYi9VdGlsaXRpZXMvRkJNYWNyb3MuaCc7XG5jb25zdCBYQ1VJQVBQTElDQVRJT05fRklMRSA9ICdQcml2YXRlSGVhZGVycy9YQ1Rlc3QvWENVSUFwcGxpY2F0aW9uLmgnO1xuY29uc3QgRkJTRVNTSU9OX0ZJTEUgPSAnV2ViRHJpdmVyQWdlbnRMaWIvUm91dGluZy9GQlNlc3Npb24ubSc7XG5cbmFzeW5jIGZ1bmN0aW9uIHJlcGxhY2VJbkZpbGUgKGZpbGUsIGZpbmQsIHJlcGxhY2UpIHtcbiAgbGV0IGNvbnRlbnRzID0gYXdhaXQgZnMucmVhZEZpbGUoZmlsZSwgJ3V0Zi04Jyk7XG5cbiAgbGV0IG5ld0NvbnRlbnRzID0gY29udGVudHMucmVwbGFjZShmaW5kLCByZXBsYWNlKTtcbiAgaWYgKG5ld0NvbnRlbnRzICE9PSBjb250ZW50cykge1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShmaWxlLCBuZXdDb250ZW50cywgJ3V0Zi04Jyk7XG4gIH1cbn1cblxuLyoqXG4gKiBVcGRhdGUgV2ViRHJpdmVyQWdlbnRSdW5uZXIgcHJvamVjdCBidW5kbGUgSUQgd2l0aCBuZXdCdW5kbGVJZC5cbiAqIFRoaXMgbWV0aG9kIGFzc3VtZXMgcHJvamVjdCBmaWxlIGlzIGluIHRoZSBjb3JyZWN0IHN0YXRlLlxuICogQHBhcmFtIHtzdHJpbmd9IGFnZW50UGF0aCAtIFBhdGggdG8gdGhlIC54Y29kZXByb2ogZGlyZWN0b3J5LlxuICogQHBhcmFtIHtzdHJpbmd9IG5ld0J1bmRsZUlkIHRoZSBuZXcgYnVuZGxlIElEIHVzZWQgdG8gdXBkYXRlLlxuICovXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVQcm9qZWN0RmlsZSAoYWdlbnRQYXRoLCBuZXdCdW5kbGVJZCkge1xuICBsZXQgcHJvamVjdEZpbGVQYXRoID0gYCR7YWdlbnRQYXRofS8ke1BST0pFQ1RfRklMRX1gO1xuICB0cnkge1xuICAgIC8vIEFzc3VtaW5nIHByb2plY3RGaWxlUGF0aCBpcyBpbiB0aGUgY29ycmVjdCBzdGF0ZSwgY3JlYXRlIC5vbGQgZnJvbSBwcm9qZWN0RmlsZVBhdGhcbiAgICBhd2FpdCBmcy5jb3B5RmlsZShwcm9qZWN0RmlsZVBhdGgsIGAke3Byb2plY3RGaWxlUGF0aH0ub2xkYCk7XG4gICAgYXdhaXQgcmVwbGFjZUluRmlsZShwcm9qZWN0RmlsZVBhdGgsIG5ldyBSZWdFeHAoV0RBX1JVTk5FUl9CVU5ETEVfSUQucmVwbGFjZSgnLicsICdcXC4nKSwgJ2cnKSwgbmV3QnVuZGxlSWQpO1xuICAgIGxvZy5kZWJ1ZyhgU3VjY2Vzc2Z1bGx5IHVwZGF0ZWQgJyR7cHJvamVjdEZpbGVQYXRofScgd2l0aCBidW5kbGUgaWQgJyR7bmV3QnVuZGxlSWR9J2ApO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBsb2cuZGVidWcoYEVycm9yIHVwZGF0aW5nIHByb2plY3QgZmlsZTogJHtlcnIubWVzc2FnZX1gKTtcbiAgICBsb2cud2FybihgVW5hYmxlIHRvIHVwZGF0ZSBwcm9qZWN0IGZpbGUgJyR7cHJvamVjdEZpbGVQYXRofScgd2l0aCBgICtcbiAgICAgICAgICAgICBgYnVuZGxlIGlkICcke25ld0J1bmRsZUlkfScuIFdlYkRyaXZlckFnZW50IG1heSBub3Qgc3RhcnRgKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlc2V0IFdlYkRyaXZlckFnZW50UnVubmVyIHByb2plY3QgYnVuZGxlIElEIHRvIGNvcnJlY3Qgc3RhdGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWdlbnRQYXRoIC0gUGF0aCB0byB0aGUgLnhjb2RlcHJvaiBkaXJlY3RvcnkuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlc2V0UHJvamVjdEZpbGUgKGFnZW50UGF0aCkge1xuICBsZXQgcHJvamVjdEZpbGVQYXRoID0gYCR7YWdlbnRQYXRofS8ke1BST0pFQ1RfRklMRX1gO1xuICB0cnkge1xuICAgIC8vIHJlc3RvcmUgcHJvamVjdEZpbGVQYXRoIGZyb20gLm9sZCBmaWxlXG4gICAgaWYgKCFhd2FpdCBmcy5leGlzdHMoYCR7cHJvamVjdEZpbGVQYXRofS5vbGRgKSkge1xuICAgICAgcmV0dXJuOyAgLy8gbm8gbmVlZCB0byByZXNldFxuICAgIH1cbiAgICBhd2FpdCBmcy5tdihgJHtwcm9qZWN0RmlsZVBhdGh9Lm9sZGAsIHByb2plY3RGaWxlUGF0aCk7XG4gICAgbG9nLmRlYnVnKGBTdWNjZXNzZnVsbHkgcmVzZXQgJyR7cHJvamVjdEZpbGVQYXRofScgd2l0aCBidW5kbGUgaWQgJyR7V0RBX1JVTk5FUl9CVU5ETEVfSUR9J2ApO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBsb2cuZGVidWcoYEVycm9yIHJlc2V0dGluZyBwcm9qZWN0IGZpbGU6ICR7ZXJyLm1lc3NhZ2V9YCk7XG4gICAgbG9nLndhcm4oYFVuYWJsZSB0byByZXNldCBwcm9qZWN0IGZpbGUgJyR7cHJvamVjdEZpbGVQYXRofScgd2l0aCBgICtcbiAgICAgICAgICAgICBgYnVuZGxlIGlkICcke1dEQV9SVU5ORVJfQlVORExFX0lEfScuIFdlYkRyaXZlckFnZW50IGhhcyBiZWVuIGAgK1xuICAgICAgICAgICAgIGBtb2RpZmllZCBhbmQgbm90IHJldHVybmVkIHRvIHRoZSBvcmlnaW5hbCBzdGF0ZS5gKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBjaGVja0ZvckRlcGVuZGVuY2llcyAoYm9vdHN0cmFwUGF0aCwgdXNlU3NsID0gZmFsc2UpIHtcbiAgdHJ5IHtcbiAgICBsZXQgY2FydGhhZ2VQYXRoID0gYXdhaXQgZnMud2hpY2goJ2NhcnRoYWdlJyk7XG4gICAgbG9nLmRlYnVnKGBDYXJ0aGFnZSBmb3VuZDogJyR7Y2FydGhhZ2VQYXRofSdgKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nLmVycm9yQW5kVGhyb3coJ0NhcnRoYWdlIGJpbmFyeSBpcyBub3QgZm91bmQuIEluc3RhbGwgdXNpbmcgYGJyZXcgaW5zdGFsbCBjYXJ0aGFnZWAgaWYgaXQgaXMgbm90IGluc3RhbGxlZCAnICtcbiAgICAgICdhbmQgbWFrZSBzdXJlIHRoZSByb290IGZvbGRlciwgd2hlcmUgY2FydGhhZ2UgYmluYXJ5IGlzIGluc3RhbGxlZCwgaXMgcHJlc2VudCBpbiBQQVRIIGVudmlyb25tZW50IHZhcmlhYmxlLiAnICtcbiAgICAgIGBUaGUgY3VycmVudCBQQVRIIHZhbHVlOiAnJHtwcm9jZXNzLmVudi5QQVRIID8gcHJvY2Vzcy5lbnYuUEFUSCA6IFwiPG5vdCBkZWZpbmVkIGZvciB0aGUgQXBwaXVtIHByb2Nlc3M+XCJ9J2ApO1xuICB9XG4gIGNvbnN0IGNhcnRoYWdlUm9vdCA9IGAke2Jvb3RzdHJhcFBhdGh9L0NhcnRoYWdlYDtcbiAgaWYgKCFhd2FpdCBmcy5oYXNBY2Nlc3MoY2FydGhhZ2VSb290KSkge1xuICAgIGxvZy5kZWJ1ZygnUnVubmluZyBXZWJEcml2ZXJBZ2VudCBib290c3RyYXAgc2NyaXB0IHRvIGluc3RhbGwgZGVwZW5kZW5jaWVzJyk7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBhcmdzID0gdXNlU3NsID8gWyctZCcsICctRCddIDogWyctZCddO1xuICAgICAgYXdhaXQgZXhlYygnU2NyaXB0cy9ib290c3RyYXAuc2gnLCBhcmdzLCB7Y3dkOiBib290c3RyYXBQYXRofSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBwcmludCBvdXQgdGhlIHN0ZG91dCBhbmQgc3RkZXJyIHJlcG9ydHNcbiAgICAgIGZvciAobGV0IHN0ZCBvZiBbJ3N0ZG91dCcsICdzdGRlcnInXSkge1xuICAgICAgICBmb3IgKGxldCBsaW5lIG9mIChlcnJbc3RkXSB8fCAnJykuc3BsaXQoJ1xcbicpKSB7XG4gICAgICAgICAgaWYgKCFsaW5lLmxlbmd0aCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxvZy5lcnJvcihsaW5lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gcmVtb3ZlIHRoZSBjYXJ0aGFnZSBkaXJlY3RvcnksIG9yIGVsc2Ugc3Vic2VxdWVudCBydW5zIHdpbGwgc2VlIGl0IGFuZFxuICAgICAgLy8gYXNzdW1lIHRoZSBkZXBlbmRlbmNpZXMgYXJlIGFscmVhZHkgZG93bmxvYWRlZFxuICAgICAgYXdhaXQgZnMucmltcmFmKGNhcnRoYWdlUm9vdCk7XG5cbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cbiAgaWYgKCFhd2FpdCBmcy5oYXNBY2Nlc3MoYCR7Ym9vdHN0cmFwUGF0aH0vUmVzb3VyY2VzYCkpIHtcbiAgICBsb2cuZGVidWcoJ0NyZWF0aW5nIFdlYkRyaXZlckFnZW50IHJlc291cmNlcyBkaXJlY3RvcnknKTtcbiAgICBhd2FpdCBmcy5ta2RpcihgJHtib290c3RyYXBQYXRofS9SZXNvdXJjZXNgKTtcbiAgfVxuICBpZiAoIWF3YWl0IGZzLmhhc0FjY2VzcyhgJHtib290c3RyYXBQYXRofS9SZXNvdXJjZXMvV2ViRHJpdmVyQWdlbnQuYnVuZGxlYCkpIHtcbiAgICBsb2cuZGVidWcoJ0NyZWF0aW5nIFdlYkRyaXZlckFnZW50IHJlc291cmNlIGJ1bmRsZSBkaXJlY3RvcnknKTtcbiAgICBhd2FpdCBmcy5ta2RpcihgJHtib290c3RyYXBQYXRofS9SZXNvdXJjZXMvV2ViRHJpdmVyQWdlbnQuYnVuZGxlYCk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gc2V0UmVhbERldmljZVNlY3VyaXR5IChrZXljaGFpblBhdGgsIGtleWNoYWluUGFzc3dvcmQpIHtcbiAgbG9nLmRlYnVnKCdTZXR0aW5nIHNlY3VyaXR5IGZvciBpT1MgZGV2aWNlJyk7XG4gIGF3YWl0IGV4ZWMoJ3NlY3VyaXR5JywgWyctdicsICdsaXN0LWtleWNoYWlucycsICctcycsIGtleWNoYWluUGF0aF0pO1xuICBhd2FpdCBleGVjKCdzZWN1cml0eScsIFsnLXYnLCAndW5sb2NrLWtleWNoYWluJywgJy1wJywga2V5Y2hhaW5QYXNzd29yZCwga2V5Y2hhaW5QYXRoXSk7XG4gIGF3YWl0IGV4ZWMoJ3NlY3VyaXR5JywgWydzZXQta2V5Y2hhaW4tc2V0dGluZ3MnLCAnLXQnLCAnMzYwMCcsICctbCcsIGtleWNoYWluUGF0aF0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmaXhYQ1VJQ29vcmRpbmF0ZUZpbGUgKGJvb3RzdHJhcFBhdGgsIGluaXRpYWwgPSB0cnVlKSB7XG4gIC8vIHRoZSB3YXkgdGhlIHVwZGF0ZWQgWENUZXN0IGhlYWRlcnMgYXJlIGluIHRoZSBXREEgcHJvamVjdCwgYnVpbGRpbmcgaW5cbiAgLy8gWGNvZGUgOC4wIGNhdXNlcyBhIGR1cGxpY2F0ZSBkZWNsYXJhdGlvbiBvZiBtZXRob2RcbiAgLy8gc28gZml4IHRoZSBvZmZlbmRpbmcgbGluZSBpbiB0aGUgbG9jYWwgaGVhZGVyc1xuICBjb25zdCBmaWxlID0gcGF0aC5yZXNvbHZlKGJvb3RzdHJhcFBhdGgsIFhDVUlDT09SRElOQVRFX0ZJTEUpO1xuXG4gIGxldCBvbGREZWYgPSAnLSAodm9pZClwcmVzc0ZvckR1cmF0aW9uOihkb3VibGUpYXJnMSB0aGVuRHJhZ1RvQ29vcmRpbmF0ZTooaWQpYXJnMjsnO1xuICBsZXQgbmV3RGVmID0gJy0gKHZvaWQpcHJlc3NGb3JEdXJhdGlvbjooTlNUaW1lSW50ZXJ2YWwpZHVyYXRpb24gdGhlbkRyYWdUb0Nvb3JkaW5hdGU6KFhDVUlDb29yZGluYXRlICopb3RoZXJDb29yZGluYXRlOyc7XG4gIGlmICghaW5pdGlhbCkge1xuICAgIFtvbGREZWYsIG5ld0RlZl0gPSBbbmV3RGVmLCBvbGREZWZdO1xuICB9XG4gIGF3YWl0IHJlcGxhY2VJbkZpbGUoZmlsZSwgb2xkRGVmLCBuZXdEZWYpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmaXhGQlNlc3Npb25GaWxlIChib290c3RyYXBQYXRoLCBpbml0aWFsID0gdHJ1ZSkge1xuICBjb25zdCBmaWxlID0gcGF0aC5yZXNvbHZlKGJvb3RzdHJhcFBhdGgsIEZCU0VTU0lPTl9GSUxFKTtcblxuICBsZXQgb2xkTGluZSA9ICdyZXR1cm4gW0ZCQXBwbGljYXRpb24gZmJfYWN0aXZlQXBwbGljYXRpb25dID86IHNlbGYudGVzdGVkQXBwbGljYXRpb247JztcbiAgbGV0IG5ld0xpbmUgPSAnRkJBcHBsaWNhdGlvbiAqYXBwbGljYXRpb24gPSBbRkJBcHBsaWNhdGlvbiBmYl9hY3RpdmVBcHBsaWNhdGlvbl0gPzogc2VsZi50ZXN0ZWRBcHBsaWNhdGlvbjtcXG4nICtcbiAgICAgICAgICAgICAgICAnICByZXR1cm4gYXBwbGljYXRpb247JztcbiAgaWYgKCFpbml0aWFsKSB7XG4gICAgW29sZExpbmUsIG5ld0xpbmVdID0gW25ld0xpbmUsIG9sZExpbmVdO1xuICB9XG4gIGF3YWl0IHJlcGxhY2VJbkZpbGUoZmlsZSwgb2xkTGluZSwgbmV3TGluZSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZpeEZvclhjb2RlNyAoYm9vdHN0cmFwUGF0aCwgaW5pdGlhbCA9IHRydWUsIGZpeFhjb2RlOSA9IHRydWUpIHtcbiAgaWYgKGZpeFhjb2RlOSkge1xuICAgIGF3YWl0IGZpeEZvclhjb2RlOShib290c3RyYXBQYXRoLCAhaW5pdGlhbCwgZmFsc2UpO1xuICB9XG4gIGF3YWl0IGZpeFhDVUlDb29yZGluYXRlRmlsZShib290c3RyYXBQYXRoLCBpbml0aWFsKTtcbiAgYXdhaXQgZml4RkJTZXNzaW9uRmlsZShib290c3RyYXBQYXRoLCBpbml0aWFsKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZml4RkJNYWNyb3NGaWxlIChib290c3RyYXBQYXRoLCBpbml0aWFsID0gdHJ1ZSkge1xuICBjb25zdCBmaWxlID0gcGF0aC5yZXNvbHZlKGJvb3RzdHJhcFBhdGgsIEZCTUFDUk9TX0ZJTEUpO1xuXG4gIGxldCBvbGREZWYgPSAnI2RlZmluZSBGQlN0cmluZ2lmeShjbGFzcywgcHJvcGVydHkpICh7aWYoTk8pe1tjbGFzcy5uZXcgcHJvcGVydHldO30gQCNwcm9wZXJ0eTt9KSc7XG4gIGxldCBuZXdEZWYgPSAnI2RlZmluZSBGQlN0cmluZ2lmeShjbGFzcywgcHJvcGVydHkpICh7QCNwcm9wZXJ0eTt9KSc7XG4gIGlmICghaW5pdGlhbCkge1xuICAgIFtvbGREZWYsIG5ld0RlZl0gPSBbbmV3RGVmLCBvbGREZWZdO1xuICB9XG4gIGF3YWl0IHJlcGxhY2VJbkZpbGUoZmlsZSwgb2xkRGVmLCBuZXdEZWYpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmaXhYQ1VJQXBwbGljYXRpb25GaWxlIChib290c3RyYXBQYXRoLCBpbml0aWFsID0gdHJ1ZSkge1xuICBjb25zdCBmaWxlID0gcGF0aC5yZXNvbHZlKGJvb3RzdHJhcFBhdGgsIFhDVUlBUFBMSUNBVElPTl9GSUxFKTtcblxuICBsZXQgb2xkRGVmID0gJ0Bwcm9wZXJ0eShub25hdG9taWMsIHJlYWRvbmx5KSBOU1VJbnRlZ2VyIHN0YXRlOyAvLyBAc3ludGhlc2l6ZSBzdGF0ZT1fc3RhdGU7JztcbiAgbGV0IG5ld0RlZiA9ICdAcHJvcGVydHkgWENVSUFwcGxpY2F0aW9uU3RhdGUgc3RhdGU7JztcbiAgaWYgKCFpbml0aWFsKSB7XG4gICAgW29sZERlZiwgbmV3RGVmXSA9IFtuZXdEZWYsIG9sZERlZl07XG4gIH1cbiAgYXdhaXQgcmVwbGFjZUluRmlsZShmaWxlLCBvbGREZWYsIG5ld0RlZik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZpeEZvclhjb2RlOSAoYm9vdHN0cmFwUGF0aCwgaW5pdGlhbCA9IHRydWUsIGZpeFhjb2RlNyA9IHRydWUpIHtcbiAgaWYgKGZpeFhjb2RlNykge1xuICAgIGF3YWl0IGZpeEZvclhjb2RlNyhib290c3RyYXBQYXRoLCAhaW5pdGlhbCwgZmFsc2UpO1xuICB9XG4gIGF3YWl0IGZpeEZCTWFjcm9zRmlsZShib290c3RyYXBQYXRoLCBpbml0aWFsKTtcbiAgYXdhaXQgZml4WENVSUFwcGxpY2F0aW9uRmlsZShib290c3RyYXBQYXRoLCBpbml0aWFsKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVYY29kZUNvbmZpZ0ZpbGUgKG9yZ0lkLCBzaWduaW5nSWQpIHtcbiAgbG9nLmRlYnVnKGBHZW5lcmF0aW5nIHhjb2RlIGNvbmZpZyBmaWxlIGZvciBvcmdJZCAnJHtvcmdJZH0nIGFuZCBzaWduaW5nSWQgYCArXG4gICAgICAgICAgICBgJyR7c2lnbmluZ0lkfSdgKTtcbiAgbGV0IGNvbnRlbnRzID0gYERFVkVMT1BNRU5UX1RFQU0gPSAke29yZ0lkfVxuQ09ERV9TSUdOX0lERU5USVRZID0gJHtzaWduaW5nSWR9XG5gO1xuICBsZXQgeGNjb25maWdQYXRoID0gYXdhaXQgdGVtcERpci5wYXRoKCdhcHBpdW0tdGVtcC54Y2NvbmZpZycpO1xuICBsb2cuZGVidWcoYFdyaXRpbmcgeGNvZGUgY29uZmlnIGZpbGUgdG8gJHt4Y2NvbmZpZ1BhdGh9YCk7XG4gIGF3YWl0IGZzLndyaXRlRmlsZSh4Y2NvbmZpZ1BhdGgsIGNvbnRlbnRzLCBcInV0ZjhcIik7XG4gIHJldHVybiB4Y2NvbmZpZ1BhdGg7XG59XG5cbi8qKlxuICogQ3JlYXRlcyB4Y3Rlc3RydW4gZmlsZSBwZXIgZGV2aWNlICYgcGxhdGZvcm0gdmVyc2lvbi5cbiAqIFdlIGV4cGVjdHMgdG8gaGF2ZSBXZWJEcml2ZXJBZ2VudFJ1bm5lcl9pcGhvbmVvcyR7cGxhdGZvcm1WZXJzaW9ufS1hcm02NC54Y3Rlc3RydW4gZm9yIHJlYWwgZGV2aWNlXG4gKiBhbmQgV2ViRHJpdmVyQWdlbnRSdW5uZXJfaXBob25lc2ltdWxhdG9yJHtwbGF0Zm9ybVZlcnNpb259LXg4Nl82NC54Y3Rlc3RydW4gZm9yIHNpbXVsYXRvciBsb2NhdGVkIEBib290c3RyYXBQYXRoXG4gKlxuICogQHBhcmFtIHtib29sZWFufSBpc1JlYWxEZXZpY2UgLSBFcXVhbHMgdG8gdHJ1ZSBpZiB0aGUgY3VycmVudCBkZXZpY2UgaXMgYSByZWFsIGRldmljZVxuICogQHBhcmFtIHtzdHJpbmd9IHVkaWQgLSBUaGUgZGV2aWNlIFVESUQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGxhdGZvcm1WZXJzaW9uIC0gVGhlIHBsYXRmb3JtIHZlcnNpb24gb2YgT1MuXG4gKiBAcGFyYW0ge3N0cmluZ30gYm9vdHN0cmFwUGF0aCAtIFRoZSBmb2xkZXIgcGF0aCBjb250YWluaW5nIHhjdGVzdHJ1biBmaWxlLlxuICogQHBhcmFtIHtzdHJpbmd9IHdkYVJlbW90ZVBvcnQgLSBUaGUgcmVtb3RlIHBvcnQgV0RBIGlzIGxpc3RlbmluZyBvbi5cbiAqIEByZXR1cm4ge3N0cmluZ30gcmV0dXJucyB4Y3Rlc3RydW5GaWxlUGF0aCBmb3IgZ2l2ZW4gZGV2aWNlXG4gKiBAdGhyb3dzIGlmIFdlYkRyaXZlckFnZW50UnVubmVyX2lwaG9uZW9zJHtwbGF0Zm9ybVZlcnNpb259LWFybTY0LnhjdGVzdHJ1biBmb3IgcmVhbCBkZXZpY2VcbiAqIG9yIFdlYkRyaXZlckFnZW50UnVubmVyX2lwaG9uZXNpbXVsYXRvciR7cGxhdGZvcm1WZXJzaW9ufS14ODZfNjQueGN0ZXN0cnVuIGZvciBzaW11bGF0b3IgaXMgbm90IGZvdW5kIEBib290c3RyYXBQYXRoLFxuICogdGhlbiBpdCB3aWxsIHRocm93IGZpbGUgbm90IGZvdW5kIGV4Y2VwdGlvblxuICovXG5hc3luYyBmdW5jdGlvbiBzZXRYY3Rlc3RydW5GaWxlIChpc1JlYWxEZXZpY2UsIHVkaWQsIHBsYXRmb3JtVmVyc2lvbiwgYm9vdHN0cmFwUGF0aCwgd2RhUmVtb3RlUG9ydCkge1xuICBsZXQgeGN0ZXN0cnVuRGV2aWNlRmlsZU5hbWUgPSBgJHt1ZGlkfV8ke3BsYXRmb3JtVmVyc2lvbn0ueGN0ZXN0cnVuYDtcbiAgbGV0IHhjdGVzdHJ1bkZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKGJvb3RzdHJhcFBhdGgsIHhjdGVzdHJ1bkRldmljZUZpbGVOYW1lKTtcblxuICBpZiAoIWF3YWl0IGZzLmV4aXN0cyh4Y3Rlc3RydW5GaWxlUGF0aCkpIHtcbiAgICBsZXQgeGN0ZXN0QmFzZUZpbGVOYW1lID0gaXNSZWFsRGV2aWNlID8gYFdlYkRyaXZlckFnZW50UnVubmVyX2lwaG9uZW9zJHtwbGF0Zm9ybVZlcnNpb259LWFybTY0LnhjdGVzdHJ1bmAgOlxuICAgICAgYFdlYkRyaXZlckFnZW50UnVubmVyX2lwaG9uZXNpbXVsYXRvciR7cGxhdGZvcm1WZXJzaW9ufS14ODZfNjQueGN0ZXN0cnVuYDtcbiAgICBsZXQgb3JpZ2luYWxYY3Rlc3RydW5GaWxlID0gcGF0aC5yZXNvbHZlKGJvb3RzdHJhcFBhdGgsIHhjdGVzdEJhc2VGaWxlTmFtZSk7XG4gICAgaWYgKCFhd2FpdCBmcy5leGlzdHMob3JpZ2luYWxYY3Rlc3RydW5GaWxlKSkge1xuICAgICAgbG9nLmVycm9yQW5kVGhyb3coYGlmIHlvdSBhcmUgdXNpbmcgdXNlWGN0ZXN0cnVuRmlsZSBjYXBhYmlsaXR5IHRoZW4geW91IG5lZWQgdG8gaGF2ZSAke29yaWdpbmFsWGN0ZXN0cnVuRmlsZX0gZmlsZWApO1xuICAgIH1cbiAgICAvLyBJZiB0aGlzIGlzIGZpcnN0IHRpbWUgcnVuIGZvciBnaXZlbiBkZXZpY2UsIHRoZW4gZmlyc3QgZ2VuZXJhdGUgeGN0ZXN0cnVuIGZpbGUgZm9yIGRldmljZS5cbiAgICAvLyBXZSBuZWVkIHRvIGhhdmUgYSB4Y3Rlc3RydW4gZmlsZSBwZXIgZGV2aWNlIGJlY2F1c2Ugd2UgY2FudCBub3QgaGF2ZSBzYW1lIHdkYSBwb3J0IGZvciBhbGwgZGV2aWNlcy5cbiAgICBhd2FpdCBmcy5jb3B5RmlsZShvcmlnaW5hbFhjdGVzdHJ1bkZpbGUsIHhjdGVzdHJ1bkZpbGVQYXRoKTtcbiAgfVxuXG4gIGxldCB4Y3Rlc3RSdW5Db250ZW50ID0gYXdhaXQgcGxpc3QucGFyc2VQbGlzdEZpbGUoeGN0ZXN0cnVuRmlsZVBhdGgpO1xuXG4gIGxldCB1cGRhdGVXREFQb3J0ID0ge1xuICAgIFdlYkRyaXZlckFnZW50UnVubmVyOiB7XG4gICAgICBFbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICBVU0VfUE9SVDogd2RhUmVtb3RlUG9ydFxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBsZXQgbmV3WGN0ZXN0UnVuQ29udGVudCA9IF8ubWVyZ2UoeGN0ZXN0UnVuQ29udGVudCwgdXBkYXRlV0RBUG9ydCk7XG4gIGF3YWl0IHBsaXN0LnVwZGF0ZVBsaXN0RmlsZSh4Y3Rlc3RydW5GaWxlUGF0aCwgbmV3WGN0ZXN0UnVuQ29udGVudCwgdHJ1ZSk7XG5cbiAgcmV0dXJuIHhjdGVzdHJ1bkZpbGVQYXRoO1xufVxuXG5hc3luYyBmdW5jdGlvbiBraWxsUHJvY2VzcyAobmFtZSwgcHJvYykge1xuICBpZiAocHJvYyAmJiBwcm9jLnByb2MpIHtcbiAgICBsb2cuaW5mbyhgU2h1dHRpbmcgZG93biAke25hbWV9IHByb2Nlc3MgKHBpZCAke3Byb2MucHJvYy5waWR9KWApO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBwcm9jLnN0b3AoJ1NJR1RFUk0nLCAxMDAwKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChlcnIubWVzc2FnZS5pbmRleE9mKGBQcm9jZXNzIGRpZG4ndCBlbmQgYWZ0ZXJgKSA9PT0gLTEpIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgICAgbG9nLmRlYnVnKGAke25hbWV9IHByb2Nlc3MgZGlkIG5vdCBlbmQgaW4gYSB0aW1lbHkgZmFzaGlvbjogJyR7ZXJyLm1lc3NhZ2V9Jy4gYCArXG4gICAgICAgICAgICAgICAgYFNlbmRpbmcgJ1NJR0tJTEwnLi4uYCk7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBwcm9jLnN0b3AoJ1NJR0tJTEwnKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAoZXJyLm1lc3NhZ2UuaW5kZXhPZignbm90IGN1cnJlbnRseSBydW5uaW5nJykgIT09IC0xKSB7XG4gICAgICAgICAgLy8gdGhlIHByb2Nlc3MgZW5kZWQgYnV0IGZvciBzb21lIHJlYXNvbiB3ZSB3ZXJlIG5vdCBpbmZvcm1lZFxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogR2VuZXJhdGUgYSByYW5kb20gaW50ZWdlci5cbiAqXG4gKiBAcmV0dXJuIHtudW1iZXJ9IEEgcmFuZG9tIGludGVnZXIgbnVtYmVyIGluIHJhbmdlIFtsb3csIGhpZ2h0KS4gYGxvd2BgIGlzIGluY2x1c2l2ZSBhbmQgYGhpZ2hgIGlzIGV4Y2x1c2l2ZS5cbiAqL1xuZnVuY3Rpb24gcmFuZG9tSW50IChsb3csIGhpZ2gpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChoaWdoIC0gbG93KSArIGxvdyk7XG59XG5cbmV4cG9ydCB7IHVwZGF0ZVByb2plY3RGaWxlLCByZXNldFByb2plY3RGaWxlLCBjaGVja0ZvckRlcGVuZGVuY2llcyxcbiAgICAgICAgIHNldFJlYWxEZXZpY2VTZWN1cml0eSwgZml4Rm9yWGNvZGU3LCBmaXhGb3JYY29kZTksXG4gICAgICAgICBnZW5lcmF0ZVhjb2RlQ29uZmlnRmlsZSwgc2V0WGN0ZXN0cnVuRmlsZSwga2lsbFByb2Nlc3MsIHJhbmRvbUludCB9O1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLi8uLiJ9
