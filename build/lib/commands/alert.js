'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _appiumBaseDriver = require('appium-base-driver');

var _appiumSupport = require('appium-support');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var commands = {},
    helpers = {},
    extensions = {};

commands.getAlertText = function callee$0$0() {
  var method, endpoint, _alert, text;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        method = 'GET';
        endpoint = '/alert/text';
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(this.proxyCommand(endpoint, method));

      case 5:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 8:
        context$1$0.prev = 8;
        context$1$0.t0 = context$1$0['catch'](0);

        if (this.isWebContext()) {
          context$1$0.next = 12;
          break;
        }

        throw context$1$0.t0;

      case 12:
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(this.getAlert());

      case 14:
        _alert = context$1$0.sent;
        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(_alert.getText());

      case 17:
        text = context$1$0.sent;
        return context$1$0.abrupt('return', text);

      case 19:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 8]]);
};

helpers.nativeSetAlertText = function callee$0$0(text) {
  var alert, possibleTextFields, msg;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        alert = undefined;
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeAlert', false));

      case 4:
        alert = context$1$0.sent;

        alert = _appiumSupport.util.unwrapElement(alert);
        context$1$0.next = 12;
        break;

      case 8:
        context$1$0.prev = 8;
        context$1$0.t0 = context$1$0['catch'](1);

        _logger2['default'].debug('Error finding alert element: ' + context$1$0.t0.message);
        throw new _appiumBaseDriver.errors.NoAlertOpenError();

      case 12:
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(this.findElOrEls('-ios predicate string', 'type == \'XCUIElementTypeTextField\' OR type == \'XCUIElementTypeSecureTextField\'', true, alert));

      case 14:
        possibleTextFields = context$1$0.sent;

        if (possibleTextFields.length !== 1) {
          msg = (possibleTextFields.length ? 'More than one' : 'No') + ' text ' + 'field or secure text field found. Unable to type into the alert';

          _logger2['default'].errorAndThrow(msg);
        }
        context$1$0.next = 18;
        return _regeneratorRuntime.awrap(this.setValue(text, _appiumSupport.util.unwrapElement(possibleTextFields[0])));

      case 18:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 8]]);
};

// TODO: WDA does not currently support this natively
commands.setAlertText = function callee$0$0(text) {
  var method, endpoint, _alert2;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!Array.isArray(text)) {
          text = text.split('');
        }
        context$1$0.prev = 1;
        method = 'POST';
        endpoint = '/alert/text';
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(this.proxyCommand(endpoint, method, text));

      case 6:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0['catch'](1);

        if (this.isWebContext()) {
          context$1$0.next = 15;
          break;
        }

        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(this.nativeSetAlertText(text));

      case 14:
        return context$1$0.abrupt('return');

      case 15:
        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(this.getAlert());

      case 17:
        _alert2 = context$1$0.sent;
        context$1$0.next = 20;
        return _regeneratorRuntime.awrap(_alert2.setText(text));

      case 20:
        return context$1$0.abrupt('return');

      case 21:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 9]]);
};

commands.postAcceptAlert = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var method, endpoint, params, _alert3;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        method = 'POST';
        endpoint = '/alert/accept';
        params = {};

        if (opts.buttonLabel) {
          params.name = opts.buttonLabel;
        }
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.proxyCommand(endpoint, method, params));

      case 7:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 10:
        context$1$0.prev = 10;
        context$1$0.t0 = context$1$0['catch'](0);

        if (this.isWebContext()) {
          context$1$0.next = 14;
          break;
        }

        throw context$1$0.t0;

      case 14:
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(this.getAlert());

      case 16:
        _alert3 = context$1$0.sent;

        if (!_alert3.close) {
          context$1$0.next = 22;
          break;
        }

        context$1$0.next = 20;
        return _regeneratorRuntime.awrap(_alert3.close());

      case 20:
        context$1$0.next = 24;
        break;

      case 22:
        context$1$0.next = 24;
        return _regeneratorRuntime.awrap(_alert3.ok());

      case 24:
        return context$1$0.abrupt('return');

      case 25:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 10]]);
};

commands.postDismissAlert = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var method, endpoint, params, _alert4;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        method = 'POST';
        endpoint = '/alert/dismiss';
        params = {};

        if (opts.buttonLabel) {
          params.name = opts.buttonLabel;
        }
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.proxyCommand(endpoint, method, params));

      case 7:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 10:
        context$1$0.prev = 10;
        context$1$0.t0 = context$1$0['catch'](0);

        if (this.isWebContext()) {
          context$1$0.next = 14;
          break;
        }

        throw context$1$0.t0;

      case 14:
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(this.getAlert());

      case 16:
        _alert4 = context$1$0.sent;

        if (!_alert4.close) {
          context$1$0.next = 22;
          break;
        }

        context$1$0.next = 20;
        return _regeneratorRuntime.awrap(_alert4.close());

      case 20:
        context$1$0.next = 24;
        break;

      case 22:
        context$1$0.next = 24;
        return _regeneratorRuntime.awrap(_alert4.cancel());

      case 24:
        return context$1$0.abrupt('return');

      case 25:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 10]]);
};

commands.getAlertButtons = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/alert/buttons', 'GET'));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.mobileHandleAlert = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.t0 = opts.action;
        context$1$0.next = context$1$0.t0 === 'accept' ? 3 : context$1$0.t0 === 'dismiss' ? 6 : context$1$0.t0 === 'getButtons' ? 9 : 12;
        break;

      case 3:
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(this.postAcceptAlert(opts));

      case 5:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.postDismissAlert(opts));

      case 8:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 9:
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(this.getAlertButtons());

      case 11:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 12:
        throw new Error('The \'action\' value should be either \'accept\', \'dismiss\' or \'getButtons\'. ' + ('\'' + opts.action + '\' is provided instead.'));

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getAlert = function callee$0$0() {
  var possibleAlert, possibleAlertButtons, assertButtonName, alert;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeScrollView', true));

      case 2:
        possibleAlert = context$1$0.sent;

        if (!(possibleAlert.length !== 1)) {
          context$1$0.next = 5;
          break;
        }

        throw new _appiumBaseDriver.errors.NoAlertOpenError();

      case 5:
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeButton', true, possibleAlert[0].ELEMENT));

      case 7:
        possibleAlertButtons = context$1$0.sent;

        if (!(possibleAlertButtons.length < 1 || possibleAlertButtons.length > 2)) {
          context$1$0.next = 10;
          break;
        }

        throw new _appiumBaseDriver.errors.NoAlertOpenError();

      case 10:
        assertButtonName = function assertButtonName(button, expectedName) {
          var name;
          return _regeneratorRuntime.async(function assertButtonName$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                button = button.ELEMENT ? button.ELEMENT : button;
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(this.proxyCommand('/element/' + button + '/attribute/name', 'GET'));

              case 3:
                name = context$2$0.sent;

                if (!(name.toLowerCase() !== expectedName)) {
                  context$2$0.next = 6;
                  break;
                }

                throw new _appiumBaseDriver.errors.NoAlertOpenError();

              case 6:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        };

        alert = possibleAlert[0];

        if (!(possibleAlertButtons.length === 1)) {
          context$1$0.next = 17;
          break;
        }

        context$1$0.next = 15;
        return _regeneratorRuntime.awrap((function callee$1$0() {
          var closeButton;
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            var _this2 = this;

            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                closeButton = possibleAlertButtons[0];
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(assertButtonName(closeButton, 'close'));

              case 3:

                alert.close = function callee$2$0() {
                  return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                      case 0:
                        context$3$0.next = 2;
                        return _regeneratorRuntime.awrap(this.proxyCommand('/element/' + closeButton.ELEMENT + '/click', 'POST'));

                      case 2:
                      case 'end':
                        return context$3$0.stop();
                    }
                  }, null, _this2);
                };

              case 4:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        })());

      case 15:
        context$1$0.next = 19;
        break;

      case 17:
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap((function callee$1$0() {
          var cancelButton, okButton;
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            var _this3 = this;

            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                cancelButton = possibleAlertButtons[0];
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(assertButtonName(cancelButton, 'cancel'));

              case 3:
                okButton = possibleAlertButtons[1];
                context$2$0.next = 6;
                return _regeneratorRuntime.awrap(assertButtonName(okButton, 'ok'));

              case 6:

                alert.cancel = function callee$2$0() {
                  return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                      case 0:
                        context$3$0.next = 2;
                        return _regeneratorRuntime.awrap(this.proxyCommand('/element/' + cancelButton.ELEMENT + '/click', 'POST'));

                      case 2:
                      case 'end':
                        return context$3$0.stop();
                    }
                  }, null, _this3);
                };
                alert.ok = function callee$2$0() {
                  return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                      case 0:
                        context$3$0.next = 2;
                        return _regeneratorRuntime.awrap(this.proxyCommand('/element/' + okButton.ELEMENT + '/click', 'POST'));

                      case 2:
                      case 'end':
                        return context$3$0.stop();
                    }
                  }, null, _this3);
                };

              case 8:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        })());

      case 19:

        alert.getText = function callee$1$0() {
          var textView;
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.next = 2;
                return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeTextView', false, _appiumSupport.util.unwrapElement(alert)));

              case 2:
                textView = context$2$0.sent;
                context$2$0.next = 5;
                return _regeneratorRuntime.awrap(this.proxyCommand('/element/' + textView.ELEMENT + '/attribute/value', 'GET'));

              case 5:
                return context$2$0.abrupt('return', context$2$0.sent);

              case 6:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        };
        alert.setText = function callee$1$0(value) {
          var textView;
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.prev = 0;
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeTextField', false, _appiumSupport.util.unwrapElement(alert)));

              case 3:
                textView = context$2$0.sent;
                context$2$0.next = 6;
                return _regeneratorRuntime.awrap(this.proxyCommand('/element/' + textView.ELEMENT + '/value ', 'POST', { value: value }));

              case 6:
                context$2$0.next = 13;
                break;

              case 8:
                context$2$0.prev = 8;
                context$2$0.t0 = context$2$0['catch'](0);

                if (!(0, _appiumBaseDriver.isErrorType)(context$2$0.t0, _appiumBaseDriver.errors.NoSuchElementError)) {
                  context$2$0.next = 12;
                  break;
                }

                throw new Error('Tried to set text of an alert that was not a prompt');

              case 12:
                throw context$2$0.t0;

              case 13:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this, [[0, 8]]);
        };

        return context$1$0.abrupt('return', alert);

      case 22:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

_Object$assign(extensions, commands, helpers);
exports.commands = commands;
exports.helpers = helpers;
exports['default'] = extensions;

// first make sure that there is an alert

// make sure the button is 'Close'

// ensure the buttons are 'Cancel' and 'OK'
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9hbGVydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Z0NBQW9DLG9CQUFvQjs7NkJBQ25DLGdCQUFnQjs7c0JBQ3JCLFdBQVc7Ozs7QUFHM0IsSUFBSSxRQUFRLEdBQUcsRUFBRTtJQUFFLE9BQU8sR0FBRyxFQUFFO0lBQUUsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFakQsUUFBUSxDQUFDLFlBQVksR0FBRztNQUVoQixNQUFNLEVBQ04sUUFBUSxFQU9SLE1BQUssRUFDTCxJQUFJOzs7Ozs7QUFUSixjQUFNLEdBQUcsS0FBSztBQUNkLGdCQUFROzt5Q0FDQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUM7Ozs7Ozs7OztZQUUzQyxJQUFJLENBQUMsWUFBWSxFQUFFOzs7Ozs7Ozs7eUNBSU4sSUFBSSxDQUFDLFFBQVEsRUFBRTs7O0FBQTdCLGNBQUs7O3lDQUNRLE1BQUssQ0FBQyxPQUFPLEVBQUU7OztBQUE1QixZQUFJOzRDQUNELElBQUk7Ozs7Ozs7Q0FFZCxDQUFDOztBQUVGLE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxvQkFBZ0IsSUFBSTtNQUMzQyxLQUFLLEVBVUwsa0JBQWtCLEVBRWhCLEdBQUc7Ozs7QUFaTCxhQUFLOzs7eUNBR08sSUFBSSxDQUFDLDJCQUEyQixDQUFDLFlBQVksRUFBRSxzQkFBc0IsRUFBRSxLQUFLLENBQUM7OztBQUEzRixhQUFLOztBQUNMLGFBQUssR0FBRyxvQkFBSyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7Ozs7O0FBRWxDLDRCQUFJLEtBQUssbUNBQWlDLGVBQUksT0FBTyxDQUFHLENBQUM7Y0FDbkQsSUFBSSx5QkFBTyxnQkFBZ0IsRUFBRTs7Ozt5Q0FHTixJQUFJLENBQUMsV0FBVyxDQUFDLHVCQUF1Qix3RkFBb0YsSUFBSSxFQUFFLEtBQUssQ0FBQzs7O0FBQW5LLDBCQUFrQjs7QUFDdEIsWUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUss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QyxDQUFDOzs7QUFBNUgsd0JBQVE7O2lEQUNDLElBQUksQ0FBQyxZQUFZLGVBQWEsUUFBUSxDQUFDLE9BQU8sdUJBQW9CLEtBQUssQ0FBQzs7Ozs7Ozs7OztTQUN0RixDQUFDO0FBQ0YsYUFBSyxDQUFDLE9BQU8sR0FBRyxvQkFBTyxLQUFLO2NBRXBCLFFBQVE7Ozs7OztpREFBUyxJQUFJLENBQUMsMkJBQTJCLENBQUMsWUFBWSxFQUFFLDBCQUEwQixFQUFFLEtBQUssRUFBRSxvQkFBSyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7OztBQUE3SCx3QkFBUTs7aURBQ04sSUFBSSxDQUFDLFlBQVksZUFBYSxRQUFRLENBQUMsT0FBTyxjQUFXLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBTCxLQUFLLEVBQUMsQ0FBQzs7Ozs7Ozs7OztxQkFFM0UsbURBQWlCLHlCQUFPLGtCQUFrQixDQUFDOzs7OztzQkFDdkMsSUFBSSxLQUFLLENBQUMscURBQXFELENBQUM7Ozs7Ozs7Ozs7U0FJM0UsQ0FBQzs7NENBRUssS0FBSzs7Ozs7OztDQUNiLENBQUM7O0FBR0YsZUFBYyxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BDLFFBQVEsR0FBUixRQUFRO1FBQUUsT0FBTyxHQUFQLE9BQU87cUJBQ1gsVUFBVSIsImZpbGUiOiJsaWIvY29tbWFuZHMvYWxlcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBlcnJvcnMsIGlzRXJyb3JUeXBlIH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcbmltcG9ydCB7IHV0aWwgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5pbXBvcnQgbG9nIGZyb20gJy4uL2xvZ2dlcic7XG5cblxubGV0IGNvbW1hbmRzID0ge30sIGhlbHBlcnMgPSB7fSwgZXh0ZW5zaW9ucyA9IHt9O1xuXG5jb21tYW5kcy5nZXRBbGVydFRleHQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgbGV0IG1ldGhvZCA9ICdHRVQnO1xuICAgIGxldCBlbmRwb2ludCA9IGAvYWxlcnQvdGV4dGA7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGVuZHBvaW50LCBtZXRob2QpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoIXRoaXMuaXNXZWJDb250ZXh0KCkpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG5cbiAgICBsZXQgYWxlcnQgPSBhd2FpdCB0aGlzLmdldEFsZXJ0KCk7XG4gICAgbGV0IHRleHQgPSBhd2FpdCBhbGVydC5nZXRUZXh0KCk7XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cbn07XG5cbmhlbHBlcnMubmF0aXZlU2V0QWxlcnRUZXh0ID0gYXN5bmMgZnVuY3Rpb24gKHRleHQpIHtcbiAgbGV0IGFsZXJ0O1xuICB0cnkge1xuICAgIC8vIGZpcnN0IG1ha2Ugc3VyZSB0aGF0IHRoZXJlIGlzIGFuIGFsZXJ0XG4gICAgYWxlcnQgPSBhd2FpdCB0aGlzLmZpbmROYXRpdmVFbGVtZW50T3JFbGVtZW50cygnY2xhc3MgbmFtZScsICdYQ1VJRWxlbWVudFR5cGVBbGVydCcsIGZhbHNlKTtcbiAgICBhbGVydCA9IHV0aWwudW53cmFwRWxlbWVudChhbGVydCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGxvZy5kZWJ1ZyhgRXJyb3IgZmluZGluZyBhbGVydCBlbGVtZW50OiAke2Vyci5tZXNzYWdlfWApO1xuICAgIHRocm93IG5ldyBlcnJvcnMuTm9BbGVydE9wZW5FcnJvcigpO1xuICB9XG5cbiAgbGV0IHBvc3NpYmxlVGV4dEZpZWxkcyA9IGF3YWl0IHRoaXMuZmluZEVsT3JFbHMoJy1pb3MgcHJlZGljYXRlIHN0cmluZycsIGB0eXBlID09ICdYQ1VJRWxlbWVudFR5cGVUZXh0RmllbGQnIE9SIHR5cGUgPT0gJ1hDVUlFbGVtZW50VHlwZVNlY3VyZVRleHRGaWVsZCdgLCB0cnVlLCBhbGVydCk7XG4gIGlmIChwb3NzaWJsZVRleHRGaWVsZHMubGVuZ3RoICE9PSAxKSB7XG4gICAgbGV0IG1zZyA9IGAke3Bvc3NpYmxlVGV4dEZpZWxkcy5sZW5ndGggPyAnTW9yZSB0aGFuIG9uZScgOiAnTm8nfSB0ZXh0IGAgK1xuICAgICAgICAgICAgICBgZmllbGQgb3Igc2VjdXJlIHRleHQgZmllbGQgZm91bmQuIFVuYWJsZSB0byB0eXBlIGludG8gdGhlIGFsZXJ0YDtcbiAgICBsb2cuZXJyb3JBbmRUaHJvdyhtc2cpO1xuICB9XG4gIGF3YWl0IHRoaXMuc2V0VmFsdWUodGV4dCwgdXRpbC51bndyYXBFbGVtZW50KHBvc3NpYmxlVGV4dEZpZWxkc1swXSkpO1xufTtcblxuLy8gVE9ETzogV0RBIGRvZXMgbm90IGN1cnJlbnRseSBzdXBwb3J0IHRoaXMgbmF0aXZlbHlcbmNvbW1hbmRzLnNldEFsZXJ0VGV4dCA9IGFzeW5jIGZ1bmN0aW9uICh0ZXh0KSB7XG4gIGlmICghQXJyYXkuaXNBcnJheSh0ZXh0KSkge1xuICAgIHRleHQgPSB0ZXh0LnNwbGl0KCcnKTtcbiAgfVxuICB0cnkge1xuICAgIGxldCBtZXRob2QgPSAnUE9TVCc7XG4gICAgbGV0IGVuZHBvaW50ID0gYC9hbGVydC90ZXh0YDtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoZW5kcG9pbnQsIG1ldGhvZCwgdGV4dCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmICghdGhpcy5pc1dlYkNvbnRleHQoKSkge1xuICAgICAgYXdhaXQgdGhpcy5uYXRpdmVTZXRBbGVydFRleHQodGV4dCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGFsZXJ0ID0gYXdhaXQgdGhpcy5nZXRBbGVydCgpO1xuICAgIGF3YWl0IGFsZXJ0LnNldFRleHQodGV4dCk7XG4gICAgcmV0dXJuO1xuICB9XG59O1xuXG5jb21tYW5kcy5wb3N0QWNjZXB0QWxlcnQgPSBhc3luYyBmdW5jdGlvbiAob3B0cyA9IHt9KSB7XG4gIHRyeSB7XG4gICAgbGV0IG1ldGhvZCA9ICdQT1NUJztcbiAgICBsZXQgZW5kcG9pbnQgPSAnL2FsZXJ0L2FjY2VwdCc7XG4gICAgbGV0IHBhcmFtcyA9IHt9O1xuICAgIGlmIChvcHRzLmJ1dHRvbkxhYmVsKSB7XG4gICAgICBwYXJhbXMubmFtZSA9IG9wdHMuYnV0dG9uTGFiZWw7XG4gICAgfVxuICAgIHJldHVybiBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZChlbmRwb2ludCwgbWV0aG9kLCBwYXJhbXMpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoIXRoaXMuaXNXZWJDb250ZXh0KCkpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG5cbiAgICBsZXQgYWxlcnQgPSBhd2FpdCB0aGlzLmdldEFsZXJ0KCk7XG4gICAgaWYgKGFsZXJ0LmNsb3NlKSB7XG4gICAgICBhd2FpdCBhbGVydC5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBhbGVydC5vaygpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbn07XG5cbmNvbW1hbmRzLnBvc3REaXNtaXNzQWxlcnQgPSBhc3luYyBmdW5jdGlvbiAob3B0cyA9IHt9KSB7XG4gIHRyeSB7XG4gICAgbGV0IG1ldGhvZCA9ICdQT1NUJztcbiAgICBsZXQgZW5kcG9pbnQgPSAnL2FsZXJ0L2Rpc21pc3MnO1xuICAgIGxldCBwYXJhbXMgPSB7fTtcbiAgICBpZiAob3B0cy5idXR0b25MYWJlbCkge1xuICAgICAgcGFyYW1zLm5hbWUgPSBvcHRzLmJ1dHRvbkxhYmVsO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoZW5kcG9pbnQsIG1ldGhvZCwgcGFyYW1zKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKCF0aGlzLmlzV2ViQ29udGV4dCgpKSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuXG4gICAgbGV0IGFsZXJ0ID0gYXdhaXQgdGhpcy5nZXRBbGVydCgpO1xuICAgIGlmIChhbGVydC5jbG9zZSkge1xuICAgICAgYXdhaXQgYWxlcnQuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgYWxlcnQuY2FuY2VsKCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxufTtcblxuY29tbWFuZHMuZ2V0QWxlcnRCdXR0b25zID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoJy93ZGEvYWxlcnQvYnV0dG9ucycsICdHRVQnKTtcbn07XG5cbmNvbW1hbmRzLm1vYmlsZUhhbmRsZUFsZXJ0ID0gYXN5bmMgZnVuY3Rpb24gKG9wdHMgPSB7fSkge1xuICBzd2l0Y2ggKG9wdHMuYWN0aW9uKSB7XG4gICAgY2FzZSAnYWNjZXB0JzpcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBvc3RBY2NlcHRBbGVydChvcHRzKTtcbiAgICBjYXNlICdkaXNtaXNzJzpcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBvc3REaXNtaXNzQWxlcnQob3B0cyk7XG4gICAgY2FzZSAnZ2V0QnV0dG9ucyc6XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRBbGVydEJ1dHRvbnMoKTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgJ2FjdGlvbicgdmFsdWUgc2hvdWxkIGJlIGVpdGhlciAnYWNjZXB0JywgJ2Rpc21pc3MnIG9yICdnZXRCdXR0b25zJy4gYCArXG4gICAgICAgICAgICAgICAgICAgICAgYCcke29wdHMuYWN0aW9ufScgaXMgcHJvdmlkZWQgaW5zdGVhZC5gKTtcbiAgfVxufTtcblxuaGVscGVycy5nZXRBbGVydCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgbGV0IHBvc3NpYmxlQWxlcnQgPSBhd2FpdCB0aGlzLmZpbmROYXRpdmVFbGVtZW50T3JFbGVtZW50cygnY2xhc3MgbmFtZScsICdYQ1VJRWxlbWVudFR5cGVTY3JvbGxWaWV3JywgdHJ1ZSk7XG4gIGlmIChwb3NzaWJsZUFsZXJ0Lmxlbmd0aCAhPT0gMSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuTm9BbGVydE9wZW5FcnJvcigpO1xuICB9XG5cbiAgbGV0IHBvc3NpYmxlQWxlcnRCdXR0b25zID0gYXdhaXQgdGhpcy5maW5kTmF0aXZlRWxlbWVudE9yRWxlbWVudHMoJ2NsYXNzIG5hbWUnLCAnWENVSUVsZW1lbnRUeXBlQnV0dG9uJywgdHJ1ZSwgcG9zc2libGVBbGVydFswXS5FTEVNRU5UKTtcbiAgaWYgKHBvc3NpYmxlQWxlcnRCdXR0b25zLmxlbmd0aCAgPCAxIHx8IHBvc3NpYmxlQWxlcnRCdXR0b25zLmxlbmd0aCA+IDIpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLk5vQWxlcnRPcGVuRXJyb3IoKTtcbiAgfVxuXG4gIGxldCBhc3NlcnRCdXR0b25OYW1lID0gYXN5bmMgKGJ1dHRvbiwgZXhwZWN0ZWROYW1lKSA9PiB7XG4gICAgYnV0dG9uID0gYnV0dG9uLkVMRU1FTlQgPyBidXR0b24uRUxFTUVOVCA6IGJ1dHRvbjtcbiAgICBsZXQgbmFtZSA9IGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGAvZWxlbWVudC8ke2J1dHRvbn0vYXR0cmlidXRlL25hbWVgLCAnR0VUJyk7XG4gICAgaWYgKG5hbWUudG9Mb3dlckNhc2UoKSAhPT0gZXhwZWN0ZWROYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLk5vQWxlcnRPcGVuRXJyb3IoKTtcbiAgICB9XG4gIH07XG5cbiAgbGV0IGFsZXJ0ID0gcG9zc2libGVBbGVydFswXTtcbiAgaWYgKHBvc3NpYmxlQWxlcnRCdXR0b25zLmxlbmd0aCA9PT0gMSkge1xuICAgIC8vIG1ha2Ugc3VyZSB0aGUgYnV0dG9uIGlzICdDbG9zZSdcbiAgICBsZXQgY2xvc2VCdXR0b24gPSBwb3NzaWJsZUFsZXJ0QnV0dG9uc1swXTtcbiAgICBhd2FpdCBhc3NlcnRCdXR0b25OYW1lKGNsb3NlQnV0dG9uLCAnY2xvc2UnKTtcblxuICAgIGFsZXJ0LmNsb3NlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoYC9lbGVtZW50LyR7Y2xvc2VCdXR0b24uRUxFTUVOVH0vY2xpY2tgLCAnUE9TVCcpO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgLy8gZW5zdXJlIHRoZSBidXR0b25zIGFyZSAnQ2FuY2VsJyBhbmQgJ09LJ1xuICAgIGxldCBjYW5jZWxCdXR0b24gPSBwb3NzaWJsZUFsZXJ0QnV0dG9uc1swXTtcbiAgICBhd2FpdCBhc3NlcnRCdXR0b25OYW1lKGNhbmNlbEJ1dHRvbiwgJ2NhbmNlbCcpO1xuICAgIGxldCBva0J1dHRvbiA9IHBvc3NpYmxlQWxlcnRCdXR0b25zWzFdO1xuICAgIGF3YWl0IGFzc2VydEJ1dHRvbk5hbWUob2tCdXR0b24sICdvaycpO1xuXG4gICAgYWxlcnQuY2FuY2VsID0gYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoYC9lbGVtZW50LyR7Y2FuY2VsQnV0dG9uLkVMRU1FTlR9L2NsaWNrYCwgJ1BPU1QnKTtcbiAgICB9O1xuICAgIGFsZXJ0Lm9rID0gYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoYC9lbGVtZW50LyR7b2tCdXR0b24uRUxFTUVOVH0vY2xpY2tgLCAnUE9TVCcpO1xuICAgIH07XG4gIH1cblxuICBhbGVydC5nZXRUZXh0ID0gYXN5bmMgKCkgPT4ge1xuICAgIGxldCB0ZXh0VmlldyA9IGF3YWl0IHRoaXMuZmluZE5hdGl2ZUVsZW1lbnRPckVsZW1lbnRzKCdjbGFzcyBuYW1lJywgJ1hDVUlFbGVtZW50VHlwZVRleHRWaWV3JywgZmFsc2UsIHV0aWwudW53cmFwRWxlbWVudChhbGVydCkpO1xuICAgIHJldHVybiBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZChgL2VsZW1lbnQvJHt0ZXh0Vmlldy5FTEVNRU5UfS9hdHRyaWJ1dGUvdmFsdWVgLCAnR0VUJyk7XG4gIH07XG4gIGFsZXJ0LnNldFRleHQgPSBhc3luYyAodmFsdWUpID0+IHtcbiAgICB0cnkge1xuICAgICAgbGV0IHRleHRWaWV3ID0gYXdhaXQgdGhpcy5maW5kTmF0aXZlRWxlbWVudE9yRWxlbWVudHMoJ2NsYXNzIG5hbWUnLCAnWENVSUVsZW1lbnRUeXBlVGV4dEZpZWxkJywgZmFsc2UsIHV0aWwudW53cmFwRWxlbWVudChhbGVydCkpO1xuICAgICAgYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoYC9lbGVtZW50LyR7dGV4dFZpZXcuRUxFTUVOVH0vdmFsdWUgYCwgJ1BPU1QnLCB7dmFsdWV9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChpc0Vycm9yVHlwZShlcnIsIGVycm9ycy5Ob1N1Y2hFbGVtZW50RXJyb3IpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVHJpZWQgdG8gc2V0IHRleHQgb2YgYW4gYWxlcnQgdGhhdCB3YXMgbm90IGEgcHJvbXB0Jyk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBhbGVydDtcbn07XG5cblxuT2JqZWN0LmFzc2lnbihleHRlbnNpb25zLCBjb21tYW5kcywgaGVscGVycyk7XG5leHBvcnQgeyBjb21tYW5kcywgaGVscGVycyB9O1xuZXhwb3J0IGRlZmF1bHQgZXh0ZW5zaW9ucztcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4vLi4ifQ==
