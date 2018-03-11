'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appiumBaseDriver = require('appium-base-driver');

var _appiumSupport = require('appium-support');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var helpers = {},
    commands = {},
    extensions = {};

helpers.findElOrEls = function callee$0$0(strategy, selector, mult, context) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!this.isWebview()) {
          context$1$0.next = 6;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.findWebElementOrElements(strategy, selector, mult, context));

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements(strategy, selector, mult, context));

      case 8:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.findNativeElementOrElements = function callee$0$0(strategy, selector, mult, context) {
  var initSelector, rewroteSelector, stripViewFromSelector, endpoint, body, method, els;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        stripViewFromSelector = function stripViewFromSelector(selector) {
          // Don't strip it out if it's one of these 4 element types
          // (see https://github.com/facebook/WebDriverAgent/blob/master/WebDriverAgentLib/Utilities/FBElementTypeTransformer.m for reference)
          var keepView = ['XCUIElementTypeScrollView', 'XCUIElementTypeCollectionView', 'XCUIElementTypeTextView', 'XCUIElementTypeWebView'].indexOf(selector) >= 0;

          if (!keepView && selector.indexOf('View') === selector.length - 4) {
            return selector.substr(0, selector.length - 4);
          } else {
            return selector;
          }
        };

        initSelector = selector;
        rewroteSelector = false;

        if (strategy === '-ios predicate string') {
          // WebDriverAgent uses 'predicate string'
          strategy = 'predicate string';
        } else if (strategy === '-ios class chain') {
          // WebDriverAgent uses 'class chain'
          strategy = 'class chain';
        }

        // Check if the word 'View' is appended to selector and if it is, strip it out

        if (strategy === 'class name') {
          // XCUITest classes have `XCUIElementType` prepended
          // first check if there is the old `UIA` prefix
          if (selector.indexOf('UIA') === 0) {
            selector = selector.substring(3);
          }
          // now check if we need to add `XCUIElementType`
          if (selector.indexOf('XCUIElementType') !== 0) {
            selector = stripViewFromSelector('XCUIElementType' + selector);
            rewroteSelector = true;
          }
        }

        if (strategy === 'xpath') {
          // Replace UIA if it comes after a forward slash or is at the beginning of the string
          selector = selector.replace(/(^|\/)(UIA)([^\[\/]+)/g, function (str, g1, g2, g3) {
            rewroteSelector = true;
            return g1 + stripViewFromSelector('XCUIElementType' + g3);
          });
        }

        if (rewroteSelector) {
          _logger2['default'].info('Rewrote incoming selector from \'' + initSelector + '\' to ' + ('\'' + selector + '\' to match XCUI type. You should consider ') + 'updating your tests to use the new selectors directly');
        }

        context = _appiumSupport.util.unwrapElement(context);

        endpoint = '/element' + (context ? '/' + context + '/element' : '') + (mult ? 's' : '');
        body = {
          using: strategy,
          value: selector
        };
        method = 'POST';
        els = undefined;
        context$1$0.prev = 12;
        context$1$0.next = 15;
        return _regeneratorRuntime.awrap(this.implicitWaitForCondition(function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.prev = 0;
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(this.proxyCommand(endpoint, method, body));

              case 3:
                els = context$2$0.sent;

                if (!mult) {
                  context$2$0.next = 8;
                  break;
                }

                return context$2$0.abrupt('return', els && els.length);

              case 8:
                return context$2$0.abrupt('return', !els.status || els.status === 0);

              case 9:
                context$2$0.next = 15;
                break;

              case 11:
                context$2$0.prev = 11;
                context$2$0.t0 = context$2$0['catch'](0);

                els = undefined;
                return context$2$0.abrupt('return', false);

              case 15:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this, [[0, 11]]);
        }));

      case 15:
        context$1$0.next = 24;
        break;

      case 17:
        context$1$0.prev = 17;
        context$1$0.t0 = context$1$0['catch'](12);

        if (!(context$1$0.t0.message && context$1$0.t0.message.match(/Condition unmet/))) {
          context$1$0.next = 23;
          break;
        }

        // condition was not met setting res to empty array
        els = [];
        context$1$0.next = 24;
        break;

      case 23:
        throw context$1$0.t0;

      case 24:
        if (!mult) {
          context$1$0.next = 28;
          break;
        }

        return context$1$0.abrupt('return', els);

      case 28:
        if (!(!els || _lodash2['default'].size(els) === 0)) {
          context$1$0.next = 30;
          break;
        }

        throw new _appiumBaseDriver.errors.NoSuchElementError();

      case 30:
        return context$1$0.abrupt('return', els);

      case 31:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[12, 17]]);
};

_Object$assign(extensions, commands, helpers);
exports.commands = commands;
exports.helpers = helpers;
exports['default'] = extensions;

// we succeed if we get some elements

// we may not get any status, which means success
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9maW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7O2dDQUNDLG9CQUFvQjs7NkJBQ3RCLGdCQUFnQjs7c0JBQ3JCLFdBQVc7Ozs7QUFHM0IsSUFBSSxPQUFPLEdBQUcsRUFBRTtJQUFFLFFBQVEsR0FBRyxFQUFFO0lBQUUsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFakQsT0FBTyxDQUFDLFdBQVcsR0FBRyxvQkFBZ0IsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTzs7OzthQUNqRSxJQUFJLENBQUMsU0FBUyxFQUFFOzs7Ozs7eUNBQ0wsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQzs7Ozs7Ozt5Q0FFaEUsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQzs7Ozs7Ozs7OztDQUVuRixDQUFDOztBQUVGLE9BQU8sQ0FBQywyQkFBMkIsR0FBRyxvQkFBZ0IsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTztNQUMvRSxZQUFZLEVBQ2QsZUFBZSxFQVVWLHFCQUFxQixFQThDMUIsUUFBUSxFQUVSLElBQUksRUFLSixNQUFNLEVBRU4sR0FBRzs7Ozs7O0FBdkRFLDZCQUFxQixZQUFyQixxQkFBcUIsQ0FBRSxRQUFRLEVBQUU7OztBQUd4QyxjQUFJLFFBQVEsR0FBRyxDQUNiLDJCQUEyQixFQUMzQiwrQkFBK0IsRUFDL0IseUJBQXlCLEVBQ3pCLHdCQUF3QixDQUN6QixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXpCLGNBQUksQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNqRSxtQkFBTyxRQUFRLENB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WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgZXJyb3JzIH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcbmltcG9ydCB7IHV0aWwgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5pbXBvcnQgbG9nIGZyb20gJy4uL2xvZ2dlcic7XG5cblxubGV0IGhlbHBlcnMgPSB7fSwgY29tbWFuZHMgPSB7fSwgZXh0ZW5zaW9ucyA9IHt9O1xuXG5oZWxwZXJzLmZpbmRFbE9yRWxzID0gYXN5bmMgZnVuY3Rpb24gKHN0cmF0ZWd5LCBzZWxlY3RvciwgbXVsdCwgY29udGV4dCkge1xuICBpZiAodGhpcy5pc1dlYnZpZXcoKSkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmZpbmRXZWJFbGVtZW50T3JFbGVtZW50cyhzdHJhdGVneSwgc2VsZWN0b3IsIG11bHQsIGNvbnRleHQpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmZpbmROYXRpdmVFbGVtZW50T3JFbGVtZW50cyhzdHJhdGVneSwgc2VsZWN0b3IsIG11bHQsIGNvbnRleHQpO1xuICB9XG59O1xuXG5oZWxwZXJzLmZpbmROYXRpdmVFbGVtZW50T3JFbGVtZW50cyA9IGFzeW5jIGZ1bmN0aW9uIChzdHJhdGVneSwgc2VsZWN0b3IsIG11bHQsIGNvbnRleHQpIHtcbiAgY29uc3QgaW5pdFNlbGVjdG9yID0gc2VsZWN0b3I7XG4gIGxldCByZXdyb3RlU2VsZWN0b3IgPSBmYWxzZTtcbiAgaWYgKHN0cmF0ZWd5ID09PSAnLWlvcyBwcmVkaWNhdGUgc3RyaW5nJykge1xuICAgIC8vIFdlYkRyaXZlckFnZW50IHVzZXMgJ3ByZWRpY2F0ZSBzdHJpbmcnXG4gICAgc3RyYXRlZ3kgPSAncHJlZGljYXRlIHN0cmluZyc7XG4gIH0gZWxzZSBpZiAoc3RyYXRlZ3kgPT09ICctaW9zIGNsYXNzIGNoYWluJykge1xuICAgIC8vIFdlYkRyaXZlckFnZW50IHVzZXMgJ2NsYXNzIGNoYWluJ1xuICAgIHN0cmF0ZWd5ID0gJ2NsYXNzIGNoYWluJztcbiAgfVxuXG4gIC8vIENoZWNrIGlmIHRoZSB3b3JkICdWaWV3JyBpcyBhcHBlbmRlZCB0byBzZWxlY3RvciBhbmQgaWYgaXQgaXMsIHN0cmlwIGl0IG91dFxuICBmdW5jdGlvbiBzdHJpcFZpZXdGcm9tU2VsZWN0b3IgKHNlbGVjdG9yKSB7XG4gICAgLy8gRG9uJ3Qgc3RyaXAgaXQgb3V0IGlmIGl0J3Mgb25lIG9mIHRoZXNlIDQgZWxlbWVudCB0eXBlc1xuICAgIC8vIChzZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL1dlYkRyaXZlckFnZW50L2Jsb2IvbWFzdGVyL1dlYkRyaXZlckFnZW50TGliL1V0aWxpdGllcy9GQkVsZW1lbnRUeXBlVHJhbnNmb3JtZXIubSBmb3IgcmVmZXJlbmNlKVxuICAgIGxldCBrZWVwVmlldyA9IFtcbiAgICAgICdYQ1VJRWxlbWVudFR5cGVTY3JvbGxWaWV3JyxcbiAgICAgICdYQ1VJRWxlbWVudFR5cGVDb2xsZWN0aW9uVmlldycsXG4gICAgICAnWENVSUVsZW1lbnRUeXBlVGV4dFZpZXcnLFxuICAgICAgJ1hDVUlFbGVtZW50VHlwZVdlYlZpZXcnLFxuICAgIF0uaW5kZXhPZihzZWxlY3RvcikgPj0gMDtcblxuICAgIGlmICgha2VlcFZpZXcgJiYgc2VsZWN0b3IuaW5kZXhPZignVmlldycpID09PSBzZWxlY3Rvci5sZW5ndGggLSA0KSB7XG4gICAgICByZXR1cm4gc2VsZWN0b3Iuc3Vic3RyKDAsIHNlbGVjdG9yLmxlbmd0aCAtIDQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0cmF0ZWd5ID09PSAnY2xhc3MgbmFtZScpIHtcbiAgICAvLyBYQ1VJVGVzdCBjbGFzc2VzIGhhdmUgYFhDVUlFbGVtZW50VHlwZWAgcHJlcGVuZGVkXG4gICAgLy8gZmlyc3QgY2hlY2sgaWYgdGhlcmUgaXMgdGhlIG9sZCBgVUlBYCBwcmVmaXhcbiAgICBpZiAoc2VsZWN0b3IuaW5kZXhPZignVUlBJykgPT09IDApIHtcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3Iuc3Vic3RyaW5nKDMpO1xuICAgIH1cbiAgICAvLyBub3cgY2hlY2sgaWYgd2UgbmVlZCB0byBhZGQgYFhDVUlFbGVtZW50VHlwZWBcbiAgICBpZiAoc2VsZWN0b3IuaW5kZXhPZignWENVSUVsZW1lbnRUeXBlJykgIT09IDApIHtcbiAgICAgIHNlbGVjdG9yID0gc3RyaXBWaWV3RnJvbVNlbGVjdG9yKGBYQ1VJRWxlbWVudFR5cGUke3NlbGVjdG9yfWApO1xuICAgICAgcmV3cm90ZVNlbGVjdG9yID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoc3RyYXRlZ3kgPT09ICd4cGF0aCcpIHtcbiAgICAvLyBSZXBsYWNlIFVJQSBpZiBpdCBjb21lcyBhZnRlciBhIGZvcndhcmQgc2xhc2ggb3IgaXMgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgc3RyaW5nXG4gICAgc2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKC8oXnxcXC8pKFVJQSkoW15cXFtcXC9dKykvZywgKHN0ciwgZzEsIGcyLCBnMykgPT4ge1xuICAgICAgcmV3cm90ZVNlbGVjdG9yID0gdHJ1ZTtcbiAgICAgIHJldHVybiBnMSArIHN0cmlwVmlld0Zyb21TZWxlY3RvcihgWENVSUVsZW1lbnRUeXBlJHtnM31gKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChyZXdyb3RlU2VsZWN0b3IpIHtcbiAgICBsb2cuaW5mbyhgUmV3cm90ZSBpbmNvbWluZyBzZWxlY3RvciBmcm9tICcke2luaXRTZWxlY3Rvcn0nIHRvIGAgK1xuICAgICAgICAgICAgIGAnJHtzZWxlY3Rvcn0nIHRvIG1hdGNoIFhDVUkgdHlwZS4gWW91IHNob3VsZCBjb25zaWRlciBgICtcbiAgICAgICAgICAgICBgdXBkYXRpbmcgeW91ciB0ZXN0cyB0byB1c2UgdGhlIG5ldyBzZWxlY3RvcnMgZGlyZWN0bHlgKTtcbiAgfVxuXG4gIGNvbnRleHQgPSB1dGlsLnVud3JhcEVsZW1lbnQoY29udGV4dCk7XG5cbiAgbGV0IGVuZHBvaW50ID0gYC9lbGVtZW50JHtjb250ZXh0ID8gYC8ke2NvbnRleHR9L2VsZW1lbnRgIDogJyd9JHttdWx0ID8gJ3MnIDogJyd9YDtcblxuICBsZXQgYm9keSA9IHtcbiAgICB1c2luZzogc3RyYXRlZ3ksXG4gICAgdmFsdWU6IHNlbGVjdG9yXG4gIH07XG5cbiAgbGV0IG1ldGhvZCA9ICdQT1NUJztcblxuICBsZXQgZWxzO1xuICB0cnkge1xuICAgIGF3YWl0IHRoaXMuaW1wbGljaXRXYWl0Rm9yQ29uZGl0aW9uKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGVscyA9IGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGVuZHBvaW50LCBtZXRob2QsIGJvZHkpO1xuICAgICAgICBpZiAobXVsdCkge1xuICAgICAgICAgIC8vIHdlIHN1Y2NlZWQgaWYgd2UgZ2V0IHNvbWUgZWxlbWVudHNcbiAgICAgICAgICByZXR1cm4gZWxzICYmIGVscy5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gd2UgbWF5IG5vdCBnZXQgYW55IHN0YXR1cywgd2hpY2ggbWVhbnMgc3VjY2Vzc1xuICAgICAgICAgIHJldHVybiAhZWxzLnN0YXR1cyB8fCBlbHMuc3RhdHVzID09PSAwO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgZWxzID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChlcnIubWVzc2FnZSAmJiBlcnIubWVzc2FnZS5tYXRjaCgvQ29uZGl0aW9uIHVubWV0LykpIHtcbiAgICAgIC8vIGNvbmRpdGlvbiB3YXMgbm90IG1ldCBzZXR0aW5nIHJlcyB0byBlbXB0eSBhcnJheVxuICAgICAgZWxzID0gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cbiAgaWYgKG11bHQpIHtcbiAgICByZXR1cm4gZWxzO1xuICB9IGVsc2Uge1xuICAgIGlmICghZWxzIHx8IF8uc2l6ZShlbHMpID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLk5vU3VjaEVsZW1lbnRFcnJvcigpO1xuICAgIH1cbiAgICByZXR1cm4gZWxzO1xuICB9XG59O1xuXG5cbk9iamVjdC5hc3NpZ24oZXh0ZW5zaW9ucywgY29tbWFuZHMsIGhlbHBlcnMpO1xuZXhwb3J0IHsgY29tbWFuZHMsIGhlbHBlcnN9O1xuZXhwb3J0IGRlZmF1bHQgZXh0ZW5zaW9ucztcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4vLi4ifQ==
