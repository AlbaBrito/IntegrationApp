'use strict';

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _asyncbox = require('asyncbox');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nodeSimctl = require('node-simctl');

var _teen_process = require('teen_process');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _appiumSupport = require('appium-support');

var commands = {};

function getScreenshotWithIdevicelib(udid, isLandscape) {
  var pathToScreenshotTiff, pathToResultPng, sipsArgs;
  return _regeneratorRuntime.async(function getScreenshotWithIdevicelib$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumSupport.tempDir.path({ prefix: 'screenshot-' + udid, suffix: '.tiff' }));

      case 2:
        pathToScreenshotTiff = context$1$0.sent;
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.rimraf(pathToScreenshotTiff));

      case 5:
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(_appiumSupport.tempDir.path({ prefix: 'screenshot-' + udid, suffix: '.png' }));

      case 7:
        pathToResultPng = context$1$0.sent;
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.rimraf(pathToResultPng));

      case 10:
        context$1$0.prev = 10;
        context$1$0.prev = 11;
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('idevicescreenshot', ['-u', udid, pathToScreenshotTiff]));

      case 14:
        context$1$0.next = 19;
        break;

      case 16:
        context$1$0.prev = 16;
        context$1$0.t0 = context$1$0['catch'](11);
        throw new Error('Cannot take a screenshot from the device \'' + udid + '\' using ' + ('idevicescreenshot. Original error: ' + context$1$0.t0.message));

      case 19:
        sipsArgs = ['-s', 'format', 'png', pathToScreenshotTiff, '--out', pathToResultPng];

        if (isLandscape) {
          sipsArgs = ['-r', '-90'].concat(_toConsumableArray(sipsArgs));
        }
        context$1$0.prev = 21;
        context$1$0.next = 24;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('sips', sipsArgs));

      case 24:
        context$1$0.next = 29;
        break;

      case 26:
        context$1$0.prev = 26;
        context$1$0.t1 = context$1$0['catch'](21);
        throw new Error('Cannot convert a screenshot from TIFF to PNG using sips tool. ' + ('Original error: ' + context$1$0.t1.message));

      case 29:
        context$1$0.next = 31;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(pathToResultPng));

      case 31:
        if (context$1$0.sent) {
          context$1$0.next = 33;
          break;
        }

        throw new Error('Cannot convert a screenshot from TIFF to PNG. The conversion ' + ('result does not exist at \'' + pathToResultPng + '\''));

      case 33:
        context$1$0.next = 35;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.readFile(pathToResultPng));

      case 35:
        return context$1$0.abrupt('return', context$1$0.sent.toString('base64'));

      case 36:
        context$1$0.prev = 36;
        context$1$0.next = 39;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.rimraf(pathToScreenshotTiff));

      case 39:
        context$1$0.next = 41;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.rimraf(pathToResultPng));

      case 41:
        return context$1$0.finish(36);

      case 42:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[10,, 36, 42], [11, 16], [21, 26]]);
}

function isIdevicescreenshotAvailable() {
  return _regeneratorRuntime.async(function isIdevicescreenshotAvailable$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.which('idevicescreenshot'));

      case 2:
        return context$1$0.abrupt('return', !!context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

commands.getScreenshot = function callee$0$0() {
  var getScreenshotFromWDA, orientation;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        getScreenshotFromWDA = function getScreenshotFromWDA() {
          var data;
          return _regeneratorRuntime.async(function getScreenshotFromWDA$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.next = 2;
                return _regeneratorRuntime.awrap(this.proxyCommand('/screenshot', 'GET'));

              case 2:
                data = context$2$0.sent;

                if (_lodash2['default'].isString(data)) {
                  context$2$0.next = 5;
                  break;
                }

                throw new Error('Unable to take screenshot. WDA returned \'' + JSON.stringify(data) + '\'');

              case 5:
                return context$2$0.abrupt('return', data);

              case 6:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        };

        context$1$0.prev = 1;

        _logger2['default'].debug('Taking screenshot with WDA');
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(getScreenshotFromWDA());

      case 5:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 8:
        context$1$0.prev = 8;
        context$1$0.t0 = context$1$0['catch'](1);

        _logger2['default'].warn('Error getting screenshot: ' + context$1$0.t0.message);

        if (!this.isSimulator()) {
          context$1$0.next = 17;
          break;
        }

        if (this.xcodeVersion.versionFloat < 8.1) {
          _logger2['default'].errorAndThrow('No command line screenshot ability with Xcode ' + (this.xcodeVersion.versionFloat + '. Please upgrade to ') + 'at least Xcode 8.1');
        }
        _logger2['default'].info('Falling back to \'simctl io screenshot\' API');
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap((0, _nodeSimctl.getScreenshot)(this.opts.udid));

      case 16:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 17:
        context$1$0.prev = 17;
        context$1$0.next = 20;
        return _regeneratorRuntime.awrap(isIdevicescreenshotAvailable());

      case 20:
        if (!context$1$0.sent) {
          context$1$0.next = 28;
          break;
        }

        _logger2['default'].debug('Taking screenshot with \'idevicescreenshot\'');
        context$1$0.next = 24;
        return _regeneratorRuntime.awrap(this.proxyCommand('/orientation', 'GET'));

      case 24:
        orientation = context$1$0.sent;
        context$1$0.next = 27;
        return _regeneratorRuntime.awrap(getScreenshotWithIdevicelib(this.opts.udid, orientation === 'LANDSCAPE'));

      case 27:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 28:
        _logger2['default'].info('No \'idevicescreenshot\' program found. To use, install ' + 'using \'brew install --HEAD libimobiledevice\'');
        context$1$0.next = 34;
        break;

      case 31:
        context$1$0.prev = 31;
        context$1$0.t1 = context$1$0['catch'](17);

        _logger2['default'].warn('Error getting screenshot through \'idevicescreenshot\': ' + context$1$0.t1.message);

      case 34:

        // Retry for real devices only. Fail fast on Simulator if simctl does not work as expected
        _logger2['default'].debug('Retrying screenshot through WDA');
        context$1$0.next = 37;
        return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(2, 1000, getScreenshotFromWDA));

      case 37:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 38:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 8], [17, 31]]);
};

commands.getElementScreenshot = function callee$0$0(el) {
  var atomsElement, data;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        el = _appiumSupport.util.unwrapElement(el);

        if (!this.isWebContext()) {
          context$1$0.next = 6;
          break;
        }

        atomsElement = this.useAtomsElement(el);
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(this.executeAtom('getElementScreenshot', [atomsElement]));

      case 5:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 6:

        if (this.xcodeVersion.major < 9) {
          _logger2['default'].errorAndThrow('Element screenshots are only available since Xcode 9. ' + ('The current Xcode version is ' + this.xcodeVersion.major + '.' + this.xcodeVersion.minor));
        }
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(this.proxyCommand('/element/' + el + '/screenshot', 'GET'));

      case 9:
        data = context$1$0.sent;

        if (!_lodash2['default'].isString(data)) {
          _logger2['default'].errorAndThrow('Unable to take a screenshot of the element ' + el + '. WDA returned \'' + JSON.stringify(data) + '\'');
        }
        return context$1$0.abrupt('return', data);

      case 12:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

exports['default'] = commands;
module.exports = exports['default'];

// The sips tool is only present on Mac OS

// all simulator scenarios are finished
// real device, so try idevicescreenshot if possible
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9zY3JlZW5zaG90cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7d0JBQThCLFVBQVU7O3NCQUMxQixRQUFROzs7OzBCQUNRLGFBQWE7OzRCQUN0QixjQUFjOztzQkFDbkIsV0FBVzs7Ozs2QkFDTyxnQkFBZ0I7O0FBRWxELElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsU0FBZSwyQkFBMkIsQ0FBRSxJQUFJLEVBQUUsV0FBVztNQUNyRCxvQkFBb0IsRUFFcEIsZUFBZSxFQVNmLFFBQVE7Ozs7O3lDQVhxQix1QkFBUSxJQUFJLENBQUMsRUFBQyxNQUFNLGtCQUFnQixJQUFJLEFBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUM7OztBQUExRiw0QkFBb0I7O3lDQUNwQixrQkFBRyxNQUFNLENBQUMsb0JBQW9CLENBQUM7Ozs7eUNBQ1AsdUJBQVEsSUFBSSxDQUFDLEVBQUMsTUFBTSxrQkFBZ0IsSUFBSSxBQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDOzs7QUFBcEYsdUJBQWU7O3lDQUNmLGtCQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7Ozs7Ozt5Q0FHdEIsd0JBQUssbUJBQW1CLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUM7Ozs7Ozs7OztjQUU3RCxJQUFJLEtBQUssQ0FBQyxnREFBNkMsSUFBSSwwREFDekIsZUFBRSxPQUFPLENBQUUsQ0FBQzs7O0FBRWxELGdCQUFRLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxvQkFBb0IsRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDOztBQUN0RixZQUFJLFdBQVcsRUFBRTtBQUNmLGtCQUFRLElBQUksSUFBSSxFQUFFLEtBQUssNEJBQUssUUFBUSxFQUFDLENBQUM7U0FDdkM7Ozt5Q0FHTyx3QkFBSyxNQUFNLEVBQUUsUUFBUSxDQUFDOzs7Ozs7Ozs7Y0FFdEIsSUFBSSxLQUFLLENBQUMseUZBQ0ssZUFBRSxPQUFPLENBQUUsQ0FBQzs7Ozt5Q0FFeEIsa0JBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQzs7Ozs7Ozs7Y0FDN0IsSUFBSSxLQUFLLENBQUMsbUdBQ2UsZUFBZSxRQUFHLENBQUM7Ozs7eUNBRXRDLGtCQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUM7Ozs2REFBRSxRQUFRLENBQUMsUUFBUTs7Ozs7eUNBRXZELGtCQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQzs7Ozt5Q0FDL0Isa0JBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQzs7Ozs7Ozs7OztDQUVuQzs7QUFFRCxTQUFlLDRCQUE0Qjs7Ozs7eUNBQ3pCLGtCQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQzs7Ozs7Ozs7OztDQUM5Qzs7QUFFRCxRQUFRLENBQUMsYUFBYSxHQUFHO01BQ2pCLG9CQUFvQixFQThCaEIsV0FBVzs7Ozs7O0FBOUJmLDRCQUFvQixHQUFHLFNBQXZCLG9CQUFvQjtjQUNsQixJQUFJOzs7OztpREFBUyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUM7OztBQUFwRCxvQkFBSTs7b0JBQ0wsb0JBQUUsUUFBUSxDQUFDLElBQUksQ0FBQzs7Ozs7c0JBQ2IsSUFBSSxLQUFLLGdEQUE2QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFJOzs7b0RBRS9FLElBQUk7Ozs7Ozs7U0FDWjs7OztBQUdDLDRCQUFJLEtBQUssOEJBQThCLENBQUM7O3lDQUMzQixvQkFBb0IsRUFBRTs7Ozs7Ozs7O0FBRW5DLDRCQUFJLElBQUksZ0NBQThCLGVBQUksT0FBTyxDQUFHLENBQUM7O2FBRWpELElBQUksQ0FBQyxXQUFXLEVBQUU7Ozs7O0FBQ3BCLFlBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEdBQUcsR0FBRyxFQUFFO0FBQ3hDLDhCQUFJLGFBQWEsQ0FBQyxvREFDTixJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksMEJBQXNCLHVCQUNuQyxDQUFDLENBQUM7U0FDaEM7QUFDRCw0QkFBSSxJQUFJLGdEQUE4QyxDQUFDOzt5Q0FDMUMsK0JBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Ozs7Ozs7O3lDQU9sQyw0QkFBNEIsRUFBRTs7Ozs7Ozs7QUFDdEMsNEJBQUksS0FBSyxnREFBOEMsQ0FBQzs7eUNBQzlCLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQzs7O0FBQTVELG1CQUFXOzt5Q0FDSiwyQkFBMkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEtBQUssV0FBVyxDQUFDOzs7Ozs7QUFFdkYsNEJBQUksSUFBSSxDQUFDLDZHQUM4QyxDQUFDLENBQUM7Ozs7Ozs7O0FBRXpELDRCQUFJLElBQUksOERBQTBELGVBQUksT0FBTyxDQUFHLENBQUM7Ozs7O0FBSW5GLDRCQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDOzt5Q0FDaEMsNkJBQWMsQ0FBQyxFQUFFLElBQUksRUFBRSxvQkFBb0IsQ0FBQzs7Ozs7Ozs7OztDQUMxRCxDQUFDOztBQUVGLFFBQVEsQ0FBQyxvQkFBb0IsR0FBRyxvQkFBZ0IsRUFBRTtNQUd4QyxZQUFZLEVBUWQsSUFBSTs7OztBQVZWLFVBQUUsR0FBRyxvQkFBSyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7O2FBQ3hCLElBQUksQ0FBQyxZQUFZLEVBQUU7Ozs7O0FBQ2Ysb0JBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQzs7eUNBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7Ozs7OztBQUd2RSxZQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtBQUMvQiw4QkFBSSxhQUFhLENBQUMsOEZBQ2dDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxTQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFFLENBQUMsQ0FBQztTQUN6Rzs7eUNBQ2tCLElBQUksQ0FBQyxZQUFZLGVBQWEsRUFBRSxrQkFBZSxLQUFLLENBQUM7OztBQUFsRSxZQUFJOztBQUNWLFlBQUksQ0FBQyxvQkFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDckIsOEJBQUksYUFBYSxpREFBK0MsRUFBRSx5QkFBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBSSxDQUFDO1NBQy9HOzRDQUNNLElBQUk7Ozs7Ozs7Q0FDWixDQUFDOztxQkFFYSxRQUFRIiwiZmlsZSI6ImxpYi9jb21tYW5kcy9zY3JlZW5zaG90cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJldHJ5SW50ZXJ2YWwgfSBmcm9tICdhc3luY2JveCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgZ2V0U2NyZWVuc2hvdCB9IGZyb20gJ25vZGUtc2ltY3RsJztcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICd0ZWVuX3Byb2Nlc3MnO1xuaW1wb3J0IGxvZyBmcm9tICcuLi9sb2dnZXInO1xuaW1wb3J0IHsgZnMsIHRlbXBEaXIsIHV0aWwgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5cbmxldCBjb21tYW5kcyA9IHt9O1xuXG5hc3luYyBmdW5jdGlvbiBnZXRTY3JlZW5zaG90V2l0aElkZXZpY2VsaWIgKHVkaWQsIGlzTGFuZHNjYXBlKSB7XG4gIGNvbnN0IHBhdGhUb1NjcmVlbnNob3RUaWZmID0gYXdhaXQgdGVtcERpci5wYXRoKHtwcmVmaXg6IGBzY3JlZW5zaG90LSR7dWRpZH1gLCBzdWZmaXg6ICcudGlmZid9KTtcbiAgYXdhaXQgZnMucmltcmFmKHBhdGhUb1NjcmVlbnNob3RUaWZmKTtcbiAgY29uc3QgcGF0aFRvUmVzdWx0UG5nID0gYXdhaXQgdGVtcERpci5wYXRoKHtwcmVmaXg6IGBzY3JlZW5zaG90LSR7dWRpZH1gLCBzdWZmaXg6ICcucG5nJ30pO1xuICBhd2FpdCBmcy5yaW1yYWYocGF0aFRvUmVzdWx0UG5nKTtcbiAgdHJ5IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZXhlYygnaWRldmljZXNjcmVlbnNob3QnLCBbJy11JywgdWRpZCwgcGF0aFRvU2NyZWVuc2hvdFRpZmZdKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCB0YWtlIGEgc2NyZWVuc2hvdCBmcm9tIHRoZSBkZXZpY2UgJyR7dWRpZH0nIHVzaW5nIGAgK1xuICAgICAgICBgaWRldmljZXNjcmVlbnNob3QuIE9yaWdpbmFsIGVycm9yOiAke2UubWVzc2FnZX1gKTtcbiAgICB9XG4gICAgbGV0IHNpcHNBcmdzID0gWyctcycsICdmb3JtYXQnLCAncG5nJywgcGF0aFRvU2NyZWVuc2hvdFRpZmYsICctLW91dCcsIHBhdGhUb1Jlc3VsdFBuZ107XG4gICAgaWYgKGlzTGFuZHNjYXBlKSB7XG4gICAgICBzaXBzQXJncyA9IFsnLXInLCAnLTkwJywgLi4uc2lwc0FyZ3NdO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gVGhlIHNpcHMgdG9vbCBpcyBvbmx5IHByZXNlbnQgb24gTWFjIE9TXG4gICAgICBhd2FpdCBleGVjKCdzaXBzJywgc2lwc0FyZ3MpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNvbnZlcnQgYSBzY3JlZW5zaG90IGZyb20gVElGRiB0byBQTkcgdXNpbmcgc2lwcyB0b29sLiBgICtcbiAgICAgICAgYE9yaWdpbmFsIGVycm9yOiAke2UubWVzc2FnZX1gKTtcbiAgICB9XG4gICAgaWYgKCFhd2FpdCBmcy5leGlzdHMocGF0aFRvUmVzdWx0UG5nKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgY29udmVydCBhIHNjcmVlbnNob3QgZnJvbSBUSUZGIHRvIFBORy4gVGhlIGNvbnZlcnNpb24gYCArXG4gICAgICAgIGByZXN1bHQgZG9lcyBub3QgZXhpc3QgYXQgJyR7cGF0aFRvUmVzdWx0UG5nfSdgKTtcbiAgICB9XG4gICAgcmV0dXJuIChhd2FpdCBmcy5yZWFkRmlsZShwYXRoVG9SZXN1bHRQbmcpKS50b1N0cmluZygnYmFzZTY0Jyk7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgZnMucmltcmFmKHBhdGhUb1NjcmVlbnNob3RUaWZmKTtcbiAgICBhd2FpdCBmcy5yaW1yYWYocGF0aFRvUmVzdWx0UG5nKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBpc0lkZXZpY2VzY3JlZW5zaG90QXZhaWxhYmxlICgpIHtcbiAgcmV0dXJuICEhKGF3YWl0IGZzLndoaWNoKCdpZGV2aWNlc2NyZWVuc2hvdCcpKTtcbn1cblxuY29tbWFuZHMuZ2V0U2NyZWVuc2hvdCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgZ2V0U2NyZWVuc2hvdEZyb21XREEgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMucHJveHlDb21tYW5kKCcvc2NyZWVuc2hvdCcsICdHRVQnKTtcbiAgICBpZiAoIV8uaXNTdHJpbmcoZGF0YSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHRha2Ugc2NyZWVuc2hvdC4gV0RBIHJldHVybmVkICcke0pTT04uc3RyaW5naWZ5KGRhdGEpfSdgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgdHJ5IHtcbiAgICBsb2cuZGVidWcoYFRha2luZyBzY3JlZW5zaG90IHdpdGggV0RBYCk7XG4gICAgcmV0dXJuIGF3YWl0IGdldFNjcmVlbnNob3RGcm9tV0RBKCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGxvZy53YXJuKGBFcnJvciBnZXR0aW5nIHNjcmVlbnNob3Q6ICR7ZXJyLm1lc3NhZ2V9YCk7XG5cbiAgICBpZiAodGhpcy5pc1NpbXVsYXRvcigpKSB7XG4gICAgICBpZiAodGhpcy54Y29kZVZlcnNpb24udmVyc2lvbkZsb2F0IDwgOC4xKSB7XG4gICAgICAgIGxvZy5lcnJvckFuZFRocm93KGBObyBjb21tYW5kIGxpbmUgc2NyZWVuc2hvdCBhYmlsaXR5IHdpdGggWGNvZGUgYCArXG4gICAgICAgICAgICAgICAgIGAke3RoaXMueGNvZGVWZXJzaW9uLnZlcnNpb25GbG9hdH0uIFBsZWFzZSB1cGdyYWRlIHRvIGAgK1xuICAgICAgICAgICAgICAgICBgYXQgbGVhc3QgWGNvZGUgOC4xYCk7XG4gICAgICB9XG4gICAgICBsb2cuaW5mbyhgRmFsbGluZyBiYWNrIHRvICdzaW1jdGwgaW8gc2NyZWVuc2hvdCcgQVBJYCk7XG4gICAgICByZXR1cm4gYXdhaXQgZ2V0U2NyZWVuc2hvdCh0aGlzLm9wdHMudWRpZCk7XG4gICAgfVxuICB9XG5cbiAgLy8gYWxsIHNpbXVsYXRvciBzY2VuYXJpb3MgYXJlIGZpbmlzaGVkXG4gIC8vIHJlYWwgZGV2aWNlLCBzbyB0cnkgaWRldmljZXNjcmVlbnNob3QgaWYgcG9zc2libGVcbiAgdHJ5IHtcbiAgICBpZiAoYXdhaXQgaXNJZGV2aWNlc2NyZWVuc2hvdEF2YWlsYWJsZSgpKSB7XG4gICAgICBsb2cuZGVidWcoYFRha2luZyBzY3JlZW5zaG90IHdpdGggJ2lkZXZpY2VzY3JlZW5zaG90J2ApO1xuICAgICAgY29uc3Qgb3JpZW50YXRpb24gPSBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZCgnL29yaWVudGF0aW9uJywgJ0dFVCcpO1xuICAgICAgcmV0dXJuIGF3YWl0IGdldFNjcmVlbnNob3RXaXRoSWRldmljZWxpYih0aGlzLm9wdHMudWRpZCwgb3JpZW50YXRpb24gPT09ICdMQU5EU0NBUEUnKTtcbiAgICB9XG4gICAgbG9nLmluZm8oYE5vICdpZGV2aWNlc2NyZWVuc2hvdCcgcHJvZ3JhbSBmb3VuZC4gVG8gdXNlLCBpbnN0YWxsIGAgK1xuICAgICAgICAgICAgIGB1c2luZyAnYnJldyBpbnN0YWxsIC0tSEVBRCBsaWJpbW9iaWxlZGV2aWNlJ2ApO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBsb2cud2FybihgRXJyb3IgZ2V0dGluZyBzY3JlZW5zaG90IHRocm91Z2ggJ2lkZXZpY2VzY3JlZW5zaG90JzogJHtlcnIubWVzc2FnZX1gKTtcbiAgfVxuXG4gIC8vIFJldHJ5IGZvciByZWFsIGRldmljZXMgb25seS4gRmFpbCBmYXN0IG9uIFNpbXVsYXRvciBpZiBzaW1jdGwgZG9lcyBub3Qgd29yayBhcyBleHBlY3RlZFxuICBsb2cuZGVidWcoJ1JldHJ5aW5nIHNjcmVlbnNob3QgdGhyb3VnaCBXREEnKTtcbiAgcmV0dXJuIGF3YWl0IHJldHJ5SW50ZXJ2YWwoMiwgMTAwMCwgZ2V0U2NyZWVuc2hvdEZyb21XREEpO1xufTtcblxuY29tbWFuZHMuZ2V0RWxlbWVudFNjcmVlbnNob3QgPSBhc3luYyBmdW5jdGlvbiAoZWwpIHtcbiAgZWwgPSB1dGlsLnVud3JhcEVsZW1lbnQoZWwpO1xuICBpZiAodGhpcy5pc1dlYkNvbnRleHQoKSkge1xuICAgIGNvbnN0IGF0b21zRWxlbWVudCA9IHRoaXMudXNlQXRvbXNFbGVtZW50KGVsKTtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlQXRvbSgnZ2V0RWxlbWVudFNjcmVlbnNob3QnLCBbYXRvbXNFbGVtZW50XSk7XG4gIH1cblxuICBpZiAodGhpcy54Y29kZVZlcnNpb24ubWFqb3IgPCA5KSB7XG4gICAgbG9nLmVycm9yQW5kVGhyb3coYEVsZW1lbnQgc2NyZWVuc2hvdHMgYXJlIG9ubHkgYXZhaWxhYmxlIHNpbmNlIFhjb2RlIDkuIGAgK1xuICAgICAgICAgICAgICAgICAgICAgIGBUaGUgY3VycmVudCBYY29kZSB2ZXJzaW9uIGlzICR7dGhpcy54Y29kZVZlcnNpb24ubWFqb3J9LiR7dGhpcy54Y29kZVZlcnNpb24ubWlub3J9YCk7XG4gIH1cbiAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGAvZWxlbWVudC8ke2VsfS9zY3JlZW5zaG90YCwgJ0dFVCcpO1xuICBpZiAoIV8uaXNTdHJpbmcoZGF0YSkpIHtcbiAgICBsb2cuZXJyb3JBbmRUaHJvdyhgVW5hYmxlIHRvIHRha2UgYSBzY3JlZW5zaG90IG9mIHRoZSBlbGVtZW50ICR7ZWx9LiBXREEgcmV0dXJuZWQgJyR7SlNPTi5zdHJpbmdpZnkoZGF0YSl9J2ApO1xuICB9XG4gIHJldHVybiBkYXRhO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29tbWFuZHM7XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uLy4uIn0=
