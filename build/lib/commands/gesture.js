'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _appiumBaseDriver = require('appium-base-driver');

var _appiumSupport = require('appium-support');

var _appiumIosDriver = require('appium-ios-driver');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var helpers = {},
    extensions = {},
    commands = {};

commands.moveTo = _appiumIosDriver.iosCommands.gesture.moveTo;

commands.mobileShake = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (this.isSimulator()) {
          context$1$0.next = 2;
          break;
        }

        throw new _appiumBaseDriver.errors.UnknownError('Shake is not supported on real devices');

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.opts.device.shake());

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.click = function callee$0$0(el) {
  var atomsElement;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (this.isWebContext()) {
          context$1$0.next = 4;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.nativeClick(el));

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 4:
        el = _appiumSupport.util.unwrapElement(el);

        if (!this.settings.getSettings().nativeWebTap) {
          context$1$0.next = 11;
          break;
        }

        // atoms-based clicks don't always work in safari 7
        _logger2['default'].debug('Using native web tap');
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(this.nativeWebTap(el));

      case 9:
        context$1$0.next = 15;
        break;

      case 11:
        atomsElement = this.useAtomsElement(el);
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(this.executeAtom('click', [atomsElement]));

      case 14:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 15:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

function isSameGestures(gestures, candidates) {
  try {
    if (gestures.length !== candidates.length) {
      return false;
    }
    for (var i = 0; i < gestures.length; i++) {
      var gestureObj = gestures[i];
      var candidateObj = candidates[i];
      if (!_lodash2['default'].isPlainObject(gestureObj) || !_lodash2['default'].isPlainObject(candidateObj)) {
        return false;
      }
      if (_lodash2['default'].difference(_lodash2['default'].keys(candidateObj), _lodash2['default'].keys(gestureObj)).length) {
        return false;
      }
      if (gestureObj.action.toLowerCase() !== candidateObj.action.toLowerCase()) {
        return false;
      }
      if (candidateObj.options && gestureObj.options.count !== candidateObj.options.count) {
        return false;
      }
    }
  } catch (err) {
    _logger2['default'].debug('Error "' + err.message + '" while comparing gestures. Considering them as not equal');
    return false;
  }
  return true;
}

function gesturesChainToString(gestures) {
  var keysToInclude = arguments.length <= 1 || arguments[1] === undefined ? ['options'] : arguments[1];

  return gestures.map(function (item) {
    var otherKeys = _lodash2['default'].difference(_lodash2['default'].keys(item), ['action']);
    otherKeys = _lodash2['default'].isArray(keysToInclude) ? _lodash2['default'].intersection(otherKeys, keysToInclude) : otherKeys;
    if (otherKeys.length) {
      return '' + item.action + ('(' + _lodash2['default'].map(otherKeys, function (x) {
        return x + '=' + (_lodash2['default'].isPlainObject(item[x]) ? JSON.stringify(item[x]) : item[x]);
      }).join(', ') + ')');
    }
    return item.action;
  }).join('-');
}

commands.performTouch = function callee$0$0(gestures) {
  var supportedGesturesMapping, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, cmd, info, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, candidateMatch, availableGestures, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _step2$value, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug('Received the following touch action: ' + gesturesChainToString(gestures));

        supportedGesturesMapping = {
          doubleTap: {
            handler: function handler(x) {
              return _regeneratorRuntime.async(function handler$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                  case 0:
                    context$2$0.next = 2;
                    return _regeneratorRuntime.awrap(this.handleDoubleTap(x));

                  case 2:
                  case 'end':
                    return context$2$0.stop();
                }
              }, null, _this);
            },
            matches: [[{ action: 'doubletap' }], [{ action: 'tap', options: { count: 2 } }]]
          },
          tap: {
            handler: function handler(x) {
              return _regeneratorRuntime.async(function handler$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                  case 0:
                    context$2$0.next = 2;
                    return _regeneratorRuntime.awrap(this.handleTap(x[0]));

                  case 2:
                  case 'end':
                    return context$2$0.stop();
                }
              }, null, _this);
            },
            matches: [[{ action: 'tap' }], [{ action: 'tap' }, { action: 'release' }], [{ action: 'press' }, { action: 'release' }]]
          },
          longPress: {
            handler: function handler(x) {
              return _regeneratorRuntime.async(function handler$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                  case 0:
                    context$2$0.next = 2;
                    return _regeneratorRuntime.awrap(this.handleLongPress(x));

                  case 2:
                  case 'end':
                    return context$2$0.stop();
                }
              }, null, _this);
            },
            matches: [[{ action: 'longpress' }], [{ action: 'longpress' }, { action: 'release' }], [{ action: 'press' }, { action: 'wait' }, { action: 'release' }]]
          },
          drag: {
            handler: function handler(x) {
              return _regeneratorRuntime.async(function handler$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                  case 0:
                    context$2$0.next = 2;
                    return _regeneratorRuntime.awrap(this.handleDrag(x));

                  case 2:
                  case 'end':
                    return context$2$0.stop();
                }
              }, null, _this);
            },
            matches: [[{ action: 'press' }, { action: 'wait' }, { action: 'moveTo' }, { action: 'release' }], [{ action: 'longpress' }, { action: 'moveTo' }, { action: 'release' }]]
          },
          scroll: {
            handler: function handler(x) {
              return _regeneratorRuntime.async(function handler$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                  case 0:
                    context$2$0.next = 2;
                    return _regeneratorRuntime.awrap(this.handleScroll(x));

                  case 2:
                  case 'end':
                    return context$2$0.stop();
                }
              }, null, _this);
            },
            matches: [[{ action: 'press' }, { action: 'moveTo' }, { action: 'release' }]]
          }
        };
        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;
        context$1$0.prev = 5;
        _iterator = _getIterator(_lodash2['default'].toPairs(supportedGesturesMapping));

      case 7:
        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
          context$1$0.next = 43;
          break;
        }

        _step$value = _slicedToArray(_step.value, 2);
        cmd = _step$value[0];
        info = _step$value[1];
        _iteratorNormalCompletion3 = true;
        _didIteratorError3 = false;
        _iteratorError3 = undefined;
        context$1$0.prev = 14;
        _iterator3 = _getIterator(info.matches);

      case 16:
        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
          context$1$0.next = 26;
          break;
        }

        candidateMatch = _step3.value;

        if (!isSameGestures(gestures, candidateMatch)) {
          context$1$0.next = 23;
          break;
        }

        _logger2['default'].debug('Found matching gesture: ' + cmd);
        context$1$0.next = 22;
        return _regeneratorRuntime.awrap(info.handler(gestures));

      case 22:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 23:
        _iteratorNormalCompletion3 = true;
        context$1$0.next = 16;
        break;

      case 26:
        context$1$0.next = 32;
        break;

      case 28:
        context$1$0.prev = 28;
        context$1$0.t0 = context$1$0['catch'](14);
        _didIteratorError3 = true;
        _iteratorError3 = context$1$0.t0;

      case 32:
        context$1$0.prev = 32;
        context$1$0.prev = 33;

        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
          _iterator3['return']();
        }

      case 35:
        context$1$0.prev = 35;

        if (!_didIteratorError3) {
          context$1$0.next = 38;
          break;
        }

        throw _iteratorError3;

      case 38:
        return context$1$0.finish(35);

      case 39:
        return context$1$0.finish(32);

      case 40:
        _iteratorNormalCompletion = true;
        context$1$0.next = 7;
        break;

      case 43:
        context$1$0.next = 49;
        break;

      case 45:
        context$1$0.prev = 45;
        context$1$0.t1 = context$1$0['catch'](5);
        _didIteratorError = true;
        _iteratorError = context$1$0.t1;

      case 49:
        context$1$0.prev = 49;
        context$1$0.prev = 50;

        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }

      case 52:
        context$1$0.prev = 52;

        if (!_didIteratorError) {
          context$1$0.next = 55;
          break;
        }

        throw _iteratorError;

      case 55:
        return context$1$0.finish(52);

      case 56:
        return context$1$0.finish(49);

      case 57:
        availableGestures = '';
        _iteratorNormalCompletion2 = true;
        _didIteratorError2 = false;
        _iteratorError2 = undefined;
        context$1$0.prev = 61;
        _iterator2 = _getIterator(_lodash2['default'].toPairs(supportedGesturesMapping));

      case 63:
        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
          context$1$0.next = 90;
          break;
        }

        _step2$value = _slicedToArray(_step2.value, 2);
        cmd = _step2$value[0];
        info = _step2$value[1];

        availableGestures += '\t' + cmd + ': ';
        _iteratorNormalCompletion4 = true;
        _didIteratorError4 = false;
        _iteratorError4 = undefined;
        context$1$0.prev = 71;
        for (_iterator4 = _getIterator(info.matches); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          candidateMatch = _step4.value;

          availableGestures += '\t\t' + gesturesChainToString(candidateMatch) + '\n';
        }
        context$1$0.next = 79;
        break;

      case 75:
        context$1$0.prev = 75;
        context$1$0.t2 = context$1$0['catch'](71);
        _didIteratorError4 = true;
        _iteratorError4 = context$1$0.t2;

      case 79:
        context$1$0.prev = 79;
        context$1$0.prev = 80;

        if (!_iteratorNormalCompletion4 && _iterator4['return']) {
          _iterator4['return']();
        }

      case 82:
        context$1$0.prev = 82;

        if (!_didIteratorError4) {
          context$1$0.next = 85;
          break;
        }

        throw _iteratorError4;

      case 85:
        return context$1$0.finish(82);

      case 86:
        return context$1$0.finish(79);

      case 87:
        _iteratorNormalCompletion2 = true;
        context$1$0.next = 63;
        break;

      case 90:
        context$1$0.next = 96;
        break;

      case 92:
        context$1$0.prev = 92;
        context$1$0.t3 = context$1$0['catch'](61);
        _didIteratorError2 = true;
        _iteratorError2 = context$1$0.t3;

      case 96:
        context$1$0.prev = 96;
        context$1$0.prev = 97;

        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }

      case 99:
        context$1$0.prev = 99;

        if (!_didIteratorError2) {
          context$1$0.next = 102;
          break;
        }

        throw _iteratorError2;

      case 102:
        return context$1$0.finish(99);

      case 103:
        return context$1$0.finish(96);

      case 104:
        throw new _appiumBaseDriver.errors.NotYetImplementedError('Support for ' + gesturesChainToString(gestures) + ' gesture is not implemented. ' + 'Try to use "mobile: *" interface to workaround the issue. ' + ('Only these gestures are supported:\n' + availableGestures));

      case 105:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[5, 45, 49, 57], [14, 28, 32, 40], [33,, 35, 39], [50,, 52, 56], [61, 92, 96, 104], [71, 75, 79, 87], [80,, 82, 86], [97,, 99, 103]]);
};

commands.performMultiAction = function callee$0$0(actions) {
  var i;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug('Received the following multi touch action:');
        for (i in actions) {
          _logger2['default'].debug('    ' + (i + 1) + ': ' + _lodash2['default'].map(actions[i], 'action').join('-'));
        }

        if (!isPinchOrZoom(actions)) {
          context$1$0.next = 6;
          break;
        }

        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(this.handlePinchOrZoom(actions));

      case 5:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 6:
        throw new _appiumBaseDriver.errors.NotYetImplementedError('Support for this multi-action is not implemented. Try to use "mobile: *" interface to workaround the issue.');

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.nativeClick = function callee$0$0(el) {
  var endpoint;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        el = _appiumSupport.util.unwrapElement(el);
        endpoint = '/element/' + el + '/click';
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.proxyCommand(endpoint, 'POST', {}));

      case 4:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

function isScroll(gestures) {
  if (gestures.length === 3 && gestures[0].action === 'press' && gestures[1].action === 'moveTo' && gestures[2].action === 'release') {
    return true;
  }
  return false;
}

function isPinchOrZoom() {
  var actions = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  // symmetric two-finger action consisting of press-moveto-release
  if (actions.length === 2) {
    if (actions[0].length === 3 && actions[1].length === 3) {
      return _lodash2['default'].every(actions, function (gestures) {
        return isScroll(gestures);
      });
    }
  }
  return false;
}

helpers.handleScroll = function callee$0$0(gestures) {
  var dragGestures;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!gestures[1].options.element) {
          context$1$0.next = 4;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.mobileScroll({
          element: gestures[1].options.element,
          toVisible: true
        }));

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 4:
        dragGestures = [gestures[0], { action: 'wait', options: { ms: 0 } }, gestures[1], gestures[2]];
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.handleDrag(dragGestures));

      case 7:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.handleDrag = function callee$0$0(gestures) {
  var press, wait, moveTo, pressCoordinates, duration, moveToCoordinates, params, endpoint;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        press = undefined, wait = undefined, moveTo = undefined;

        if (gestures[0].action === 'longpress') {
          press = gestures[0];
          wait = { action: 'wait', options: { ms: press.options.duration } };
          moveTo = gestures[1];
        } else {
          press = gestures[0];
          wait = gestures[1];
          moveTo = gestures[2];
        }

        // get drag data
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.getCoordinates(press));

      case 4:
        pressCoordinates = context$1$0.sent;
        duration = parseInt(wait.options.ms, 10) / 1000;
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.getCoordinates(moveTo));

      case 8:
        moveToCoordinates = context$1$0.sent;

        // update moveTo coordinates with offset
        moveToCoordinates = this.applyMoveToOffset(pressCoordinates, moveToCoordinates);

        // build drag command
        params = {};

        params.fromX = pressCoordinates.x;
        params.fromY = pressCoordinates.y;
        params.toX = moveToCoordinates.x;
        params.toY = moveToCoordinates.y;
        params.duration = duration;

        endpoint = '/wda/dragfromtoforduration';
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(this.proxyCommand(endpoint, 'POST', params));

      case 19:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 20:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.handleTap = function callee$0$0(gesture) {
  var options, params, el, endpoint;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        options = gesture.options || {};
        params = {};

        if (_appiumSupport.util.hasValue(options.x) && _appiumSupport.util.hasValue(options.y)) {
          params.x = options.x;
          params.y = options.y;
        }

        el = _appiumSupport.util.hasValue(options.element) ? options.element : '0';
        endpoint = '/wda/tap/' + el;

        if (_appiumSupport.util.hasValue(this.opts.tapWithShortPressDuration)) {
          // in some cases `tap` is too slow, so allow configurable long press
          _logger2['default'].debug('Translating tap into long press with \'' + this.opts.tapWithShortPressDuration + '\' duration');
          params.duration = parseFloat(this.opts.tapWithShortPressDuration);
          endpoint = '/wda/element/' + el + '/touchAndHold';
          params.duration = parseFloat(this.opts.tapWithShortPressDuration);
        }

        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.proxyCommand(endpoint, 'POST', params));

      case 8:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.handleDoubleTap = function callee$0$0(gestures) {
  var gesture, opts, el, endpoint;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        gesture = gestures[0];
        opts = gesture.options || {};

        if (!opts.element) {
          _logger2['default'].errorAndThrow('WDA double tap needs an element');
        }

        el = _appiumSupport.util.unwrapElement(opts.element);
        endpoint = '/wda/element/' + el + '/doubleTap';
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.proxyCommand(endpoint, 'POST'));

      case 7:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.handleLongPress = function callee$0$0(gestures) {
  var pressOpts, el, duration, params, endpoint;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        pressOpts = _lodash2['default'].isPlainObject(gestures[0].options) ? gestures[0].options : {};
        el = _appiumSupport.util.unwrapElement(pressOpts.element);
        duration = undefined;
        // In seconds (not milliseconds)
        if (_appiumSupport.util.hasValue(pressOpts.duration)) {
          duration = pressOpts.duration / 1000;
        } else if (gestures.length === 3 && gestures[1].action === 'wait') {
          // duration is the `wait` action
          // upstream system expects seconds not milliseconds
          duration = parseFloat(gestures[1].options.ms) / 1000;
        } else {
          // give a sane default duration
          duration = 0.8;
        }

        params = {
          duration: duration,
          x: pressOpts.x,
          y: pressOpts.y
        };
        endpoint = undefined;

        if (el) {
          endpoint = '/wda/element/' + el + '/touchAndHold';
        } else {
          params.x = pressOpts.x;
          params.y = pressOpts.y;

          endpoint = '/wda/touchAndHold';
        }
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(this.proxyCommand(endpoint, 'POST', params));

      case 9:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

function determinePinchScale(x, y, pinch) {
  var scale = x > y ? x - y : y - x;
  if (pinch) {
    // TODO: revisit this when pinching actually works, since it is impossible to
    // know what the scale factor does at this point (Xcode 8.1)
    scale = 1 / scale;
    if (scale < 0.02) {
      // this is the minimum that Apple will allow
      // but WDA will not throw an error if it is too low
      scale = 0.02;
    }
  } else {
    // for zoom, each 10px is one scale factor
    scale = scale / 10;
  }
  return scale;
}

helpers.handlePinchOrZoom = function callee$0$0(actions) {
  var el, scale, velocity, thumb, forefinger, params;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        // currently we can only do this action on an element
        if (!actions[0][0].options.element || actions[0][0].options.element !== actions[1][0].options.element) {
          _logger2['default'].errorAndThrow('Pinch/zoom actions must be done on a single element');
        }
        el = actions[0][0].options.element;
        scale = undefined, velocity = undefined;

        if (actions[0][0].options.y === actions[0][1].options.y) {
          thumb = actions[0][0].options.x <= actions[1][0].options.x ? actions[0] : actions[1];

          // now decipher pinch vs. zoom,
          //   pinch: thumb moving from left to right
          //   zoom: thumb moving from right to left
          scale = determinePinchScale(thumb[0].options.x, thumb[1].options.x, thumb[0].options.x <= thumb[1].options.x);
        } else {
          forefinger = actions[0][0].options.y <= actions[1][0].options.y ? actions[0] : actions[1];

          // now decipher pinch vs. zoom
          //   pinch: forefinger moving from top to bottom
          //   zoom: forefinger moving from bottom to top
          scale = determinePinchScale(forefinger[0].options.y, forefinger[1].options.y, forefinger[0].options.y <= forefinger[1].options.y);
        }
        velocity = scale < 1 ? -1 : 1;

        _logger2['default'].debug('Decoded ' + (scale < 1 ? 'pinch' : 'zoom') + ' action with scale \'' + scale + '\' and velocity \'' + velocity + '\'');
        if (scale < 1) {
          _logger2['default'].warn('Pinch actions may not work, due to Apple issue.');
        }

        params = {
          scale: scale,
          velocity: velocity
        };
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/element/' + el + '/pinch', 'POST', params));

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

/*
 * See https://github.com/facebook/WebDriverAgent/blob/master/WebDriverAgentLib/Commands/FBElementCommands.m
 * to get the info about available WDA gestures API
 *
 * See https://developer.apple.com/reference/xctest/xcuielement and
 * https://developer.apple.com/reference/xctest/xcuicoordinate to get the detailed description of
 * all XCTest gestures
*/

helpers.mobileScroll = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var swipe = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
  var params, msg, element, endpoint;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (opts.element) {
          context$1$0.next = 4;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeApplication', false));

      case 3:
        opts.element = context$1$0.sent;

      case 4:
        params = {};

        if (opts.name && !swipe) {
          params.name = opts.name;
        } else if (opts.direction) {
          if (['up', 'down', 'left', 'right'].indexOf(opts.direction.toLowerCase()) < 0) {
            msg = 'Direction must be up, down, left or right';

            _logger2['default'].errorAndThrow(msg);
          }
          params.direction = opts.direction;
        } else if (opts.predicateString && !swipe) {
          params.predicateString = opts.predicateString;
        } else if (opts.toVisible && !swipe) {
          params.toVisible = opts.toVisible;
        } else {
          msg = swipe ? 'Mobile swipe requires direction' : 'Mobile scroll supports the following strategies: name, direction, predicateString, and toVisible. Specify one of these';

          _logger2['default'].errorAndThrow(msg);
        }

        element = opts.element.ELEMENT || opts.element;
        endpoint = '/wda/element/' + element + '/' + (swipe ? 'swipe' : 'scroll');
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(this.proxyCommand(endpoint, 'POST', params));

      case 10:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 11:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

function parseFloatParameter(paramName, paramValue, methodName) {
  if (_lodash2['default'].isUndefined(paramValue)) {
    _logger2['default'].errorAndThrow('"' + paramName + '" parameter is mandatory for "' + methodName + '" call');
  }
  var result = parseFloat(paramValue);
  if (isNaN(result)) {
    _logger2['default'].errorAndThrow('"' + paramName + '" parameter should be a valid number. "' + paramValue + '" is given instead');
  }
  return result;
}

helpers.mobilePinch = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var params, el;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (opts.element) {
          context$1$0.next = 4;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeApplication', false));

      case 3:
        opts.element = context$1$0.sent;

      case 4:
        params = {
          scale: parseFloatParameter('scale', opts.scale, 'pinch'),
          velocity: parseFloatParameter('velocity', opts.velocity, 'pinch')
        };
        el = opts.element.ELEMENT || opts.element;
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/element/' + el + '/pinch', 'POST', params));

      case 8:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.mobileDoubleTap = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var el, params;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!opts.element) {
          context$1$0.next = 5;
          break;
        }

        el = opts.element.ELEMENT || opts.element;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/element/' + el + '/doubleTap', 'POST'));

      case 4:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 5:
        params = {
          x: parseFloatParameter('x', opts.x, 'doubleTap'),
          y: parseFloatParameter('y', opts.y, 'doubleTap')
        };
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/doubleTap', 'POST', params));

      case 8:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.mobileTwoFingerTap = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var el;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (opts.element) {
          context$1$0.next = 4;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeApplication', false));

      case 3:
        opts.element = context$1$0.sent;

      case 4:
        el = opts.element.ELEMENT || opts.element;
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/element/' + el + '/twoFingerTap', 'POST'));

      case 7:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.mobileTouchAndHold = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var params, el;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        params = {
          duration: parseFloatParameter('duration', opts.duration, 'touchAndHold')
        };

        if (!opts.element) {
          context$1$0.next = 6;
          break;
        }

        el = opts.element.ELEMENT || opts.element;
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/element/' + el + '/touchAndHold', 'POST', params));

      case 5:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 6:
        // Long tap coordinates
        params.x = parseFloatParameter('x', opts.x, 'touchAndHold');
        params.y = parseFloatParameter('y', opts.y, 'touchAndHold');
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/touchAndHold', 'POST', params));

      case 10:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 11:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.mobileTap = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var params, el;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        params = {
          x: parseFloatParameter('x', opts.x, 'tap'),
          y: parseFloatParameter('y', opts.y, 'tap')
        };
        el = opts.element ? opts.element.ELEMENT || opts.element : '0';
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/tap/' + el, 'POST', params));

      case 4:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.mobileDragFromToForDuration = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var params, el;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        params = {
          duration: parseFloatParameter('duration', opts.duration, 'dragFromToForDuration'),
          fromX: parseFloatParameter('fromX', opts.fromX, 'dragFromToForDuration'),
          fromY: parseFloatParameter('fromY', opts.fromY, 'dragFromToForDuration'),
          toX: parseFloatParameter('toX', opts.toX, 'dragFromToForDuration'),
          toY: parseFloatParameter('toY', opts.toY, 'dragFromToForDuration')
        };

        if (!opts.element) {
          context$1$0.next = 6;
          break;
        }

        el = opts.element.ELEMENT || opts.element;
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/element/' + el + '/dragfromtoforduration', 'POST', params));

      case 5:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/dragfromtoforduration', 'POST', params));

      case 8:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.mobileSelectPickerWheelValue = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var el, params;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!opts.element) {
          _logger2['default'].errorAndThrow('Element id is expected to be set for selectPickerWheelValue method');
        }
        if (!_lodash2['default'].isString(opts.order) || ['next', 'previous'].indexOf(opts.order.toLowerCase()) === -1) {
          _logger2['default'].errorAndThrow('The mandatory "order" parameter is expected to be equal either to \'next\' or \'previous\'. ' + ('\'' + opts.order + '\' is given instead'));
        }
        el = opts.element.ELEMENT || opts.element;
        params = { order: opts.order };

        if (opts.offset) {
          params.offset = parseFloatParameter('offset', opts.offset, 'selectPickerWheelValue');
        }
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/pickerwheel/' + el + '/select', 'POST', params));

      case 7:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getCoordinates = function callee$0$0(gesture) {
  var el, coordinates, optionX, optionY, rect, pos, size, offsetX, offsetY;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        el = gesture.options.element;
        coordinates = { x: 0, y: 0, areOffsets: false };
        optionX = null;

        if (gesture.options.x) {
          optionX = parseFloatParameter('x', gesture.options.x, 'getCoordinates');
        }
        optionY = null;

        if (gesture.options.y) {
          optionY = parseFloatParameter('y', gesture.options.y, 'getCoordinates');
        }

        // figure out the element coordinates.

        if (!el) {
          context$1$0.next = 19;
          break;
        }

        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(this.getRect(el));

      case 9:
        rect = context$1$0.sent;
        pos = { x: rect.x, y: rect.y };
        size = { w: rect.width, h: rect.height };
        offsetX = 0;
        offsetY = 0;

        // get the real offsets
        if (optionX || optionY) {
          offsetX = optionX || 0;
          offsetY = optionY || 0;
        } else {
          offsetX = size.w / 2;
          offsetY = size.h / 2;
        }

        // apply the offsets
        coordinates.x = pos.x + offsetX;
        coordinates.y = pos.y + offsetY;
        context$1$0.next = 22;
        break;

      case 19:
        // moveTo coordinates are passed in as offsets
        coordinates.areOffsets = gesture.action === 'moveTo';
        coordinates.x = optionX || 0;
        coordinates.y = optionY || 0;

      case 22:
        return context$1$0.abrupt('return', coordinates);

      case 23:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.applyMoveToOffset = function (firstCoordinates, secondCoordinates) {
  if (secondCoordinates.areOffsets) {
    return {
      x: firstCoordinates.x + secondCoordinates.x,
      y: firstCoordinates.y + secondCoordinates.y
    };
  } else {
    return secondCoordinates;
  }
};

_Object$assign(extensions, helpers, commands);
exports.extensions = extensions;
exports.helpers = helpers;
exports.commands = commands;
exports.isSameGestures = isSameGestures;
exports.gesturesChainToString = gesturesChainToString;
exports['default'] = extensions;

// there are multiple commands that map here, so manually proxy

// use the to-visible option of scrolling in WDA

// otherwise, for now, just translate into a drag with short duration

// assume that action is in a single plane (x or y, not horizontal at all)
// terminology all assuming right handedness

// horizontal, since y offset is the same in press and moveTo

// vertical

// WDA supports four scrolling strategies: predication based on name, direction,
// predicateString, and toVisible, in that order. Swiping requires direction.

// Double tap element

// Double tap coordinates

// Long tap element

// Drag element

// Drag coordinates

// defaults

// defaults
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9nZXN0dXJlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Z0NBQXVCLG9CQUFvQjs7NkJBQ3RCLGdCQUFnQjs7K0JBQ1QsbUJBQW1COztzQkFDakMsUUFBUTs7OztzQkFDTixXQUFXOzs7O0FBRzNCLElBQUksT0FBTyxHQUFHLEVBQUU7SUFBRSxVQUFVLEdBQUcsRUFBRTtJQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRWpELFFBQVEsQ0FBQyxNQUFNLEdBQUcsNkJBQVksT0FBTyxDQUFDLE1BQU0sQ0FBQzs7QUFFN0MsUUFBUSxDQUFDLFdBQVcsR0FBRzs7OztZQUNoQixJQUFJLENBQUMsV0FBVyxFQUFFOzs7OztjQUNmLElBQUkseUJBQU8sWUFBWSxDQUFDLHdDQUF3QyxDQUFDOzs7O3lDQUVuRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Ozs7Ozs7Q0FDL0IsQ0FBQzs7QUFFRixRQUFRLENBQUMsS0FBSyxHQUFHLG9CQUFnQixFQUFFO01BVzNCLFlBQVk7Ozs7WUFWYixJQUFJLENBQUMsWUFBWSxFQUFFOzs7Ozs7eUNBRVQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7Ozs7OztBQUVuQyxVQUFFLEdBQUcsb0JBQUssYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzthQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLFlBQVk7Ozs7OztBQUUxQyw0QkFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7eUNBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDOzs7Ozs7O0FBRXZCLG9CQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUM7O3lDQUM5QixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDOzs7Ozs7Ozs7O0NBRXpELENBQUM7O0FBRUYsU0FBUyxjQUFjLENB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LE9BQU8sQ0FBQyxNQUFNLEtBQUssUUFBUSxBQUFDLENBQUM7QUFDdkQsbUJBQVcsQ0FBQyxDQUFDLEdBQUksT0FBTyxJQUFJLENBQUMsQUFBQyxDQUFDO0FBQy9CLG1CQUFXLENBQUMsQ0FBQyxHQUFJLE9BQU8sSUFBSSxDQUFDLEFBQUMsQ0FBQzs7OzRDQUUxQixXQUFXOzs7Ozs7O0NBQ25CLENBQUM7O0FBRUYsT0FBTyxDQUFDLGlCQUFpQixHQUFHLFVBQVUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUU7QUFDekUsTUFBSSxpQkFBaUIsQ0FBQyxVQUFVLEVBQUU7QUFDaEMsV0FBTztBQUNMLE9BQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztBQUMzQyxPQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUM7S0FDNUMsQ0FBQztHQUNILE1BQU07QUFDTCxXQUFPLGlCQUFpQixDQUFDO0dBQzFCO0NBQ0YsQ0FBQzs7QUFFRixlQUFjLFVBQVUsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDcEMsVUFBVSxHQUFWLFVBQVU7UUFBRSxPQUFPLEdBQVAsT0FBTztRQUFFLFFBQVEsR0FBUixRQUFRO1FBQUUsY0FBYyxHQUFkLGNBQWM7UUFBRSxxQkFBcUIsR0FBckIscUJBQXFCO3FCQUM5RCxVQUFVIiwiZmlsZSI6ImxpYi9jb21tYW5kcy9nZXN0dXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXJyb3JzIH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcbmltcG9ydCB7IHV0aWwgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5pbXBvcnQgeyBpb3NDb21tYW5kcyB9IGZyb20gJ2FwcGl1bS1pb3MtZHJpdmVyJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbG9nIGZyb20gJy4uL2xvZ2dlcic7XG5cblxubGV0IGhlbHBlcnMgPSB7fSwgZXh0ZW5zaW9ucyA9IHt9LCBjb21tYW5kcyA9IHt9O1xuXG5jb21tYW5kcy5tb3ZlVG8gPSBpb3NDb21tYW5kcy5nZXN0dXJlLm1vdmVUbztcblxuY29tbWFuZHMubW9iaWxlU2hha2UgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGlmICghdGhpcy5pc1NpbXVsYXRvcigpKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5Vbmtub3duRXJyb3IoJ1NoYWtlIGlzIG5vdCBzdXBwb3J0ZWQgb24gcmVhbCBkZXZpY2VzJyk7XG4gIH1cbiAgYXdhaXQgdGhpcy5vcHRzLmRldmljZS5zaGFrZSgpO1xufTtcblxuY29tbWFuZHMuY2xpY2sgPSBhc3luYyBmdW5jdGlvbiAoZWwpIHtcbiAgaWYgKCF0aGlzLmlzV2ViQ29udGV4dCgpKSB7XG4gICAgLy8gdGhlcmUgYXJlIG11bHRpcGxlIGNvbW1hbmRzIHRoYXQgbWFwIGhlcmUsIHNvIG1hbnVhbGx5IHByb3h5XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMubmF0aXZlQ2xpY2soZWwpO1xuICB9XG4gIGVsID0gdXRpbC51bndyYXBFbGVtZW50KGVsKTtcbiAgaWYgKHRoaXMuc2V0dGluZ3MuZ2V0U2V0dGluZ3MoKS5uYXRpdmVXZWJUYXApIHtcbiAgICAvLyBhdG9tcy1iYXNlZCBjbGlja3MgZG9uJ3QgYWx3YXlzIHdvcmsgaW4gc2FmYXJpIDdcbiAgICBsb2cuZGVidWcoJ1VzaW5nIG5hdGl2ZSB3ZWIgdGFwJyk7XG4gICAgYXdhaXQgdGhpcy5uYXRpdmVXZWJUYXAoZWwpO1xuICB9IGVsc2Uge1xuICAgIGxldCBhdG9tc0VsZW1lbnQgPSB0aGlzLnVzZUF0b21zRWxlbWVudChlbCk7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZUF0b20oJ2NsaWNrJywgW2F0b21zRWxlbWVudF0pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBpc1NhbWVHZXN0dXJlcyAoZ2VzdHVyZXMsIGNhbmRpZGF0ZXMpIHtcbiAgdHJ5IHtcbiAgICBpZiAoZ2VzdHVyZXMubGVuZ3RoICE9PSBjYW5kaWRhdGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdlc3R1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBnZXN0dXJlT2JqID0gZ2VzdHVyZXNbaV07XG4gICAgICBjb25zdCBjYW5kaWRhdGVPYmogPSBjYW5kaWRhdGVzW2ldO1xuICAgICAgaWYgKCFfLmlzUGxhaW5PYmplY3QoZ2VzdHVyZU9iaikgfHwgIV8uaXNQbGFpbk9iamVjdChjYW5kaWRhdGVPYmopKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChfLmRpZmZlcmVuY2UoXy5rZXlzKGNhbmRpZGF0ZU9iaiksIF8ua2V5cyhnZXN0dXJlT2JqKSkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChnZXN0dXJlT2JqLmFjdGlvbi50b0xvd2VyQ2FzZSgpICE9PSBjYW5kaWRhdGVPYmouYWN0aW9uLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGNhbmRpZGF0ZU9iai5vcHRpb25zICYmIGdlc3R1cmVPYmoub3B0aW9ucy5jb3VudCAhPT0gY2FuZGlkYXRlT2JqLm9wdGlvbnMuY291bnQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nLmRlYnVnKGBFcnJvciBcIiR7ZXJyLm1lc3NhZ2V9XCIgd2hpbGUgY29tcGFyaW5nIGdlc3R1cmVzLiBDb25zaWRlcmluZyB0aGVtIGFzIG5vdCBlcXVhbGApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZ2VzdHVyZXNDaGFpblRvU3RyaW5nIChnZXN0dXJlcywga2V5c1RvSW5jbHVkZSA9IFsnb3B0aW9ucyddKSB7XG4gIHJldHVybiBnZXN0dXJlcy5tYXAoKGl0ZW0pID0+IHtcbiAgICBsZXQgb3RoZXJLZXlzID0gXy5kaWZmZXJlbmNlKF8ua2V5cyhpdGVtKSwgWydhY3Rpb24nXSk7XG4gICAgb3RoZXJLZXlzID0gXy5pc0FycmF5KGtleXNUb0luY2x1ZGUpID8gXy5pbnRlcnNlY3Rpb24ob3RoZXJLZXlzLCBrZXlzVG9JbmNsdWRlKSA6IG90aGVyS2V5cztcbiAgICBpZiAob3RoZXJLZXlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGAke2l0ZW0uYWN0aW9ufWAgK1xuICAgICAgICBgKCR7Xy5tYXAob3RoZXJLZXlzLCAoeCkgPT4geCArICc9JyArIChfLmlzUGxhaW5PYmplY3QoaXRlbVt4XSkgPyBKU09OLnN0cmluZ2lmeShpdGVtW3hdKSA6IGl0ZW1beF0pKS5qb2luKCcsICcpfSlgO1xuICAgIH1cbiAgICByZXR1cm4gaXRlbS5hY3Rpb247XG4gIH0pLmpvaW4oJy0nKTtcbn1cblxuY29tbWFuZHMucGVyZm9ybVRvdWNoID0gYXN5bmMgZnVuY3Rpb24gKGdlc3R1cmVzKSB7XG4gIGxvZy5kZWJ1ZyhgUmVjZWl2ZWQgdGhlIGZvbGxvd2luZyB0b3VjaCBhY3Rpb246ICR7Z2VzdHVyZXNDaGFpblRvU3RyaW5nKGdlc3R1cmVzKX1gKTtcblxuICBjb25zdCBzdXBwb3J0ZWRHZXN0dXJlc01hcHBpbmcgPSB7XG4gICAgZG91YmxlVGFwOiB7XG4gICAgICBoYW5kbGVyOiBhc3luYyAoeCkgPT4ge2F3YWl0IHRoaXMuaGFuZGxlRG91YmxlVGFwKHgpO30sXG4gICAgICBtYXRjaGVzOiBbXG4gICAgICAgIFt7YWN0aW9uOiAnZG91YmxldGFwJ31dLFxuICAgICAgICBbe2FjdGlvbjogJ3RhcCcsIG9wdGlvbnM6IHtjb3VudDogMn19XVxuICAgICAgXVxuICAgIH0sXG4gICAgdGFwOiB7XG4gICAgICBoYW5kbGVyOiBhc3luYyAoeCkgPT4ge2F3YWl0IHRoaXMuaGFuZGxlVGFwKHhbMF0pO30sXG4gICAgICBtYXRjaGVzOiBbXG4gICAgICAgIFt7YWN0aW9uOiAndGFwJ31dLFxuICAgICAgICBbe2FjdGlvbjogJ3RhcCd9LCB7YWN0aW9uOiAncmVsZWFzZSd9XSxcbiAgICAgICAgW3thY3Rpb246ICdwcmVzcyd9LCB7YWN0aW9uOiAncmVsZWFzZSd9XVxuICAgICAgXVxuICAgIH0sXG4gICAgbG9uZ1ByZXNzOiB7XG4gICAgICBoYW5kbGVyOiBhc3luYyAoeCkgPT4ge2F3YWl0IHRoaXMuaGFuZGxlTG9uZ1ByZXNzKHgpO30sXG4gICAgICBtYXRjaGVzOiBbXG4gICAgICAgIFt7YWN0aW9uOiAnbG9uZ3ByZXNzJ31dLFxuICAgICAgICBbe2FjdGlvbjogJ2xvbmdwcmVzcyd9LCB7YWN0aW9uOiAncmVsZWFzZSd9XSxcbiAgICAgICAgW3thY3Rpb246ICdwcmVzcyd9LCB7YWN0aW9uOiAnd2FpdCd9LCB7YWN0aW9uOiAncmVsZWFzZSd9XVxuICAgICAgXVxuICAgIH0sXG4gICAgZHJhZzoge1xuICAgICAgaGFuZGxlcjogYXN5bmMgKHgpID0+IHthd2FpdCB0aGlzLmhhbmRsZURyYWcoeCk7fSxcbiAgICAgIG1hdGNoZXM6IFtcbiAgICAgICAgW3thY3Rpb246ICdwcmVzcyd9LCB7YWN0aW9uOiAnd2FpdCd9LCB7YWN0aW9uOiAnbW92ZVRvJ30sIHthY3Rpb246ICdyZWxlYXNlJ31dLFxuICAgICAgICBbe2FjdGlvbjogJ2xvbmdwcmVzcyd9LCB7YWN0aW9uOiAnbW92ZVRvJ30sIHthY3Rpb246ICdyZWxlYXNlJ31dXG4gICAgICBdXG4gICAgfSxcbiAgICBzY3JvbGw6IHtcbiAgICAgIGhhbmRsZXI6IGFzeW5jICh4KSA9PiB7YXdhaXQgdGhpcy5oYW5kbGVTY3JvbGwoeCk7fSxcbiAgICAgIG1hdGNoZXM6IFtcbiAgICAgICAgW3thY3Rpb246ICdwcmVzcyd9LCB7YWN0aW9uOiAnbW92ZVRvJ30sIHthY3Rpb246ICdyZWxlYXNlJ31dXG4gICAgICBdXG4gICAgfVxuICB9O1xuICBmb3IgKGxldCBbY21kLCBpbmZvXSBvZiBfLnRvUGFpcnMoc3VwcG9ydGVkR2VzdHVyZXNNYXBwaW5nKSkge1xuICAgIGZvciAobGV0IGNhbmRpZGF0ZU1hdGNoIG9mIGluZm8ubWF0Y2hlcykge1xuICAgICAgaWYgKGlzU2FtZUdlc3R1cmVzKGdlc3R1cmVzLCBjYW5kaWRhdGVNYXRjaCkpIHtcbiAgICAgICAgbG9nLmRlYnVnKGBGb3VuZCBtYXRjaGluZyBnZXN0dXJlOiAke2NtZH1gKTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGluZm8uaGFuZGxlcihnZXN0dXJlcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbGV0IGF2YWlsYWJsZUdlc3R1cmVzID0gJyc7XG4gIGZvciAobGV0IFtjbWQsIGluZm9dIG9mIF8udG9QYWlycyhzdXBwb3J0ZWRHZXN0dXJlc01hcHBpbmcpKSB7XG4gICAgYXZhaWxhYmxlR2VzdHVyZXMgKz0gYFxcdCR7Y21kfTogYDtcbiAgICBmb3IgKGxldCBjYW5kaWRhdGVNYXRjaCBvZiBpbmZvLm1hdGNoZXMpIHtcbiAgICAgIGF2YWlsYWJsZUdlc3R1cmVzICs9IGBcXHRcXHQke2dlc3R1cmVzQ2hhaW5Ub1N0cmluZyhjYW5kaWRhdGVNYXRjaCl9XFxuYDtcbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IGVycm9ycy5Ob3RZZXRJbXBsZW1lbnRlZEVycm9yKGBTdXBwb3J0IGZvciAke2dlc3R1cmVzQ2hhaW5Ub1N0cmluZyhnZXN0dXJlcyl9IGdlc3R1cmUgaXMgbm90IGltcGxlbWVudGVkLiBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBUcnkgdG8gdXNlIFwibW9iaWxlOiAqXCIgaW50ZXJmYWNlIHRvIHdvcmthcm91bmQgdGhlIGlzc3VlLiBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBPbmx5IHRoZXNlIGdlc3R1cmVzIGFyZSBzdXBwb3J0ZWQ6XFxuJHthdmFpbGFibGVHZXN0dXJlc31gKTtcbn07XG5cbmNvbW1hbmRzLnBlcmZvcm1NdWx0aUFjdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChhY3Rpb25zKSB7XG4gIGxvZy5kZWJ1ZyhgUmVjZWl2ZWQgdGhlIGZvbGxvd2luZyBtdWx0aSB0b3VjaCBhY3Rpb246YCk7XG4gIGZvciAobGV0IGkgaW4gYWN0aW9ucykge1xuICAgIGxvZy5kZWJ1ZyhgICAgICR7aSsxfTogJHtfLm1hcChhY3Rpb25zW2ldLCAnYWN0aW9uJykuam9pbignLScpfWApO1xuICB9XG5cbiAgaWYgKGlzUGluY2hPclpvb20oYWN0aW9ucykpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5oYW5kbGVQaW5jaE9yWm9vbShhY3Rpb25zKTtcbiAgfVxuICB0aHJvdyBuZXcgZXJyb3JzLk5vdFlldEltcGxlbWVudGVkRXJyb3IoJ1N1cHBvcnQgZm9yIHRoaXMgbXVsdGktYWN0aW9uIGlzIG5vdCBpbXBsZW1lbnRlZC4gVHJ5IHRvIHVzZSBcIm1vYmlsZTogKlwiIGludGVyZmFjZSB0byB3b3JrYXJvdW5kIHRoZSBpc3N1ZS4nKTtcbn07XG5cbmNvbW1hbmRzLm5hdGl2ZUNsaWNrID0gYXN5bmMgZnVuY3Rpb24gKGVsKSB7XG4gIGVsID0gdXRpbC51bndyYXBFbGVtZW50KGVsKTtcbiAgbGV0IGVuZHBvaW50ID0gYC9lbGVtZW50LyR7ZWx9L2NsaWNrYDtcbiAgcmV0dXJuIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGVuZHBvaW50LCAnUE9TVCcsIHt9KTtcbn07XG5cbmZ1bmN0aW9uIGlzU2Nyb2xsIChnZXN0dXJlcykge1xuICBpZiAoZ2VzdHVyZXMubGVuZ3RoID09PSAzICYmXG4gICAgICAgIGdlc3R1cmVzWzBdLmFjdGlvbiA9PT0gJ3ByZXNzJyAmJlxuICAgICAgICBnZXN0dXJlc1sxXS5hY3Rpb24gPT09ICdtb3ZlVG8nICYmXG4gICAgICAgIGdlc3R1cmVzWzJdLmFjdGlvbiA9PT0gJ3JlbGVhc2UnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1BpbmNoT3Jab29tIChhY3Rpb25zID0gW10pIHtcbiAgLy8gc3ltbWV0cmljIHR3by1maW5nZXIgYWN0aW9uIGNvbnNpc3Rpbmcgb2YgcHJlc3MtbW92ZXRvLXJlbGVhc2VcbiAgaWYgKGFjdGlvbnMubGVuZ3RoID09PSAyKSB7XG4gICAgaWYgKGFjdGlvbnNbMF0ubGVuZ3RoID09PSAzICYmIGFjdGlvbnNbMV0ubGVuZ3RoID09PSAzKSB7XG4gICAgICByZXR1cm4gXy5ldmVyeShhY3Rpb25zLCAoZ2VzdHVyZXMpID0+IGlzU2Nyb2xsKGdlc3R1cmVzKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuaGVscGVycy5oYW5kbGVTY3JvbGwgPSBhc3luYyBmdW5jdGlvbiAoZ2VzdHVyZXMpIHtcbiAgaWYgKGdlc3R1cmVzWzFdLm9wdGlvbnMuZWxlbWVudCkge1xuICAgIC8vIHVzZSB0aGUgdG8tdmlzaWJsZSBvcHRpb24gb2Ygc2Nyb2xsaW5nIGluIFdEQVxuICAgIHJldHVybiBhd2FpdCB0aGlzLm1vYmlsZVNjcm9sbCh7XG4gICAgICBlbGVtZW50OiBnZXN0dXJlc1sxXS5vcHRpb25zLmVsZW1lbnQsXG4gICAgICB0b1Zpc2libGU6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIC8vIG90aGVyd2lzZSwgZm9yIG5vdywganVzdCB0cmFuc2xhdGUgaW50byBhIGRyYWcgd2l0aCBzaG9ydCBkdXJhdGlvblxuICBsZXQgZHJhZ0dlc3R1cmVzID0gW1xuICAgIGdlc3R1cmVzWzBdLFxuICAgIHthY3Rpb246ICd3YWl0Jywgb3B0aW9uczoge21zOiAwfX0sXG4gICAgZ2VzdHVyZXNbMV0sXG4gICAgZ2VzdHVyZXNbMl1cbiAgXTtcbiAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlRHJhZyhkcmFnR2VzdHVyZXMpO1xufTtcblxuaGVscGVycy5oYW5kbGVEcmFnID0gYXN5bmMgZnVuY3Rpb24gKGdlc3R1cmVzKSB7XG4gIGxldCBwcmVzcywgd2FpdCwgbW92ZVRvO1xuICBpZiAoZ2VzdHVyZXNbMF0uYWN0aW9uID09PSAnbG9uZ3ByZXNzJykge1xuICAgIHByZXNzID0gZ2VzdHVyZXNbMF07XG4gICAgd2FpdCA9IHthY3Rpb246ICd3YWl0Jywgb3B0aW9uczoge21zOiBwcmVzcy5vcHRpb25zLmR1cmF0aW9ufX07XG4gICAgbW92ZVRvID0gZ2VzdHVyZXNbMV07XG4gIH0gZWxzZSB7XG4gICAgcHJlc3MgPSBnZXN0dXJlc1swXTtcbiAgICB3YWl0ID0gZ2VzdHVyZXNbMV07XG4gICAgbW92ZVRvID0gZ2VzdHVyZXNbMl07XG4gIH1cblxuICAvLyBnZXQgZHJhZyBkYXRhXG4gIGxldCBwcmVzc0Nvb3JkaW5hdGVzID0gYXdhaXQgdGhpcy5nZXRDb29yZGluYXRlcyhwcmVzcyk7XG4gIGxldCBkdXJhdGlvbiA9IChwYXJzZUludCh3YWl0Lm9wdGlvbnMubXMsIDEwKSAvIDEwMDApO1xuICBsZXQgbW92ZVRvQ29vcmRpbmF0ZXMgPSBhd2FpdCB0aGlzLmdldENvb3JkaW5hdGVzKG1vdmVUbyk7XG5cbiAgLy8gdXBkYXRlIG1vdmVUbyBjb29yZGluYXRlcyB3aXRoIG9mZnNldFxuICBtb3ZlVG9Db29yZGluYXRlcyA9IHRoaXMuYXBwbHlNb3ZlVG9PZmZzZXQocHJlc3NDb29yZGluYXRlcywgbW92ZVRvQ29vcmRpbmF0ZXMpO1xuXG4gIC8vIGJ1aWxkIGRyYWcgY29tbWFuZFxuICBsZXQgcGFyYW1zID0ge307XG4gIHBhcmFtcy5mcm9tWCA9IHByZXNzQ29vcmRpbmF0ZXMueDtcbiAgcGFyYW1zLmZyb21ZID0gcHJlc3NDb29yZGluYXRlcy55O1xuICBwYXJhbXMudG9YID0gbW92ZVRvQ29vcmRpbmF0ZXMueDtcbiAgcGFyYW1zLnRvWSA9IG1vdmVUb0Nvb3JkaW5hdGVzLnk7XG4gIHBhcmFtcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuXG4gIGxldCBlbmRwb2ludCA9IGAvd2RhL2RyYWdmcm9tdG9mb3JkdXJhdGlvbmA7XG4gIHJldHVybiBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZChlbmRwb2ludCwgJ1BPU1QnLCBwYXJhbXMpO1xufTtcblxuaGVscGVycy5oYW5kbGVUYXAgPSBhc3luYyBmdW5jdGlvbiAoZ2VzdHVyZSkge1xuICBsZXQgb3B0aW9ucyA9IGdlc3R1cmUub3B0aW9ucyB8fCB7fTtcblxuICBsZXQgcGFyYW1zID0ge307XG4gIGlmICh1dGlsLmhhc1ZhbHVlKG9wdGlvbnMueCkgJiYgdXRpbC5oYXNWYWx1ZShvcHRpb25zLnkpKSB7XG4gICAgcGFyYW1zLnggPSBvcHRpb25zLng7XG4gICAgcGFyYW1zLnkgPSBvcHRpb25zLnk7XG4gIH1cblxuICBsZXQgZWwgPSB1dGlsLmhhc1ZhbHVlKG9wdGlvbnMuZWxlbWVudCkgPyBvcHRpb25zLmVsZW1lbnQgOiAnMCc7XG4gIGxldCBlbmRwb2ludCA9IGAvd2RhL3RhcC8ke2VsfWA7XG5cbiAgaWYgKHV0aWwuaGFzVmFsdWUodGhpcy5vcHRzLnRhcFdpdGhTaG9ydFByZXNzRHVyYXRpb24pKSB7XG4gICAgLy8gaW4gc29tZSBjYXNlcyBgdGFwYCBpcyB0b28gc2xvdywgc28gYWxsb3cgY29uZmlndXJhYmxlIGxvbmcgcHJlc3NcbiAgICBsb2cuZGVidWcoYFRyYW5zbGF0aW5nIHRhcCBpbnRvIGxvbmcgcHJlc3Mgd2l0aCAnJHt0aGlzLm9wdHMudGFwV2l0aFNob3J0UHJlc3NEdXJhdGlvbn0nIGR1cmF0aW9uYCk7XG4gICAgcGFyYW1zLmR1cmF0aW9uID0gcGFyc2VGbG9hdCh0aGlzLm9wdHMudGFwV2l0aFNob3J0UHJlc3NEdXJhdGlvbik7XG4gICAgZW5kcG9pbnQgPSBgL3dkYS9lbGVtZW50LyR7ZWx9L3RvdWNoQW5kSG9sZGA7XG4gICAgcGFyYW1zLmR1cmF0aW9uID0gcGFyc2VGbG9hdCh0aGlzLm9wdHMudGFwV2l0aFNob3J0UHJlc3NEdXJhdGlvbik7XG4gIH1cblxuICByZXR1cm4gYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoZW5kcG9pbnQsICdQT1NUJywgcGFyYW1zKTtcbn07XG5cbmhlbHBlcnMuaGFuZGxlRG91YmxlVGFwID0gYXN5bmMgZnVuY3Rpb24gKGdlc3R1cmVzKSB7XG4gIGxldCBnZXN0dXJlID0gZ2VzdHVyZXNbMF07XG4gIGxldCBvcHRzID0gZ2VzdHVyZS5vcHRpb25zIHx8IHt9O1xuXG4gIGlmICghb3B0cy5lbGVtZW50KSB7XG4gICAgbG9nLmVycm9yQW5kVGhyb3coJ1dEQSBkb3VibGUgdGFwIG5lZWRzIGFuIGVsZW1lbnQnKTtcbiAgfVxuXG4gIGxldCBlbCA9IHV0aWwudW53cmFwRWxlbWVudChvcHRzLmVsZW1lbnQpO1xuICBsZXQgZW5kcG9pbnQgPSBgL3dkYS9lbGVtZW50LyR7ZWx9L2RvdWJsZVRhcGA7XG5cbiAgcmV0dXJuIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGVuZHBvaW50LCAnUE9TVCcpO1xufTtcblxuaGVscGVycy5oYW5kbGVMb25nUHJlc3MgPSBhc3luYyBmdW5jdGlvbiAoZ2VzdHVyZXMpIHtcbiAgbGV0IHByZXNzT3B0cyA9IF8uaXNQbGFpbk9iamVjdChnZXN0dXJlc1swXS5vcHRpb25zKSA/IGdlc3R1cmVzWzBdLm9wdGlvbnMgOiB7fTtcblxuICBsZXQgZWwgPSB1dGlsLnVud3JhcEVsZW1lbnQocHJlc3NPcHRzLmVsZW1lbnQpO1xuICBsZXQgZHVyYXRpb247IC8vIEluIHNlY29uZHMgKG5vdCBtaWxsaXNlY29uZHMpXG4gIGlmICh1dGlsLmhhc1ZhbHVlKHByZXNzT3B0cy5kdXJhdGlvbikpIHtcbiAgICBkdXJhdGlvbiA9IHByZXNzT3B0cy5kdXJhdGlvbiAvIDEwMDA7XG4gIH0gZWxzZSBpZiAoZ2VzdHVyZXMubGVuZ3RoID09PSAzICYmIGdlc3R1cmVzWzFdLmFjdGlvbiA9PT0gJ3dhaXQnKSB7XG4gICAgLy8gZHVyYXRpb24gaXMgdGhlIGB3YWl0YCBhY3Rpb25cbiAgICAvLyB1cHN0cmVhbSBzeXN0ZW0gZXhwZWN0cyBzZWNvbmRzIG5vdCBtaWxsaXNlY29uZHNcbiAgICBkdXJhdGlvbiA9IHBhcnNlRmxvYXQoZ2VzdHVyZXNbMV0ub3B0aW9ucy5tcykgLyAxMDAwO1xuICB9IGVsc2Uge1xuICAgIC8vIGdpdmUgYSBzYW5lIGRlZmF1bHQgZHVyYXRpb25cbiAgICBkdXJhdGlvbiA9IDAuODtcbiAgfVxuXG4gIGxldCBwYXJhbXMgPSB7XG4gICAgZHVyYXRpb24sXG4gICAgeDogcHJlc3NPcHRzLngsXG4gICAgeTogcHJlc3NPcHRzLnksXG4gIH07XG5cbiAgbGV0IGVuZHBvaW50O1xuICBpZiAoZWwpIHtcbiAgICBlbmRwb2ludCA9IGAvd2RhL2VsZW1lbnQvJHtlbH0vdG91Y2hBbmRIb2xkYDtcbiAgfSBlbHNlIHtcbiAgICBwYXJhbXMueCA9IHByZXNzT3B0cy54O1xuICAgIHBhcmFtcy55ID0gcHJlc3NPcHRzLnk7XG5cbiAgICBlbmRwb2ludCA9ICcvd2RhL3RvdWNoQW5kSG9sZCc7XG4gIH1cbiAgcmV0dXJuIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGVuZHBvaW50LCAnUE9TVCcsIHBhcmFtcyk7XG59O1xuXG5mdW5jdGlvbiBkZXRlcm1pbmVQaW5jaFNjYWxlICh4LCB5LCBwaW5jaCkge1xuICBsZXQgc2NhbGUgPSB4ID4geSA/IHggLSB5IDogeSAtIHg7XG4gIGlmIChwaW5jaCkge1xuICAgIC8vIFRPRE86IHJldmlzaXQgdGhpcyB3aGVuIHBpbmNoaW5nIGFjdHVhbGx5IHdvcmtzLCBzaW5jZSBpdCBpcyBpbXBvc3NpYmxlIHRvXG4gICAgLy8ga25vdyB3aGF0IHRoZSBzY2FsZSBmYWN0b3IgZG9lcyBhdCB0aGlzIHBvaW50IChYY29kZSA4LjEpXG4gICAgc2NhbGUgPSAxIC8gc2NhbGU7XG4gICAgaWYgKHNjYWxlIDwgMC4wMikge1xuICAgICAgLy8gdGhpcyBpcyB0aGUgbWluaW11bSB0aGF0IEFwcGxlIHdpbGwgYWxsb3dcbiAgICAgIC8vIGJ1dCBXREEgd2lsbCBub3QgdGhyb3cgYW4gZXJyb3IgaWYgaXQgaXMgdG9vIGxvd1xuICAgICAgc2NhbGUgPSAwLjAyO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBmb3Igem9vbSwgZWFjaCAxMHB4IGlzIG9uZSBzY2FsZSBmYWN0b3JcbiAgICBzY2FsZSA9IHNjYWxlIC8gMTA7XG4gIH1cbiAgcmV0dXJuIHNjYWxlO1xufVxuXG5oZWxwZXJzLmhhbmRsZVBpbmNoT3Jab29tID0gYXN5bmMgZnVuY3Rpb24gKGFjdGlvbnMpIHtcbiAgLy8gY3VycmVudGx5IHdlIGNhbiBvbmx5IGRvIHRoaXMgYWN0aW9uIG9uIGFuIGVsZW1lbnRcbiAgaWYgKCFhY3Rpb25zWzBdWzBdLm9wdGlvbnMuZWxlbWVudCB8fFxuICAgICAgYWN0aW9uc1swXVswXS5vcHRpb25zLmVsZW1lbnQgIT09IGFjdGlvbnNbMV1bMF0ub3B0aW9ucy5lbGVtZW50KSB7XG4gICAgbG9nLmVycm9yQW5kVGhyb3coJ1BpbmNoL3pvb20gYWN0aW9ucyBtdXN0IGJlIGRvbmUgb24gYSBzaW5nbGUgZWxlbWVudCcpO1xuICB9XG4gIGxldCBlbCA9IGFjdGlvbnNbMF1bMF0ub3B0aW9ucy5lbGVtZW50O1xuXG4gIC8vIGFzc3VtZSB0aGF0IGFjdGlvbiBpcyBpbiBhIHNpbmdsZSBwbGFuZSAoeCBvciB5LCBub3QgaG9yaXpvbnRhbCBhdCBhbGwpXG4gIC8vIHRlcm1pbm9sb2d5IGFsbCBhc3N1bWluZyByaWdodCBoYW5kZWRuZXNzXG4gIGxldCBzY2FsZSwgdmVsb2NpdHk7XG4gIGlmIChhY3Rpb25zWzBdWzBdLm9wdGlvbnMueSA9PT0gYWN0aW9uc1swXVsxXS5vcHRpb25zLnkpIHtcbiAgICAvLyBob3Jpem9udGFsLCBzaW5jZSB5IG9mZnNldCBpcyB0aGUgc2FtZSBpbiBwcmVzcyBhbmQgbW92ZVRvXG4gICAgbGV0IHRodW1iID0gKGFjdGlvbnNbMF1bMF0ub3B0aW9ucy54IDw9IGFjdGlvbnNbMV1bMF0ub3B0aW9ucy54KSA/IGFjdGlvbnNbMF0gOiBhY3Rpb25zWzFdO1xuXG4gICAgLy8gbm93IGRlY2lwaGVyIHBpbmNoIHZzLiB6b29tLFxuICAgIC8vICAgcGluY2g6IHRodW1iIG1vdmluZyBmcm9tIGxlZnQgdG8gcmlnaHRcbiAgICAvLyAgIHpvb206IHRodW1iIG1vdmluZyBmcm9tIHJpZ2h0IHRvIGxlZnRcbiAgICBzY2FsZSA9IGRldGVybWluZVBpbmNoU2NhbGUodGh1bWJbMF0ub3B0aW9ucy54LCB0aHVtYlsxXS5vcHRpb25zLngsIHRodW1iWzBdLm9wdGlvbnMueCA8PSB0aHVtYlsxXS5vcHRpb25zLngpO1xuICB9IGVsc2Uge1xuICAgIC8vIHZlcnRpY2FsXG4gICAgbGV0IGZvcmVmaW5nZXIgPSAoYWN0aW9uc1swXVswXS5vcHRpb25zLnkgPD0gYWN0aW9uc1sxXVswXS5vcHRpb25zLnkpID8gYWN0aW9uc1swXSA6IGFjdGlvbnNbMV07XG5cbiAgICAvLyBub3cgZGVjaXBoZXIgcGluY2ggdnMuIHpvb21cbiAgICAvLyAgIHBpbmNoOiBmb3JlZmluZ2VyIG1vdmluZyBmcm9tIHRvcCB0byBib3R0b21cbiAgICAvLyAgIHpvb206IGZvcmVmaW5nZXIgbW92aW5nIGZyb20gYm90dG9tIHRvIHRvcFxuICAgIHNjYWxlID0gZGV0ZXJtaW5lUGluY2hTY2FsZShmb3JlZmluZ2VyWzBdLm9wdGlvbnMueSwgZm9yZWZpbmdlclsxXS5vcHRpb25zLnksIGZvcmVmaW5nZXJbMF0ub3B0aW9ucy55IDw9IGZvcmVmaW5nZXJbMV0ub3B0aW9ucy55KTtcbiAgfVxuICB2ZWxvY2l0eSA9IHNjYWxlIDwgMSA/IC0xIDogMTtcblxuICBsb2cuZGVidWcoYERlY29kZWQgJHtzY2FsZSA8IDEgPyAncGluY2gnIDogJ3pvb20nfSBhY3Rpb24gd2l0aCBzY2FsZSAnJHtzY2FsZX0nIGFuZCB2ZWxvY2l0eSAnJHt2ZWxvY2l0eX0nYCk7XG4gIGlmIChzY2FsZSA8IDEpIHtcbiAgICBsb2cud2FybignUGluY2ggYWN0aW9ucyBtYXkgbm90IHdvcmssIGR1ZSB0byBBcHBsZSBpc3N1ZS4nKTtcbiAgfVxuXG4gIGxldCBwYXJhbXMgPSB7XG4gICAgc2NhbGUsXG4gICAgdmVsb2NpdHlcbiAgfTtcbiAgYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoYC93ZGEvZWxlbWVudC8ke2VsfS9waW5jaGAsICdQT1NUJywgcGFyYW1zKTtcbn07XG5cbi8qXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL1dlYkRyaXZlckFnZW50L2Jsb2IvbWFzdGVyL1dlYkRyaXZlckFnZW50TGliL0NvbW1hbmRzL0ZCRWxlbWVudENvbW1hbmRzLm1cbiAqIHRvIGdldCB0aGUgaW5mbyBhYm91dCBhdmFpbGFibGUgV0RBIGdlc3R1cmVzIEFQSVxuICpcbiAqIFNlZSBodHRwczovL2RldmVsb3Blci5hcHBsZS5jb20vcmVmZXJlbmNlL3hjdGVzdC94Y3VpZWxlbWVudCBhbmRcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLmFwcGxlLmNvbS9yZWZlcmVuY2UveGN0ZXN0L3hjdWljb29yZGluYXRlIHRvIGdldCB0aGUgZGV0YWlsZWQgZGVzY3JpcHRpb24gb2ZcbiAqIGFsbCBYQ1Rlc3QgZ2VzdHVyZXNcbiovXG5cbmhlbHBlcnMubW9iaWxlU2Nyb2xsID0gYXN5bmMgZnVuY3Rpb24gKG9wdHM9e30sIHN3aXBlPWZhbHNlKSB7XG4gIGlmICghb3B0cy5lbGVtZW50KSB7XG4gICAgb3B0cy5lbGVtZW50ID0gYXdhaXQgdGhpcy5maW5kTmF0aXZlRWxlbWVudE9yRWxlbWVudHMoYGNsYXNzIG5hbWVgLCBgWENVSUVsZW1lbnRUeXBlQXBwbGljYXRpb25gLCBmYWxzZSk7XG4gIH1cbiAgLy8gV0RBIHN1cHBvcnRzIGZvdXIgc2Nyb2xsaW5nIHN0cmF0ZWdpZXM6IHByZWRpY2F0aW9uIGJhc2VkIG9uIG5hbWUsIGRpcmVjdGlvbixcbiAgLy8gcHJlZGljYXRlU3RyaW5nLCBhbmQgdG9WaXNpYmxlLCBpbiB0aGF0IG9yZGVyLiBTd2lwaW5nIHJlcXVpcmVzIGRpcmVjdGlvbi5cbiAgbGV0IHBhcmFtcyA9IHt9O1xuICBpZiAob3B0cy5uYW1lICYmICFzd2lwZSkge1xuICAgIHBhcmFtcy5uYW1lID0gb3B0cy5uYW1lO1xuICB9IGVsc2UgaWYgKG9wdHMuZGlyZWN0aW9uKSB7XG4gICAgaWYgKFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J10uaW5kZXhPZihvcHRzLmRpcmVjdGlvbi50b0xvd2VyQ2FzZSgpKSA8IDApIHtcbiAgICAgIGxldCBtc2cgPSAnRGlyZWN0aW9uIG11c3QgYmUgdXAsIGRvd24sIGxlZnQgb3IgcmlnaHQnO1xuICAgICAgbG9nLmVycm9yQW5kVGhyb3cobXNnKTtcbiAgICB9XG4gICAgcGFyYW1zLmRpcmVjdGlvbiA9IG9wdHMuZGlyZWN0aW9uO1xuICB9ICBlbHNlIGlmIChvcHRzLnByZWRpY2F0ZVN0cmluZyAmJiAhc3dpcGUpIHtcbiAgICBwYXJhbXMucHJlZGljYXRlU3RyaW5nID0gb3B0cy5wcmVkaWNhdGVTdHJpbmc7XG4gIH0gZWxzZSBpZiAob3B0cy50b1Zpc2libGUgJiYgIXN3aXBlKSB7XG4gICAgcGFyYW1zLnRvVmlzaWJsZSA9IG9wdHMudG9WaXNpYmxlO1xuICB9IGVsc2Uge1xuICAgIGxldCBtc2cgPSBzd2lwZSA/ICdNb2JpbGUgc3dpcGUgcmVxdWlyZXMgZGlyZWN0aW9uJyA6ICAnTW9iaWxlIHNjcm9sbCBzdXBwb3J0cyB0aGUgZm9sbG93aW5nIHN0cmF0ZWdpZXM6IG5hbWUsIGRpcmVjdGlvbiwgcHJlZGljYXRlU3RyaW5nLCBhbmQgdG9WaXNpYmxlLiBTcGVjaWZ5IG9uZSBvZiB0aGVzZSc7XG4gICAgbG9nLmVycm9yQW5kVGhyb3cobXNnKTtcbiAgfVxuXG4gIGxldCBlbGVtZW50ID0gb3B0cy5lbGVtZW50LkVMRU1FTlQgfHwgb3B0cy5lbGVtZW50O1xuICBsZXQgZW5kcG9pbnQgPSBgL3dkYS9lbGVtZW50LyR7ZWxlbWVudH0vJHtzd2lwZSA/ICdzd2lwZScgOiAnc2Nyb2xsJ31gO1xuICByZXR1cm4gYXdhaXQgdGhpcy5wcm94eUNvbW1hbmQoZW5kcG9pbnQsICdQT1NUJywgcGFyYW1zKTtcbn07XG5cbmZ1bmN0aW9uIHBhcnNlRmxvYXRQYXJhbWV0ZXIgKHBhcmFtTmFtZSwgcGFyYW1WYWx1ZSwgbWV0aG9kTmFtZSkge1xuICBpZiAoXy5pc1VuZGVmaW5lZChwYXJhbVZhbHVlKSkge1xuICAgIGxvZy5lcnJvckFuZFRocm93KGBcIiR7cGFyYW1OYW1lfVwiIHBhcmFtZXRlciBpcyBtYW5kYXRvcnkgZm9yIFwiJHttZXRob2ROYW1lfVwiIGNhbGxgKTtcbiAgfVxuICBjb25zdCByZXN1bHQgPSBwYXJzZUZsb2F0KHBhcmFtVmFsdWUpO1xuICBpZiAoaXNOYU4ocmVzdWx0KSkge1xuICAgIGxvZy5lcnJvckFuZFRocm93KGBcIiR7cGFyYW1OYW1lfVwiIHBhcmFtZXRlciBzaG91bGQgYmUgYSB2YWxpZCBudW1iZXIuIFwiJHtwYXJhbVZhbHVlfVwiIGlzIGdpdmVuIGluc3RlYWRgKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5oZWxwZXJzLm1vYmlsZVBpbmNoID0gYXN5bmMgZnVuY3Rpb24gKG9wdHM9e30pIHtcbiAgaWYgKCFvcHRzLmVsZW1lbnQpIHtcbiAgICBvcHRzLmVsZW1lbnQgPSBhd2FpdCB0aGlzLmZpbmROYXRpdmVFbGVtZW50T3JFbGVtZW50cyhgY2xhc3MgbmFtZWAsIGBYQ1VJRWxlbWVudFR5cGVBcHBsaWNhdGlvbmAsIGZhbHNlKTtcbiAgfVxuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgc2NhbGU6IHBhcnNlRmxvYXRQYXJhbWV0ZXIoJ3NjYWxlJywgb3B0cy5zY2FsZSwgJ3BpbmNoJyksXG4gICAgdmVsb2NpdHk6IHBhcnNlRmxvYXRQYXJhbWV0ZXIoJ3ZlbG9jaXR5Jywgb3B0cy52ZWxvY2l0eSwgJ3BpbmNoJylcbiAgfTtcbiAgY29uc3QgZWwgPSBvcHRzLmVsZW1lbnQuRUxFTUVOVCB8fCBvcHRzLmVsZW1lbnQ7XG4gIHJldHVybiBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZChgL3dkYS9lbGVtZW50LyR7ZWx9L3BpbmNoYCwgJ1BPU1QnLCBwYXJhbXMpO1xufTtcblxuaGVscGVycy5tb2JpbGVEb3VibGVUYXAgPSBhc3luYyBmdW5jdGlvbiAob3B0cz17fSkge1xuICBpZiAob3B0cy5lbGVtZW50KSB7XG4gICAgLy8gRG91YmxlIHRhcCBlbGVtZW50XG4gICAgY29uc3QgZWwgPSBvcHRzLmVsZW1lbnQuRUxFTUVOVCB8fCBvcHRzLmVsZW1lbnQ7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGAvd2RhL2VsZW1lbnQvJHtlbH0vZG91YmxlVGFwYCwgJ1BPU1QnKTtcbiAgfVxuICAvLyBEb3VibGUgdGFwIGNvb3JkaW5hdGVzXG4gIGNvbnN0IHBhcmFtcyA9IHtcbiAgICB4OiBwYXJzZUZsb2F0UGFyYW1ldGVyKCd4Jywgb3B0cy54LCAnZG91YmxlVGFwJyksXG4gICAgeTogcGFyc2VGbG9hdFBhcmFtZXRlcigneScsIG9wdHMueSwgJ2RvdWJsZVRhcCcpXG4gIH07XG4gIHJldHVybiBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZCgnL3dkYS9kb3VibGVUYXAnLCAnUE9TVCcsIHBhcmFtcyk7XG59O1xuXG5oZWxwZXJzLm1vYmlsZVR3b0ZpbmdlclRhcCA9IGFzeW5jIGZ1bmN0aW9uIChvcHRzPXt9KSB7XG4gIGlmICghb3B0cy5lbGVtZW50KSB7XG4gICAgb3B0cy5lbGVtZW50ID0gYXdhaXQgdGhpcy5maW5kTmF0aXZlRWxlbWVudE9yRWxlbWVudHMoYGNsYXNzIG5hbWVgLCBgWENVSUVsZW1lbnRUeXBlQXBwbGljYXRpb25gLCBmYWxzZSk7XG4gIH1cbiAgY29uc3QgZWwgPSBvcHRzLmVsZW1lbnQuRUxFTUVOVCB8fCBvcHRzLmVsZW1lbnQ7XG4gIHJldHVybiBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZChgL3dkYS9lbGVtZW50LyR7ZWx9L3R3b0ZpbmdlclRhcGAsICdQT1NUJyk7XG59O1xuXG5oZWxwZXJzLm1vYmlsZVRvdWNoQW5kSG9sZCA9IGFzeW5jIGZ1bmN0aW9uIChvcHRzPXt9KSB7XG4gIGxldCBwYXJhbXMgPSB7XG4gICAgZHVyYXRpb246IHBhcnNlRmxvYXRQYXJhbWV0ZXIoJ2R1cmF0aW9uJywgb3B0cy5kdXJhdGlvbiwgJ3RvdWNoQW5kSG9sZCcpXG4gIH07XG4gIGlmIChvcHRzLmVsZW1lbnQpIHtcbiAgICAvLyBMb25nIHRhcCBlbGVtZW50XG4gICAgY29uc3QgZWwgPSBvcHRzLmVsZW1lbnQuRUxFTUVOVCB8fCBvcHRzLmVsZW1lbnQ7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGAvd2RhL2VsZW1lbnQvJHtlbH0vdG91Y2hBbmRIb2xkYCwgJ1BPU1QnLCBwYXJhbXMpO1xuICB9XG4gIC8vIExvbmcgdGFwIGNvb3JkaW5hdGVzXG4gIHBhcmFtcy54ID0gcGFyc2VGbG9hdFBhcmFtZXRlcigneCcsIG9wdHMueCwgJ3RvdWNoQW5kSG9sZCcpO1xuICBwYXJhbXMueSA9IHBhcnNlRmxvYXRQYXJhbWV0ZXIoJ3knLCBvcHRzLnksICd0b3VjaEFuZEhvbGQnKTtcbiAgcmV0dXJuIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKCcvd2RhL3RvdWNoQW5kSG9sZCcsICdQT1NUJywgcGFyYW1zKTtcbn07XG5cbmhlbHBlcnMubW9iaWxlVGFwID0gYXN5bmMgZnVuY3Rpb24gKG9wdHM9e30pIHtcbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIHg6IHBhcnNlRmxvYXRQYXJhbWV0ZXIoJ3gnLCBvcHRzLngsICd0YXAnKSxcbiAgICB5OiBwYXJzZUZsb2F0UGFyYW1ldGVyKCd5Jywgb3B0cy55LCAndGFwJylcbiAgfTtcbiAgY29uc3QgZWwgPSBvcHRzLmVsZW1lbnQgPyAob3B0cy5lbGVtZW50LkVMRU1FTlQgfHwgb3B0cy5lbGVtZW50KSA6ICcwJztcbiAgcmV0dXJuIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGAvd2RhL3RhcC8ke2VsfWAsICdQT1NUJywgcGFyYW1zKTtcbn07XG5cbmhlbHBlcnMubW9iaWxlRHJhZ0Zyb21Ub0ZvckR1cmF0aW9uID0gYXN5bmMgZnVuY3Rpb24gKG9wdHM9e30pIHtcbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIGR1cmF0aW9uOiBwYXJzZUZsb2F0UGFyYW1ldGVyKCdkdXJhdGlvbicsIG9wdHMuZHVyYXRpb24sICdkcmFnRnJvbVRvRm9yRHVyYXRpb24nKSxcbiAgICBmcm9tWDogcGFyc2VGbG9hdFBhcmFtZXRlcignZnJvbVgnLCBvcHRzLmZyb21YLCAnZHJhZ0Zyb21Ub0ZvckR1cmF0aW9uJyksXG4gICAgZnJvbVk6IHBhcnNlRmxvYXRQYXJhbWV0ZXIoJ2Zyb21ZJywgb3B0cy5mcm9tWSwgJ2RyYWdGcm9tVG9Gb3JEdXJhdGlvbicpLFxuICAgIHRvWDogcGFyc2VGbG9hdFBhcmFtZXRlcigndG9YJywgb3B0cy50b1gsICdkcmFnRnJvbVRvRm9yRHVyYXRpb24nKSxcbiAgICB0b1k6IHBhcnNlRmxvYXRQYXJhbWV0ZXIoJ3RvWScsIG9wdHMudG9ZLCAnZHJhZ0Zyb21Ub0ZvckR1cmF0aW9uJylcbiAgfTtcbiAgaWYgKG9wdHMuZWxlbWVudCkge1xuICAgIC8vIERyYWcgZWxlbWVudFxuICAgIGNvbnN0IGVsID0gb3B0cy5lbGVtZW50LkVMRU1FTlQgfHwgb3B0cy5lbGVtZW50O1xuICAgIHJldHVybiBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZChgL3dkYS9lbGVtZW50LyR7ZWx9L2RyYWdmcm9tdG9mb3JkdXJhdGlvbmAsICdQT1NUJywgcGFyYW1zKTtcbiAgfVxuICAvLyBEcmFnIGNvb3JkaW5hdGVzXG4gIHJldHVybiBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZCgnL3dkYS9kcmFnZnJvbXRvZm9yZHVyYXRpb24nLCAnUE9TVCcsIHBhcmFtcyk7XG59O1xuXG5oZWxwZXJzLm1vYmlsZVNlbGVjdFBpY2tlcldoZWVsVmFsdWUgPSBhc3luYyBmdW5jdGlvbiAob3B0cz17fSkge1xuICBpZiAoIW9wdHMuZWxlbWVudCkge1xuICAgIGxvZy5lcnJvckFuZFRocm93KCdFbGVtZW50IGlkIGlzIGV4cGVjdGVkIHRvIGJlIHNldCBmb3Igc2VsZWN0UGlja2VyV2hlZWxWYWx1ZSBtZXRob2QnKTtcbiAgfVxuICBpZiAoIV8uaXNTdHJpbmcob3B0cy5vcmRlcikgfHwgWyduZXh0JywgJ3ByZXZpb3VzJ10uaW5kZXhPZihvcHRzLm9yZGVyLnRvTG93ZXJDYXNlKCkpID09PSAtMSkge1xuICAgIGxvZy5lcnJvckFuZFRocm93KGBUaGUgbWFuZGF0b3J5IFwib3JkZXJcIiBwYXJhbWV0ZXIgaXMgZXhwZWN0ZWQgdG8gYmUgZXF1YWwgZWl0aGVyIHRvICduZXh0JyBvciAncHJldmlvdXMnLiBgICtcbiAgICAgICAgICAgICAgICAgICAgICBgJyR7b3B0cy5vcmRlcn0nIGlzIGdpdmVuIGluc3RlYWRgKTtcbiAgfVxuICBjb25zdCBlbCA9IG9wdHMuZWxlbWVudC5FTEVNRU5UIHx8IG9wdHMuZWxlbWVudDtcbiAgY29uc3QgcGFyYW1zID0ge29yZGVyOiBvcHRzLm9yZGVyfTtcbiAgaWYgKG9wdHMub2Zmc2V0KSB7XG4gICAgcGFyYW1zLm9mZnNldCA9IHBhcnNlRmxvYXRQYXJhbWV0ZXIoJ29mZnNldCcsIG9wdHMub2Zmc2V0LCAnc2VsZWN0UGlja2VyV2hlZWxWYWx1ZScpO1xuICB9XG4gIHJldHVybiBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZChgL3dkYS9waWNrZXJ3aGVlbC8ke2VsfS9zZWxlY3RgLCAnUE9TVCcsIHBhcmFtcyk7XG59O1xuXG5oZWxwZXJzLmdldENvb3JkaW5hdGVzID0gYXN5bmMgZnVuY3Rpb24gKGdlc3R1cmUpIHtcbiAgbGV0IGVsID0gZ2VzdHVyZS5vcHRpb25zLmVsZW1lbnQ7XG5cbiAgLy8gZGVmYXVsdHNcbiAgbGV0IGNvb3JkaW5hdGVzID0ge3g6IDAsIHk6IDAsIGFyZU9mZnNldHM6IGZhbHNlfTtcblxuICBsZXQgb3B0aW9uWCA9IG51bGw7XG4gIGlmIChnZXN0dXJlLm9wdGlvbnMueCkge1xuICAgIG9wdGlvblggPSBwYXJzZUZsb2F0UGFyYW1ldGVyKCd4JywgZ2VzdHVyZS5vcHRpb25zLngsICdnZXRDb29yZGluYXRlcycpO1xuICB9XG4gIGxldCBvcHRpb25ZID0gbnVsbDtcbiAgaWYgKGdlc3R1cmUub3B0aW9ucy55KSB7XG4gICAgb3B0aW9uWSA9IHBhcnNlRmxvYXRQYXJhbWV0ZXIoJ3knLCBnZXN0dXJlLm9wdGlvbnMueSwgJ2dldENvb3JkaW5hdGVzJyk7XG4gIH1cblxuICAvLyBmaWd1cmUgb3V0IHRoZSBlbGVtZW50IGNvb3JkaW5hdGVzLlxuICBpZiAoZWwpIHtcbiAgICBsZXQgcmVjdCA9IGF3YWl0IHRoaXMuZ2V0UmVjdChlbCk7XG4gICAgbGV0IHBvcyA9IHt4OiByZWN0LngsIHk6IHJlY3QueX07XG4gICAgbGV0IHNpemUgPSB7dzogcmVjdC53aWR0aCwgaDogcmVjdC5oZWlnaHR9O1xuXG4gICAgLy8gZGVmYXVsdHNcbiAgICBsZXQgb2Zmc2V0WCA9IDA7XG4gICAgbGV0IG9mZnNldFkgPSAwO1xuXG4gICAgLy8gZ2V0IHRoZSByZWFsIG9mZnNldHNcbiAgICBpZiAob3B0aW9uWCB8fCBvcHRpb25ZKSB7XG4gICAgICBvZmZzZXRYID0gKG9wdGlvblggfHwgMCk7XG4gICAgICBvZmZzZXRZID0gKG9wdGlvblkgfHwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9mZnNldFggPSAoc2l6ZS53IC8gMik7XG4gICAgICBvZmZzZXRZID0gKHNpemUuaCAvIDIpO1xuICAgIH1cblxuICAgIC8vIGFwcGx5IHRoZSBvZmZzZXRzXG4gICAgY29vcmRpbmF0ZXMueCA9IHBvcy54ICsgb2Zmc2V0WDtcbiAgICBjb29yZGluYXRlcy55ID0gcG9zLnkgKyBvZmZzZXRZO1xuICB9IGVsc2Uge1xuICAgIC8vIG1vdmVUbyBjb29yZGluYXRlcyBhcmUgcGFzc2VkIGluIGFzIG9mZnNldHNcbiAgICBjb29yZGluYXRlcy5hcmVPZmZzZXRzID0gKGdlc3R1cmUuYWN0aW9uID09PSAnbW92ZVRvJyk7XG4gICAgY29vcmRpbmF0ZXMueCA9IChvcHRpb25YIHx8IDApO1xuICAgIGNvb3JkaW5hdGVzLnkgPSAob3B0aW9uWSB8fCAwKTtcbiAgfVxuICByZXR1cm4gY29vcmRpbmF0ZXM7XG59O1xuXG5oZWxwZXJzLmFwcGx5TW92ZVRvT2Zmc2V0ID0gZnVuY3Rpb24gKGZpcnN0Q29vcmRpbmF0ZXMsIHNlY29uZENvb3JkaW5hdGVzKSB7XG4gIGlmIChzZWNvbmRDb29yZGluYXRlcy5hcmVPZmZzZXRzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IGZpcnN0Q29vcmRpbmF0ZXMueCArIHNlY29uZENvb3JkaW5hdGVzLngsXG4gICAgICB5OiBmaXJzdENvb3JkaW5hdGVzLnkgKyBzZWNvbmRDb29yZGluYXRlcy55LFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHNlY29uZENvb3JkaW5hdGVzO1xuICB9XG59O1xuXG5PYmplY3QuYXNzaWduKGV4dGVuc2lvbnMsIGhlbHBlcnMsIGNvbW1hbmRzKTtcbmV4cG9ydCB7IGV4dGVuc2lvbnMsIGhlbHBlcnMsIGNvbW1hbmRzLCBpc1NhbWVHZXN0dXJlcywgZ2VzdHVyZXNDaGFpblRvU3RyaW5nIH07XG5leHBvcnQgZGVmYXVsdCBleHRlbnNpb25zO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLi8uLiJ9
