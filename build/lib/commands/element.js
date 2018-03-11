'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appiumBaseDriver = require('appium-base-driver');

var _appiumIosDriver = require('appium-ios-driver');

var _appiumSupport = require('appium-support');

var _asyncbox = require('asyncbox');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var commands = {},
    extensions = {};
_Object$assign(extensions, _appiumIosDriver.iosCommands.element);

commands.getAttribute = function callee$0$0(attribute, el) {
  var value, atomsElement;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        el = _appiumSupport.util.unwrapElement(el);

        if (this.isWebContext()) {
          context$1$0.next = 7;
          break;
        }

        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.proxyCommand('/element/' + el + '/attribute/' + attribute, 'GET'));

      case 4:
        value = context$1$0.sent;

        // Transform the result for the case when WDA returns an integer representation for a boolean value
        if ([0, 1].indexOf(value) !== -1) {
          value = !!value;
        }
        // The returned value must be of type string according to https://www.w3.org/TR/webdriver/#get-element-attribute
        return context$1$0.abrupt('return', _lodash2['default'].isNull(value) || _lodash2['default'].isString(value) ? value : JSON.stringify(value));

      case 7:
        atomsElement = this.getAtomsElement(el);

        if (!_lodash2['default'].isNull(atomsElement)) {
          context$1$0.next = 10;
          break;
        }

        throw new _appiumBaseDriver.errors.UnknownError('Error converting element ID for using in WD atoms: \'' + el);

      case 10:
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(this.executeAtom('get_attribute_value', [atomsElement, attribute]));

      case 12:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.getText = function callee$0$0(el) {
  var atomsElement;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        el = _appiumSupport.util.unwrapElement(el);

        if (this.isWebContext()) {
          context$1$0.next = 5;
          break;
        }

        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.proxyCommand('/element/' + el + '/text', 'GET'));

      case 4:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 5:
        atomsElement = this.useAtomsElement(el);
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.executeAtom('get_text', [atomsElement]));

      case 8:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.getRect = function callee$0$0(el) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        el = _appiumSupport.util.unwrapElement(el);

        if (!this.isWebContext()) {
          context$1$0.next = 3;
          break;
        }

        throw new _appiumBaseDriver.errors.NotYetImplementedError('Support for getRect for webcontext is not yet implemented. Please contact an Appium dev');

      case 3:
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(this.getNativeRect(el));

      case 5:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

extensions.getNativeRect = function callee$0$0(el) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.proxyCommand('/element/' + el + '/rect', 'GET'));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.getLocation = function callee$0$0(el) {
  var atomsElement, loc, script, _ref, _ref2, xOffset, yOffset, rect;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        el = el.ELEMENT ? el.ELEMENT : el;

        if (!this.isWebContext()) {
          context$1$0.next = 21;
          break;
        }

        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.useAtomsElement(el));

      case 4:
        atomsElement = context$1$0.sent;
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.executeAtom('get_top_left_coordinates', [atomsElement]));

      case 7:
        loc = context$1$0.sent;

        if (!this.opts.absoluteWebLocations) {
          context$1$0.next = 18;
          break;
        }

        script = 'return [document.body.scrollLeft, document.body.scrollTop];';
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(this.execute(script));

      case 12:
        _ref = context$1$0.sent;
        _ref2 = _slicedToArray(_ref, 2);
        xOffset = _ref2[0];
        yOffset = _ref2[1];

        loc.x += xOffset;
        loc.y += yOffset;

      case 18:
        return context$1$0.abrupt('return', loc);

      case 21:
        context$1$0.next = 23;
        return _regeneratorRuntime.awrap(this.getRect(el));

      case 23:
        rect = context$1$0.sent;
        return context$1$0.abrupt('return', { x: rect.x, y: rect.y });

      case 25:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.getLocationInView = function callee$0$0(el) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.getLocation(el));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.getSize = function callee$0$0(el) {
  var atomsElement, rect;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        el = el.ELEMENT ? el.ELEMENT : el;

        if (!this.isWebContext()) {
          context$1$0.next = 12;
          break;
        }

        atomsElement = this.getAtomsElement(el);

        if (!(atomsElement === null)) {
          context$1$0.next = 7;
          break;
        }

        throw new _appiumBaseDriver.errors.UnknownError('Error converting element ID for using in WD atoms: \'' + el + '\'');

      case 7:
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(this.executeAtom('get_size', [atomsElement]));

      case 9:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 10:
        context$1$0.next = 16;
        break;

      case 12:
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(this.getRect(el));

      case 14:
        rect = context$1$0.sent;
        return context$1$0.abrupt('return', { width: rect.width, height: rect.height });

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

function hasSpecialKeys(keys) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var char = _step.value;

      if (isSpecialKey(char)) {
        return true;
      }
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

  return false;
}

function isSpecialKey(k) {
  if (k === '' || k === '') {
    // BACKSPACE or DELETE
    return true;
  } else if (k === '' || k === '') {
    // RETURN or ENTER
    return true;
  }
  return false;
}

function translateKey(k) {
  if (k === '' || k === '') {
    // RETURN or ENTER
    return '\n';
  } else if (k === '' || k === '') {
    // BACKSPACE or DELETE
    return '\b';
  }
  return k;
}

extensions.bringUpKeyboard = function callee$0$0(element) {
  var implicitWaitMs;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        implicitWaitMs = this.implicitWaitMs;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.setImplicitWait(0));

      case 3:
        context$1$0.prev = 3;
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(10, 10, function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.prev = 0;
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeKeyboard', false));

              case 3:
                _logger2['default'].debug('Keyboard found. Continuing with text input.');
                context$2$0.next = 13;
                break;

              case 6:
                context$2$0.prev = 6;
                context$2$0.t0 = context$2$0['catch'](0);

                // no keyboard found
                _logger2['default'].debug('No keyboard found. Clicking element to open it.');
                context$2$0.next = 11;
                return _regeneratorRuntime.awrap(this.nativeClick(element));

              case 11:
                context$2$0.next = 13;
                return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeKeyboard', false));

              case 13:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this, [[0, 6]]);
        }));

      case 6:
        context$1$0.prev = 6;
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(this.setImplicitWait(implicitWaitMs));

      case 9:
        return context$1$0.finish(6);

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[3,, 6, 10]]);
};

commands.setValueImmediate = function callee$0$0(value, el) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        // WDA does not provide no way to set the value directly
        _logger2['default'].info('There is currently no way to bypass typing using XCUITest. Setting value through keyboard');
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.setValue(value, el));

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.setValue = function callee$0$0(value, el) {
  var atomsElement, setFormattedValue, buffer, isFirstChar, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, k, char;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this2 = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        el = _appiumSupport.util.unwrapElement(el);

        if (!this.isWebContext()) {
          context$1$0.next = 9;
          break;
        }

        atomsElement = this.useAtomsElement(el);
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(this.executeAtom('click', [atomsElement]));

      case 5:
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.executeAtom('type', [atomsElement, value]));

      case 7:
        context$1$0.next = 56;
        break;

      case 9:
        setFormattedValue = function setFormattedValue(input, isKeyboardPresenceCheckEnabled) {
          return _regeneratorRuntime.async(function setFormattedValue$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                if (typeof input !== 'string' && !(input instanceof Array)) {
                  input = input.toString().split('');
                }
                context$2$0.prev = 1;
                context$2$0.next = 4;
                return _regeneratorRuntime.awrap(this.proxyCommand('/element/' + el + '/value', 'POST', { value: input }));

              case 4:
                context$2$0.next = 23;
                break;

              case 6:
                context$2$0.prev = 6;
                context$2$0.t0 = context$2$0['catch'](1);
                context$2$0.t1 = isKeyboardPresenceCheckEnabled;

                if (!context$2$0.t1) {
                  context$2$0.next = 14;
                  break;
                }

                context$2$0.next = 12;
                return _regeneratorRuntime.awrap(this.getAttribute('type', el));

              case 12:
                context$2$0.t2 = context$2$0.sent;
                context$2$0.t1 = context$2$0.t2 === 'XCUIElementTypeTextField';

              case 14:
                if (!context$2$0.t1) {
                  context$2$0.next = 22;
                  break;
                }

                _logger2['default'].info('Cannot type in the text field because of ' + context$2$0.t0 + '.\nTrying to apply a workaround...');
                context$2$0.next = 18;
                return _regeneratorRuntime.awrap(this.bringUpKeyboard(el));

              case 18:
                context$2$0.next = 20;
                return _regeneratorRuntime.awrap(this.proxyCommand('/element/' + el + '/value', 'POST', { value: input }));

              case 20:
                context$2$0.next = 23;
                break;

              case 22:
                throw context$2$0.t0;

              case 23:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this2, [[1, 6]]);
        };

        if (!(_lodash2['default'].isNull(value) || _lodash2['default'].isUndefined(value) || _lodash2['default'].isPlainObject(value))) {
          context$1$0.next = 12;
          break;
        }

        throw new Error('Only strings and arrays of strings are supported as input arguments. Received: \'' + JSON.stringify(value) + '\'');

      case 12:
        if (_lodash2['default'].isArray(value)) {
          // make sure that all the strings inside are a single character long
          value = _lodash2['default'].flatMap(value, function (v) {
            return (_lodash2['default'].isString(v) ? v : JSON.stringify(v)).split('');
          });
        } else {
          // make it into an array of characters
          value = (value || '').toString().split('');
        }

        if (hasSpecialKeys(value)) {
          context$1$0.next = 17;
          break;
        }

        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(setFormattedValue(value, true));

      case 16:
        return context$1$0.abrupt('return');

      case 17:
        buffer = [];
        isFirstChar = true;
        _iteratorNormalCompletion2 = true;
        _didIteratorError2 = false;
        _iteratorError2 = undefined;
        context$1$0.prev = 22;
        _iterator2 = _getIterator(value);

      case 24:
        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
          context$1$0.next = 39;
          break;
        }

        k = _step2.value;
        char = translateKey(k);

        if (!(char === k)) {
          context$1$0.next = 30;
          break;
        }

        buffer.push(char);
        return context$1$0.abrupt('continue', 36);

      case 30:
        context$1$0.next = 32;
        return _regeneratorRuntime.awrap(setFormattedValue(buffer, isFirstChar));

      case 32:
        isFirstChar = false;
        buffer = [];

        // write the character
        context$1$0.next = 36;
        return _regeneratorRuntime.awrap(setFormattedValue([char], isFirstChar));

      case 36:
        _iteratorNormalCompletion2 = true;
        context$1$0.next = 24;
        break;

      case 39:
        context$1$0.next = 45;
        break;

      case 41:
        context$1$0.prev = 41;
        context$1$0.t0 = context$1$0['catch'](22);
        _didIteratorError2 = true;
        _iteratorError2 = context$1$0.t0;

      case 45:
        context$1$0.prev = 45;
        context$1$0.prev = 46;

        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }

      case 48:
        context$1$0.prev = 48;

        if (!_didIteratorError2) {
          context$1$0.next = 51;
          break;
        }

        throw _iteratorError2;

      case 51:
        return context$1$0.finish(48);

      case 52:
        return context$1$0.finish(45);

      case 53:
        if (!buffer.length) {
          context$1$0.next = 56;
          break;
        }

        context$1$0.next = 56;
        return _regeneratorRuntime.awrap(setFormattedValue(buffer, false));

      case 56:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[22, 41, 45, 53], [46,, 48, 52]]);
};

commands.keys = function callee$0$0(value) {
  var buffer, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, k, char;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (_lodash2['default'].isArray(value)) {
          // concatenate any individual strings
          value = value.join('');
        }
        if (_lodash2['default'].isString(value)) {
          // split into component characters
          value = value.split('');
        }

        buffer = [];
        _iteratorNormalCompletion3 = true;
        _didIteratorError3 = false;
        _iteratorError3 = undefined;
        context$1$0.prev = 6;

        for (_iterator3 = _getIterator(value); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          k = _step3.value;
          char = translateKey(k);

          buffer.push(char);
        }
        context$1$0.next = 14;
        break;

      case 10:
        context$1$0.prev = 10;
        context$1$0.t0 = context$1$0['catch'](6);
        _didIteratorError3 = true;
        _iteratorError3 = context$1$0.t0;

      case 14:
        context$1$0.prev = 14;
        context$1$0.prev = 15;

        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
          _iterator3['return']();
        }

      case 17:
        context$1$0.prev = 17;

        if (!_didIteratorError3) {
          context$1$0.next = 20;
          break;
        }

        throw _iteratorError3;

      case 20:
        return context$1$0.finish(17);

      case 21:
        return context$1$0.finish(14);

      case 22:
        context$1$0.next = 24;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/keys', 'POST', { value: buffer }));

      case 24:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[6, 10, 14, 22], [15,, 17, 21]]);
};

commands.clear = function callee$0$0(el) {
  var atomsElement;
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
        return _regeneratorRuntime.awrap(this.executeAtom('clear', [atomsElement]));

      case 5:
        return context$1$0.abrupt('return');

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap((0, _asyncbox.retry)(5, this.proxyCommand.bind(this), '/element/' + el + '/clear', 'POST'));

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

_Object$assign(extensions, commands);
exports.commands = commands;
exports['default'] = extensions;

// sometimes input is attempted before we have a keyboard. Try to bring one up
// but we want to handle the retries on find

// no matter what we do, make sure we have the implicit wait set up correctly

// make sure there is a keyboard if this is a text field

// possible values of `value`:
//   ['some text']
//   ['s', 'o', 'm', 'e', ' ', 't', 'e', 'x', 't']
//   'some text'

// nothing special, so just send it in

// if there are special characters, go through the value until we get to one,
// and then print it individually
// currently only supporting return, enter, backspace, and delete

// write and clear the buffer

// finally, send anything that might be left
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9lbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7OztnQ0FDQyxvQkFBb0I7OytCQUNmLG1CQUFtQjs7NkJBQzFCLGdCQUFnQjs7d0JBQ0EsVUFBVTs7c0JBQy9CLFdBQVc7Ozs7QUFHM0IsSUFBSSxRQUFRLEdBQUcsRUFBRTtJQUFFLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDbkMsZUFBYyxVQUFVLEVBQUUsNkJBQVksT0FBTyxDQUFDLENBQUM7O0FBRS9DLFFBQVEsQ0FBQyxZQUFZLEdBQUcsb0JBQWdCLFNBQVMsRUFBRSxFQUFFO01BRzdDLEtBQUssRUFRUCxZQUFZOzs7O0FBVmhCLFVBQUUsR0FBRyxvQkFBSyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7O1lBQ3ZCLElBQUksQ0FBQyxZQUFZLEVBQUU7Ozs7Ozt5Q0FDSixJQUFJLENBQUMsWUFBWSxlQUFhLEVBQUUsbUJBQWMsU0FBUyxFQUFJLEtBQUssQ0FBQzs7O0FBQS9FLGFBQUs7OztBQUVULFlBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ2hDLGVBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQ2pCOzs0Q0FFTSxBQUFDLG9CQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxvQkFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDOzs7QUFFM0Usb0JBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQzs7YUFDdkMsb0JBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQzs7Ozs7Y0FDbEIsSUFBSSx5QkFBTyxZQUFZLDJEQUF3RCxFQUFFLENBQUc7Ozs7eUNBRS9FLElBQUksQ0FBQyxXQUFXLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxZ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QUFNLEdBQUcsRUFBRTs7Ozs7O0FBQ2YsdUNBQWMsS0FBSyx5R0FBRTtBQUFaLFdBQUM7QUFDSixjQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQzs7QUFFMUIsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5Q0FDSyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUM7Ozs7Ozs7Q0FDOUQsQ0FBQzs7QUFFRixRQUFRLENBQUMsS0FBSyxHQUFHLG9CQUFnQixFQUFFO01BRzNCLFlBQVk7Ozs7QUFGbEIsVUFBRSxHQUFHLG9CQUFLLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7YUFDeEIsSUFBSSxDQUFDLFlBQVksRUFBRTs7Ozs7QUFDakIsb0JBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQzs7eUNBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUM7Ozs7Ozs7eUNBRzNDLHFCQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWMsRUFBRSxhQUFVLE1BQU0sQ0FBQzs7Ozs7OztDQUM3RSxDQUFDOztBQUdGLGVBQWMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNCLFFBQVEsR0FBUixRQUFRO3FCQUNGLFVBQVUiLCJmaWxlIjoibGliL2NvbW1hbmRzL2VsZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgZXJyb3JzIH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcbmltcG9ydCB7IGlvc0NvbW1hbmRzIH0gZnJvbSAnYXBwaXVtLWlvcy1kcml2ZXInO1xuaW1wb3J0IHsgdXRpbCB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcbmltcG9ydCB7IHJldHJ5SW50ZXJ2YWwsIHJldHJ5IH0gZnJvbSAnYXN5bmNib3gnO1xuaW1wb3J0IGxvZyBmcm9tICcuLi9sb2dnZXInO1xuXG5cbmxldCBjb21tYW5kcyA9IHt9LCBleHRlbnNpb25zID0ge307XG5PYmplY3QuYXNzaWduKGV4dGVuc2lvbnMsIGlvc0NvbW1hbmRzLmVsZW1lbnQpO1xuXG5jb21tYW5kcy5nZXRBdHRyaWJ1dGUgPSBhc3luYyBmdW5jdGlvbiAoYXR0cmlidXRlLCBlbCkge1xuICBlbCA9IHV0aWwudW53cmFwRWxlbWVudChlbCk7XG4gIGlmICghdGhpcy5pc1dlYkNvbnRleHQoKSkge1xuICAgIGxldCB2YWx1ZSA9IGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGAvZWxlbWVudC8ke2VsfS9hdHRyaWJ1dGUvJHthdHRyaWJ1dGV9YCwgJ0dFVCcpO1xuICAgIC8vIFRyYW5zZm9ybSB0aGUgcmVzdWx0IGZvciB0aGUgY2FzZSB3aGVuIFdEQSByZXR1cm5zIGFuIGludGVnZXIgcmVwcmVzZW50YXRpb24gZm9yIGEgYm9vbGVhbiB2YWx1ZVxuICAgIGlmIChbMCwgMV0uaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XG4gICAgICB2YWx1ZSA9ICEhdmFsdWU7XG4gICAgfVxuICAgIC8vIFRoZSByZXR1cm5lZCB2YWx1ZSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nIGFjY29yZGluZyB0byBodHRwczovL3d3dy53My5vcmcvVFIvd2ViZHJpdmVyLyNnZXQtZWxlbWVudC1hdHRyaWJ1dGVcbiAgICByZXR1cm4gKF8uaXNOdWxsKHZhbHVlKSB8fCBfLmlzU3RyaW5nKHZhbHVlKSkgPyB2YWx1ZSA6IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgfVxuICBsZXQgYXRvbXNFbGVtZW50ID0gdGhpcy5nZXRBdG9tc0VsZW1lbnQoZWwpO1xuICBpZiAoXy5pc051bGwoYXRvbXNFbGVtZW50KSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuVW5rbm93bkVycm9yKGBFcnJvciBjb252ZXJ0aW5nIGVsZW1lbnQgSUQgZm9yIHVzaW5nIGluIFdEIGF0b21zOiAnJHtlbH1gKTtcbiAgfVxuICByZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlQXRvbSgnZ2V0X2F0dHJpYnV0ZV92YWx1ZScsIFthdG9tc0VsZW1lbnQsIGF0dHJpYnV0ZV0pO1xufTtcblxuY29tbWFuZHMuZ2V0VGV4dCA9IGFzeW5jIGZ1bmN0aW9uIChlbCkge1xuICBlbCA9IHV0aWwudW53cmFwRWxlbWVudChlbCk7XG4gIGlmICghdGhpcy5pc1dlYkNvbnRleHQoKSkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZChgL2VsZW1lbnQvJHtlbH0vdGV4dGAsICdHRVQnKTtcbiAgfVxuICBsZXQgYXRvbXNFbGVtZW50ID0gdGhpcy51c2VBdG9tc0VsZW1lbnQoZWwpO1xuICByZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlQXRvbSgnZ2V0X3RleHQnLCBbYXRvbXNFbGVtZW50XSk7XG59O1xuXG5jb21tYW5kcy5nZXRSZWN0ID0gYXN5bmMgZnVuY3Rpb24gKGVsKSB7XG4gIGVsID0gdXRpbC51bndyYXBFbGVtZW50KGVsKTtcbiAgaWYgKHRoaXMuaXNXZWJDb250ZXh0KCkpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLk5vdFlldEltcGxlbWVudGVkRXJyb3IoJ1N1cHBvcnQgZm9yIGdldFJlY3QgZm9yIHdlYmNvbnRleHQgaXMgbm90IHlldCBpbXBsZW1lbnRlZC4gUGxlYXNlIGNvbnRhY3QgYW4gQXBwaXVtIGRldicpO1xuICB9XG5cbiAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0TmF0aXZlUmVjdChlbCk7XG59O1xuXG5leHRlbnNpb25zLmdldE5hdGl2ZVJlY3QgPSBhc3luYyBmdW5jdGlvbiAoZWwpIHtcbiAgcmV0dXJuIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGAvZWxlbWVudC8ke2VsfS9yZWN0YCwgJ0dFVCcpO1xufTtcblxuY29tbWFuZHMuZ2V0TG9jYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoZWwpIHtcbiAgZWwgPSBlbC5FTEVNRU5UID8gZWwuRUxFTUVOVCA6IGVsO1xuICBpZiAodGhpcy5pc1dlYkNvbnRleHQoKSkge1xuICAgIGNvbnN0IGF0b21zRWxlbWVudCA9IGF3YWl0IHRoaXMudXNlQXRvbXNFbGVtZW50KGVsKTtcbiAgICBsZXQgbG9jID0gYXdhaXQgdGhpcy5leGVjdXRlQXRvbSgnZ2V0X3RvcF9sZWZ0X2Nvb3JkaW5hdGVzJywgW2F0b21zRWxlbWVudF0pO1xuICAgIGlmICh0aGlzLm9wdHMuYWJzb2x1dGVXZWJMb2NhdGlvbnMpIHtcbiAgICAgIGNvbnN0IHNjcmlwdCA9ICdyZXR1cm4gW2RvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3BdOyc7XG4gICAgICBjb25zdCBbeE9mZnNldCwgeU9mZnNldF0gPSBhd2FpdCB0aGlzLmV4ZWN1dGUoc2NyaXB0KTtcbiAgICAgIGxvYy54ICs9IHhPZmZzZXQ7XG4gICAgICBsb2MueSArPSB5T2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gbG9jO1xuICB9IGVsc2Uge1xuICAgIGxldCByZWN0ID0gYXdhaXQgdGhpcy5nZXRSZWN0KGVsKTtcbiAgICByZXR1cm4ge3g6IHJlY3QueCwgeTogcmVjdC55fTtcbiAgfVxufTtcblxuY29tbWFuZHMuZ2V0TG9jYXRpb25JblZpZXcgPSBhc3luYyBmdW5jdGlvbiAoZWwpIHtcbiAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0TG9jYXRpb24oZWwpO1xufTtcblxuY29tbWFuZHMuZ2V0U2l6ZSA9IGFzeW5jIGZ1bmN0aW9uIChlbCkge1xuICBlbCA9IGVsLkVMRU1FTlQgPyBlbC5FTEVNRU5UIDogZWw7XG4gIGlmICh0aGlzLmlzV2ViQ29udGV4dCgpKSB7XG4gICAgbGV0IGF0b21zRWxlbWVudCA9IHRoaXMuZ2V0QXRvbXNFbGVtZW50KGVsKTtcbiAgICBpZiAoYXRvbXNFbGVtZW50ID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlVua25vd25FcnJvcihgRXJyb3IgY29udmVydGluZyBlbGVtZW50IElEIGZvciB1c2luZyBpbiBXRCBhdG9tczogJyR7ZWx9J2ApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlQXRvbSgnZ2V0X3NpemUnLCBbYXRvbXNFbGVtZW50XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxldCByZWN0ID0gYXdhaXQgdGhpcy5nZXRSZWN0KGVsKTtcbiAgICByZXR1cm4ge3dpZHRoOiByZWN0LndpZHRoLCBoZWlnaHQ6IHJlY3QuaGVpZ2h0fTtcbiAgfVxufTtcblxuZnVuY3Rpb24gaGFzU3BlY2lhbEtleXMgKGtleXMpIHtcbiAgZm9yIChsZXQgY2hhciBvZiBrZXlzKSB7XG4gICAgaWYgKGlzU3BlY2lhbEtleShjaGFyKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNTcGVjaWFsS2V5IChrKSB7XG4gIGlmIChrID09PSAnXFx1RTAwMycgfHwgayA9PT0gJ1xcdWUwMTcnKSB7IC8vIEJBQ0tTUEFDRSBvciBERUxFVEVcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChrID09PSAnXFx1RTAwNicgfHwgayA9PT0gJ1xcdUUwMDcnKSB7IC8vIFJFVFVSTiBvciBFTlRFUlxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlS2V5IChrKSB7XG4gIGlmIChrID09PSAnXFx1RTAwNicgfHwgayA9PT0gJ1xcdUUwMDcnKSB7IC8vIFJFVFVSTiBvciBFTlRFUlxuICAgIHJldHVybiAnXFxuJztcbiAgfSBlbHNlIGlmIChrID09PSAnXFx1RTAwMycgfHwgayA9PT0gJ1xcdWUwMTcnKSB7IC8vIEJBQ0tTUEFDRSBvciBERUxFVEVcbiAgICByZXR1cm4gJ1xcYic7XG4gIH1cbiAgcmV0dXJuIGs7XG59XG5cbmV4dGVuc2lvbnMuYnJpbmdVcEtleWJvYXJkID0gYXN5bmMgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgLy8gc29tZXRpbWVzIGlucHV0IGlzIGF0dGVtcHRlZCBiZWZvcmUgd2UgaGF2ZSBhIGtleWJvYXJkLiBUcnkgdG8gYnJpbmcgb25lIHVwXG4gIC8vIGJ1dCB3ZSB3YW50IHRvIGhhbmRsZSB0aGUgcmV0cmllcyBvbiBmaW5kXG4gIGxldCBpbXBsaWNpdFdhaXRNcyA9IHRoaXMuaW1wbGljaXRXYWl0TXM7XG4gIGF3YWl0IHRoaXMuc2V0SW1wbGljaXRXYWl0KDApO1xuICB0cnkge1xuICAgIGF3YWl0IHJldHJ5SW50ZXJ2YWwoMTAsIDEwLCBhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLmZpbmROYXRpdmVFbGVtZW50T3JFbGVtZW50cygnY2xhc3MgbmFtZScsICdYQ1VJRWxlbWVudFR5cGVLZXlib2FyZCcsIGZhbHNlKTtcbiAgICAgICAgbG9nLmRlYnVnKCdLZXlib2FyZCBmb3VuZC4gQ29udGludWluZyB3aXRoIHRleHQgaW5wdXQuJyk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgLy8gbm8ga2V5Ym9hcmQgZm91bmRcbiAgICAgICAgbG9nLmRlYnVnKCdObyBrZXlib2FyZCBmb3VuZC4gQ2xpY2tpbmcgZWxlbWVudCB0byBvcGVuIGl0LicpO1xuICAgICAgICBhd2FpdCB0aGlzLm5hdGl2ZUNsaWNrKGVsZW1lbnQpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuZmluZE5hdGl2ZUVsZW1lbnRPckVsZW1lbnRzKCdjbGFzcyBuYW1lJywgJ1hDVUlFbGVtZW50VHlwZUtleWJvYXJkJywgZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIG5vIG1hdHRlciB3aGF0IHdlIGRvLCBtYWtlIHN1cmUgd2UgaGF2ZSB0aGUgaW1wbGljaXQgd2FpdCBzZXQgdXAgY29ycmVjdGx5XG4gICAgYXdhaXQgdGhpcy5zZXRJbXBsaWNpdFdhaXQoaW1wbGljaXRXYWl0TXMpO1xuICB9XG59O1xuXG5jb21tYW5kcy5zZXRWYWx1ZUltbWVkaWF0ZSA9IGFzeW5jIGZ1bmN0aW9uICh2YWx1ZSwgZWwpIHtcbiAgLy8gV0RBIGRvZXMgbm90IHByb3ZpZGUgbm8gd2F5IHRvIHNldCB0aGUgdmFsdWUgZGlyZWN0bHlcbiAgbG9nLmluZm8oJ1RoZXJlIGlzIGN1cnJlbnRseSBubyB3YXkgdG8gYnlwYXNzIHR5cGluZyB1c2luZyBYQ1VJVGVzdC4gU2V0dGluZyB2YWx1ZSB0aHJvdWdoIGtleWJvYXJkJyk7XG4gIGF3YWl0IHRoaXMuc2V0VmFsdWUodmFsdWUsIGVsKTtcbn07XG5cbmNvbW1hbmRzLnNldFZhbHVlID0gYXN5bmMgZnVuY3Rpb24gKHZhbHVlLCBlbCkge1xuICBlbCA9IHV0aWwudW53cmFwRWxlbWVudChlbCk7XG4gIGlmICh0aGlzLmlzV2ViQ29udGV4dCgpKSB7XG4gICAgbGV0IGF0b21zRWxlbWVudCA9IHRoaXMudXNlQXRvbXNFbGVtZW50KGVsKTtcbiAgICBhd2FpdCB0aGlzLmV4ZWN1dGVBdG9tKCdjbGljaycsIFthdG9tc0VsZW1lbnRdKTtcbiAgICBhd2FpdCB0aGlzLmV4ZWN1dGVBdG9tKCd0eXBlJywgW2F0b21zRWxlbWVudCwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBzZXRGb3JtYXR0ZWRWYWx1ZSA9IGFzeW5jIChpbnB1dCwgaXNLZXlib2FyZFByZXNlbmNlQ2hlY2tFbmFibGVkKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJyAmJiAhKGlucHV0IGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIGlucHV0ID0gaW5wdXQudG9TdHJpbmcoKS5zcGxpdCgnJyk7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZChgL2VsZW1lbnQvJHtlbH0vdmFsdWVgLCAnUE9TVCcsIHt2YWx1ZTogaW5wdXR9KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlcmUgaXMgYSBrZXlib2FyZCBpZiB0aGlzIGlzIGEgdGV4dCBmaWVsZFxuICAgICAgICBpZiAoaXNLZXlib2FyZFByZXNlbmNlQ2hlY2tFbmFibGVkICYmIGF3YWl0IHRoaXMuZ2V0QXR0cmlidXRlKCd0eXBlJywgZWwpID09PSAnWENVSUVsZW1lbnRUeXBlVGV4dEZpZWxkJykge1xuICAgICAgICAgIGxvZy5pbmZvKGBDYW5ub3QgdHlwZSBpbiB0aGUgdGV4dCBmaWVsZCBiZWNhdXNlIG9mICR7ZXJyfS5cXG5UcnlpbmcgdG8gYXBwbHkgYSB3b3JrYXJvdW5kLi4uYCk7XG4gICAgICAgICAgYXdhaXQgdGhpcy5icmluZ1VwS2V5Ym9hcmQoZWwpO1xuICAgICAgICAgIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGAvZWxlbWVudC8ke2VsfS92YWx1ZWAsICdQT1NUJywge3ZhbHVlOiBpbnB1dH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBwb3NzaWJsZSB2YWx1ZXMgb2YgYHZhbHVlYDpcbiAgICAvLyAgIFsnc29tZSB0ZXh0J11cbiAgICAvLyAgIFsncycsICdvJywgJ20nLCAnZScsICcgJywgJ3QnLCAnZScsICd4JywgJ3QnXVxuICAgIC8vICAgJ3NvbWUgdGV4dCdcbiAgICBpZiAoXy5pc051bGwodmFsdWUpIHx8IF8uaXNVbmRlZmluZWQodmFsdWUpIHx8IF8uaXNQbGFpbk9iamVjdCh2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgT25seSBzdHJpbmdzIGFuZCBhcnJheXMgb2Ygc3RyaW5ncyBhcmUgc3VwcG9ydGVkIGFzIGlucHV0IGFyZ3VtZW50cy4gUmVjZWl2ZWQ6ICcke0pTT04uc3RyaW5naWZ5KHZhbHVlKX0nYCk7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAvLyBtYWtlIHN1cmUgdGhhdCBhbGwgdGhlIHN0cmluZ3MgaW5zaWRlIGFyZSBhIHNpbmdsZSBjaGFyYWN0ZXIgbG9uZ1xuICAgICAgdmFsdWUgPSBfLmZsYXRNYXAodmFsdWUsICh2KSA9PiAoXy5pc1N0cmluZyh2KSA/IHYgOiBKU09OLnN0cmluZ2lmeSh2KSkuc3BsaXQoJycpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbWFrZSBpdCBpbnRvIGFuIGFycmF5IG9mIGNoYXJhY3RlcnNcbiAgICAgIHZhbHVlID0gKHZhbHVlIHx8ICcnKS50b1N0cmluZygpLnNwbGl0KCcnKTtcbiAgICB9XG5cbiAgICBpZiAoIWhhc1NwZWNpYWxLZXlzKHZhbHVlKSkge1xuICAgICAgLy8gbm90aGluZyBzcGVjaWFsLCBzbyBqdXN0IHNlbmQgaXQgaW5cbiAgICAgIGF3YWl0IHNldEZvcm1hdHRlZFZhbHVlKHZhbHVlLCB0cnVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGVyZSBhcmUgc3BlY2lhbCBjaGFyYWN0ZXJzLCBnbyB0aHJvdWdoIHRoZSB2YWx1ZSB1bnRpbCB3ZSBnZXQgdG8gb25lLFxuICAgIC8vIGFuZCB0aGVuIHByaW50IGl0IGluZGl2aWR1YWxseVxuICAgIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRpbmcgcmV0dXJuLCBlbnRlciwgYmFja3NwYWNlLCBhbmQgZGVsZXRlXG4gICAgbGV0IGJ1ZmZlciA9IFtdO1xuICAgIGxldCBpc0ZpcnN0Q2hhciA9IHRydWU7XG4gICAgZm9yIChsZXQgayBvZiB2YWx1ZSkge1xuICAgICAgbGV0IGNoYXIgPSB0cmFuc2xhdGVLZXkoayk7XG5cbiAgICAgIGlmIChjaGFyID09PSBrKSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoKGNoYXIpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gd3JpdGUgYW5kIGNsZWFyIHRoZSBidWZmZXJcbiAgICAgIGF3YWl0IHNldEZvcm1hdHRlZFZhbHVlKGJ1ZmZlciwgaXNGaXJzdENoYXIpO1xuICAgICAgaXNGaXJzdENoYXIgPSBmYWxzZTtcbiAgICAgIGJ1ZmZlciA9IFtdO1xuXG4gICAgICAvLyB3cml0ZSB0aGUgY2hhcmFjdGVyXG4gICAgICBhd2FpdCBzZXRGb3JtYXR0ZWRWYWx1ZShbY2hhcl0sIGlzRmlyc3RDaGFyKTtcbiAgICB9XG4gICAgLy8gZmluYWxseSwgc2VuZCBhbnl0aGluZyB0aGF0IG1pZ2h0IGJlIGxlZnRcbiAgICBpZiAoYnVmZmVyLmxlbmd0aCkge1xuICAgICAgYXdhaXQgc2V0Rm9ybWF0dGVkVmFsdWUoYnVmZmVyLCBmYWxzZSk7XG4gICAgfVxuICB9XG59O1xuXG5jb21tYW5kcy5rZXlzID0gYXN5bmMgZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgLy8gY29uY2F0ZW5hdGUgYW55IGluZGl2aWR1YWwgc3RyaW5nc1xuICAgIHZhbHVlID0gdmFsdWUuam9pbignJyk7XG4gIH1cbiAgaWYgKF8uaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgLy8gc3BsaXQgaW50byBjb21wb25lbnQgY2hhcmFjdGVyc1xuICAgIHZhbHVlID0gdmFsdWUuc3BsaXQoJycpO1xuICB9XG5cbiAgbGV0IGJ1ZmZlciA9IFtdO1xuICBmb3IgKGxldCBrIG9mIHZhbHVlKSB7XG4gICAgbGV0IGNoYXIgPSB0cmFuc2xhdGVLZXkoayk7XG5cbiAgICBidWZmZXIucHVzaChjaGFyKTtcbiAgfVxuICBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZCgnL3dkYS9rZXlzJywgJ1BPU1QnLCB7dmFsdWU6IGJ1ZmZlcn0pO1xufTtcblxuY29tbWFuZHMuY2xlYXIgPSBhc3luYyBmdW5jdGlvbiAoZWwpIHtcbiAgZWwgPSB1dGlsLnVud3JhcEVsZW1lbnQoZWwpO1xuICBpZiAodGhpcy5pc1dlYkNvbnRleHQoKSkge1xuICAgIGxldCBhdG9tc0VsZW1lbnQgPSB0aGlzLnVzZUF0b21zRWxlbWVudChlbCk7XG4gICAgYXdhaXQgdGhpcy5leGVjdXRlQXRvbSgnY2xlYXInLCBbYXRvbXNFbGVtZW50XSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGF3YWl0IHJldHJ5KDUsIHRoaXMucHJveHlDb21tYW5kLmJpbmQodGhpcyksIGAvZWxlbWVudC8ke2VsfS9jbGVhcmAsICdQT1NUJyk7XG59O1xuXG5cbk9iamVjdC5hc3NpZ24oZXh0ZW5zaW9ucywgY29tbWFuZHMpO1xuZXhwb3J0IHsgY29tbWFuZHMgfTtcbmV4cG9ydCBkZWZhdWx0IGV4dGVuc2lvbnM7XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uLy4uIn0=
