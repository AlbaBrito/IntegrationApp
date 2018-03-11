'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appiumIosDriver = require('appium-ios-driver');

var _appiumBaseDriver = require('appium-base-driver');

var extensions = {};

_Object$assign(extensions, _appiumIosDriver.iosCommands.execute);

var iosExecute = extensions.execute;
extensions.execute = function callee$0$0(script, args) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!(!script.match(/^mobile\:/) && !this.isWebContext())) {
          context$1$0.next = 2;
          break;
        }

        throw new _appiumBaseDriver.errors.NotImplementedError();

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(iosExecute.call(this, script, args));

      case 4:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

var iosExecuteAsync = extensions.executeAsync;
extensions.executeAsync = function callee$0$0(script, args, sessionId) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (this.isWebContext()) {
          context$1$0.next = 2;
          break;
        }

        throw new _appiumBaseDriver.errors.NotImplementedError();

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(iosExecuteAsync.call(this, script, args, sessionId));

      case 4:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

// Overrides the 'executeMobile' function defined in appium-ios-driver
extensions.executeMobile = function callee$0$0(mobileCommand) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var mobileCommandsMapping;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        mobileCommandsMapping = {
          //region gestures support
          scroll: function scroll(x) {
            return _regeneratorRuntime.async(function scroll$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileScroll(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          swipe: function swipe(x) {
            return _regeneratorRuntime.async(function swipe$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileScroll(x, true));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          pinch: function pinch(x) {
            return _regeneratorRuntime.async(function pinch$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobilePinch(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          doubleTap: function doubleTap(x) {
            return _regeneratorRuntime.async(function doubleTap$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileDoubleTap(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          twoFingerTap: function twoFingerTap(x) {
            return _regeneratorRuntime.async(function twoFingerTap$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileTwoFingerTap(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          touchAndHold: function touchAndHold(x) {
            return _regeneratorRuntime.async(function touchAndHold$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileTouchAndHold(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          tap: function tap(x) {
            return _regeneratorRuntime.async(function tap$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileTap(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          dragFromToForDuration: function dragFromToForDuration(x) {
            return _regeneratorRuntime.async(function dragFromToForDuration$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileDragFromToForDuration(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          selectPickerWheelValue: function selectPickerWheelValue(x) {
            return _regeneratorRuntime.async(function selectPickerWheelValue$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileSelectPickerWheelValue(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          //endregion gestures support
          alert: function alert(x) {
            return _regeneratorRuntime.async(function alert$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileHandleAlert(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          setPasteboard: function setPasteboard(x) {
            return _regeneratorRuntime.async(function setPasteboard$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileSetPasteboard(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          getPasteboard: function getPasteboard(x) {
            return _regeneratorRuntime.async(function getPasteboard$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileGetPasteboard(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          source: function source(x) {
            return _regeneratorRuntime.async(function source$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileGetSource(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          //region multiple apps management
          installApp: function installApp(x) {
            return _regeneratorRuntime.async(function installApp$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileInstallApp(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          isAppInstalled: function isAppInstalled(x) {
            return _regeneratorRuntime.async(function isAppInstalled$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileIsAppInstalled(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          removeApp: function removeApp(x) {
            return _regeneratorRuntime.async(function removeApp$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileRemoveApp(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          launchApp: function launchApp(x) {
            return _regeneratorRuntime.async(function launchApp$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileLaunchApp(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          terminateApp: function terminateApp(x) {
            return _regeneratorRuntime.async(function terminateApp$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileTerminateApp(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          queryAppState: function queryAppState(x) {
            return _regeneratorRuntime.async(function queryAppState$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileQueryAppState(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          },
          activateApp: function activateApp(x) {
            return _regeneratorRuntime.async(function activateApp$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return _regeneratorRuntime.awrap(this.mobileActivateApp(x));

                case 2:
                  return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          }
        };

        if (_lodash2['default'].has(mobileCommandsMapping, mobileCommand)) {
          context$1$0.next = 3;
          break;
        }

        throw new _appiumBaseDriver.errors.UnknownCommandError('Unknown mobile command "' + mobileCommand + '". Only ' + _lodash2['default'].keys(mobileCommandsMapping) + ' commands are supported.');

      case 3:
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(mobileCommandsMapping[mobileCommand](opts));

      case 5:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

exports['default'] = extensions;
module.exports = exports['default'];
//endregion multiple apps management
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9leGVjdXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7OytCQUNNLG1CQUFtQjs7Z0NBQ3hCLG9CQUFvQjs7QUFHM0MsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVwQixlQUFjLFVBQVUsRUFBRSw2QkFBWSxPQUFPLENBQUMsQ0FBQzs7QUFFL0MsSUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQztBQUN0QyxVQUFVLENBQUMsT0FBTyxHQUFHLG9CQUFnQixNQUFNLEVBQUUsSUFBSTs7OztjQUMzQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7Ozs7O2NBQzlDLElBQUkseUJBQU8sbUJBQW1CLEVBQUU7Ozs7eUNBRzNCLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUM7Ozs7Ozs7Ozs7Q0FDakQsQ0FBQzs7QUFFRixJQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDO0FBQ2hELFVBQVUsQ0FBQyxZQUFZLEdBQUcsb0JBQWdCLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUzs7OztZQUMxRCxJQUFJLENBQUMsWUFBWSxFQUFFOzs7OztjQUNoQixJQUFJLHlCQUFPLG1CQUFtQixFQUFFOzs7O3lDQUczQixlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQzs7Ozs7Ozs7OztDQUNqRSxDQUFDOzs7QUFHRixVQUFVLENBQUMsYUFBYSxHQUFHLG9CQUFnQixhQUFhO01BQUUsSUFBSSx5REFBRyxFQUFFO01BQzNELHFCQUFxQjs7Ozs7O0FBQXJCLDZCQUFxQixHQUFHOztBQUU1QixnQkFBTSxFQUFFLGdCQUFPLENBQUM7Ozs7O21EQUFXLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFD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OztxQkFFYSxVQUFVIiwiZmlsZSI6ImxpYi9jb21tYW5kcy9leGVjdXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGlvc0NvbW1hbmRzIH0gZnJvbSAnYXBwaXVtLWlvcy1kcml2ZXInO1xuaW1wb3J0IHsgZXJyb3JzIH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcblxuXG5sZXQgZXh0ZW5zaW9ucyA9IHt9O1xuXG5PYmplY3QuYXNzaWduKGV4dGVuc2lvbnMsIGlvc0NvbW1hbmRzLmV4ZWN1dGUpO1xuXG5jb25zdCBpb3NFeGVjdXRlID0gZXh0ZW5zaW9ucy5leGVjdXRlO1xuZXh0ZW5zaW9ucy5leGVjdXRlID0gYXN5bmMgZnVuY3Rpb24gKHNjcmlwdCwgYXJncykge1xuICBpZiAoIXNjcmlwdC5tYXRjaCgvXm1vYmlsZVxcOi8pICYmICF0aGlzLmlzV2ViQ29udGV4dCgpKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5Ob3RJbXBsZW1lbnRlZEVycm9yKCk7XG4gIH1cblxuICByZXR1cm4gYXdhaXQgaW9zRXhlY3V0ZS5jYWxsKHRoaXMsIHNjcmlwdCwgYXJncyk7XG59O1xuXG5jb25zdCBpb3NFeGVjdXRlQXN5bmMgPSBleHRlbnNpb25zLmV4ZWN1dGVBc3luYztcbmV4dGVuc2lvbnMuZXhlY3V0ZUFzeW5jID0gYXN5bmMgZnVuY3Rpb24gKHNjcmlwdCwgYXJncywgc2Vzc2lvbklkKSB7XG4gIGlmICghdGhpcy5pc1dlYkNvbnRleHQoKSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuTm90SW1wbGVtZW50ZWRFcnJvcigpO1xuICB9XG5cbiAgcmV0dXJuIGF3YWl0IGlvc0V4ZWN1dGVBc3luYy5jYWxsKHRoaXMsIHNjcmlwdCwgYXJncywgc2Vzc2lvbklkKTtcbn07XG5cbi8vIE92ZXJyaWRlcyB0aGUgJ2V4ZWN1dGVNb2JpbGUnIGZ1bmN0aW9uIGRlZmluZWQgaW4gYXBwaXVtLWlvcy1kcml2ZXJcbmV4dGVuc2lvbnMuZXhlY3V0ZU1vYmlsZSA9IGFzeW5jIGZ1bmN0aW9uIChtb2JpbGVDb21tYW5kLCBvcHRzID0ge30pIHtcbiAgY29uc3QgbW9iaWxlQ29tbWFuZHNNYXBwaW5nID0ge1xuICAgIC8vcmVnaW9uIGdlc3R1cmVzIHN1cHBvcnRcbiAgICBzY3JvbGw6IGFzeW5jICh4KSA9PiBhd2FpdCB0aGlzLm1vYmlsZVNjcm9sbCh4KSxcbiAgICBzd2lwZTogYXN5bmMgKHgpID0+IGF3YWl0IHRoaXMubW9iaWxlU2Nyb2xsKHgsIHRydWUpLFxuICAgIHBpbmNoOiBhc3luYyAoeCkgPT4gYXdhaXQgdGhpcy5tb2JpbGVQaW5jaCh4KSxcbiAgICBkb3VibGVUYXA6IGFzeW5jICh4KSA9PiBhd2FpdCB0aGlzLm1vYmlsZURvdWJsZVRhcCh4KSxcbiAgICB0d29GaW5nZXJUYXA6IGFzeW5jICh4KSA9PiBhd2FpdCB0aGlzLm1vYmlsZVR3b0ZpbmdlclRhcCh4KSxcbiAgICB0b3VjaEFuZEhvbGQ6IGFzeW5jICh4KSA9PiBhd2FpdCB0aGlzLm1vYmlsZVRvdWNoQW5kSG9sZCh4KSxcbiAgICB0YXA6IGFzeW5jICh4KSA9PiBhd2FpdCB0aGlzLm1vYmlsZVRhcCh4KSxcbiAgICBkcmFnRnJvbVRvRm9yRHVyYXRpb246IGFzeW5jICh4KSA9PiBhd2FpdCB0aGlzLm1vYmlsZURyYWdGcm9tVG9Gb3JEdXJhdGlvbih4KSxcbiAgICBzZWxlY3RQaWNrZXJXaGVlbFZhbHVlOiBhc3luYyAoeCkgPT4gYXdhaXQgdGhpcy5tb2JpbGVTZWxlY3RQaWNrZXJXaGVlbFZhbHVlKHgpLFxuICAgIC8vZW5kcmVnaW9uIGdlc3R1cmVzIHN1cHBvcnRcbiAgICBhbGVydDogYXN5bmMgKHgpID0+IGF3YWl0IHRoaXMubW9iaWxlSGFuZGxlQWxlcnQoeCksXG4gICAgc2V0UGFzdGVib2FyZDogYXN5bmMgKHgpID0+IGF3YWl0IHRoaXMubW9iaWxlU2V0UGFzdGVib2FyZCh4KSxcbiAgICBnZXRQYXN0ZWJvYXJkOiBhc3luYyAoeCkgPT4gYXdhaXQgdGhpcy5tb2JpbGVHZXRQYXN0ZWJvYXJkKHgpLFxuICAgIHNvdXJjZTogYXN5bmMgKHgpID0+IGF3YWl0IHRoaXMubW9iaWxlR2V0U291cmNlKHgpLFxuICAgIC8vcmVnaW9uIG11bHRpcGxlIGFwcHMgbWFuYWdlbWVudFxuICAgIGluc3RhbGxBcHA6IGFzeW5jICh4KSA9PiBhd2FpdCB0aGlzLm1vYmlsZUluc3RhbGxBcHAoeCksXG4gICAgaXNBcHBJbnN0YWxsZWQ6IGFzeW5jICh4KSA9PiBhd2FpdCB0aGlzLm1vYmlsZUlzQXBwSW5zdGFsbGVkKHgpLFxuICAgIHJlbW92ZUFwcDogYXN5bmMgKHgpID0+IGF3YWl0IHRoaXMubW9iaWxlUmVtb3ZlQXBwKHgpLFxuICAgIGxhdW5jaEFwcDogYXN5bmMgKHgpID0+IGF3YWl0IHRoaXMubW9iaWxlTGF1bmNoQXBwKHgpLFxuICAgIHRlcm1pbmF0ZUFwcDogYXN5bmMgKHgpID0+IGF3YWl0IHRoaXMubW9iaWxlVGVybWluYXRlQXBwKHgpLFxuICAgIHF1ZXJ5QXBwU3RhdGU6IGFzeW5jICh4KSA9PiBhd2FpdCB0aGlzLm1vYmlsZVF1ZXJ5QXBwU3RhdGUoeCksXG4gICAgYWN0aXZhdGVBcHA6IGFzeW5jICh4KSA9PiBhd2FpdCB0aGlzLm1vYmlsZUFjdGl2YXRlQXBwKHgpLFxuICAgIC8vZW5kcmVnaW9uIG11bHRpcGxlIGFwcHMgbWFuYWdlbWVudFxuICB9O1xuXG4gIGlmICghXy5oYXMobW9iaWxlQ29tbWFuZHNNYXBwaW5nLCBtb2JpbGVDb21tYW5kKSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuVW5rbm93bkNvbW1hbmRFcnJvcihgVW5rbm93biBtb2JpbGUgY29tbWFuZCBcIiR7bW9iaWxlQ29tbWFuZH1cIi4gT25seSAke18ua2V5cyhtb2JpbGVDb21tYW5kc01hcHBpbmcpfSBjb21tYW5kcyBhcmUgc3VwcG9ydGVkLmApO1xuICB9XG4gIHJldHVybiBhd2FpdCBtb2JpbGVDb21tYW5kc01hcHBpbmdbbW9iaWxlQ29tbWFuZF0ob3B0cyk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBleHRlbnNpb25zO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLi8uLiJ9
