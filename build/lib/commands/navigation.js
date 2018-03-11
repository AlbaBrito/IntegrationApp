'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _appiumBaseDriver = require('appium-base-driver');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var commands = {},
    helpers = {},
    extensions = {};

commands.back = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (this.isWebContext()) {
          context$1$0.next = 5;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.nativeBack());

      case 3:
        context$1$0.next = 7;
        break;

      case 5:
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.mobileWebNav('back'));

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.nativeBack = function callee$0$0() {
  var navBar, buttons, backButton;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeNavigationBar', false));

      case 3:
        navBar = context$1$0.sent;
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('class name', 'XCUIElementTypeButton', true, navBar));

      case 6:
        buttons = context$1$0.sent;

        if (!(buttons.length === 0)) {
          context$1$0.next = 9;
          break;
        }

        throw new Error('No buttons found in navigation bar');

      case 9:
        backButton = _lodash2['default'].filter(buttons, function (value) {
          return value.label === 'Back';
        })[0];

        if (backButton) {
          _logger2['default'].debug('Found navigation bar \'back\' button. Clicking.');
        } else {
          _logger2['default'].debug('Unable to find \'Back\' button. Trying first button in navigation bar');
          backButton = buttons[0];
        }
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(this.nativeClick(backButton));

      case 13:
        context$1$0.next = 18;
        break;

      case 15:
        context$1$0.prev = 15;
        context$1$0.t0 = context$1$0['catch'](0);

        _logger2['default'].error('Unable to find navigation bar and back button: ' + context$1$0.t0.message);

      case 18:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 15]]);
};

commands.forward = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!this.isWebContext()) {}
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.mobileWebNav('forward'));

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.closeWindow = function callee$0$0() {
  var script;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (this.isWebContext()) {
          context$1$0.next = 2;
          break;
        }

        throw new _appiumBaseDriver.errors.NotImplementedError();

      case 2:
        script = "return window.open('','_self').close();";
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(this.executeAtom('execute_script', [script, []], true));

      case 5:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

_Object$assign(extensions, commands, helpers);
exports.commands = commands;
exports.helpers = helpers;
exports['default'] = extensions;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9uYXZpZ2F0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztnQ0FBdUIsb0JBQW9COztzQkFDN0IsUUFBUTs7OztzQkFDTixXQUFXOzs7O0FBRzNCLElBQUksUUFBUSxHQUFHLEVBQUU7SUFBRSxPQUFPLEdBQUcsRUFBRTtJQUFFLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRWpELFFBQVEsQ0FBQyxJQUFJLEdBQUc7Ozs7WUFDVCxJQUFJLENBQUMsWUFBWSxFQUFFOzs7Ozs7eUNBQ2hCLElBQUksQ0FBQyxVQUFVLEVBQUU7Ozs7Ozs7O3lDQUVqQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQzs7Ozs7OztDQUVsQyxDQUFDOztBQUVGLE9BQU8sQ0FBQyxVQUFVLEdBQUc7TUFFYixNQUFNLEVBQ04sT0FBTyxFQUtQLFVBQVU7Ozs7Ozt5Q0FOSyxJQUFJLENBQUMsMkJBQTJCLENBQUMsWUFBWSxFQUFFLDhCQUE4QixFQUFFLEtBQUssQ0FBQzs7O0FBQXBHLGNBQU07O3lDQUNVLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxZQUFZLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQzs7O0FBQXJHLGVBQU87O2NBQ1AsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUE7Ozs7O2NBQ2hCLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDOzs7QUFHbkQsa0JBQVUsR0FBRyxvQkFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSztpQkFBSyxLQUFLLENBQUMsS0FBSyxLQUFLLE1BQU07U0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUN4RSxZQUFJLFVBQVUsRUFBRTtBQUNkLDhCQUFJLEtBQUssbURBQWlELENBQUM7U0FDNUQsTUFBTTtBQUNMLDhCQUFJLEtBQUsseUVBQXVFLENBQUM7QUFDakYsb0JBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDekI7O3lDQUNLLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDOzs7Ozs7Ozs7O0FBRWxDLDRCQUFJLEtBQUsscURBQW1ELGVBQUksT0FBTyxDQUFHLENBQUM7Ozs7Ozs7Q0FFOUUsQ0FBQzs7QUFFRixRQUFRLENBQUMsT0FBTyxHQUFHOzs7O0FBQ2pCLFlBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsRUFDekI7O3lDQUNLLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDOzs7Ozs7O0NBQ25DLENBQUM7O0FBRUYsUUFBUSxDQUFDLFdBQVcsR0FBRztNQUlqQixNQUFNOzs7O1lBSEwsSUFBSSxDQUFDLFlBQVksRUFBRTs7Ozs7Y0FDaEIsSUFBSSx5QkFBTyxtQkFBbUIsRUFBRTs7O0FBRXBDLGNBQU0sR0FBRyx5Q0FBeUM7O3lDQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQzs7Ozs7Ozs7OztDQUNwRSxDQUFDOztBQUdGLGVBQWMsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwQyxRQUFRLEdBQVIsUUFBUTtRQUFFLE9BQU8sR0FBUCxPQUFPO3FCQUNYLFVBQVUiLCJmaWxlIjoibGliL2NvbW1hbmRzL25hdmlnYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBlcnJvcnMgfSBmcm9tICdhcHBpdW0tYmFzZS1kcml2ZXInO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBsb2cgZnJvbSAnLi4vbG9nZ2VyJztcblxuXG5sZXQgY29tbWFuZHMgPSB7fSwgaGVscGVycyA9IHt9LCBleHRlbnNpb25zID0ge307XG5cbmNvbW1hbmRzLmJhY2sgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGlmICghdGhpcy5pc1dlYkNvbnRleHQoKSkge1xuICAgIGF3YWl0IHRoaXMubmF0aXZlQmFjaygpO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IHRoaXMubW9iaWxlV2ViTmF2KCdiYWNrJyk7XG4gIH1cbn07XG5cbmhlbHBlcnMubmF0aXZlQmFjayA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICBsZXQgbmF2QmFyID0gYXdhaXQgdGhpcy5maW5kTmF0aXZlRWxlbWVudE9yRWxlbWVudHMoJ2NsYXNzIG5hbWUnLCAnWENVSUVsZW1lbnRUeXBlTmF2aWdhdGlvbkJhcicsIGZhbHNlKTtcbiAgICBsZXQgYnV0dG9ucyA9IGF3YWl0IHRoaXMuZmluZE5hdGl2ZUVsZW1lbnRPckVsZW1lbnRzKCdjbGFzcyBuYW1lJywgJ1hDVUlFbGVtZW50VHlwZUJ1dHRvbicsIHRydWUsIG5hdkJhcik7XG4gICAgaWYgKGJ1dHRvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGJ1dHRvbnMgZm91bmQgaW4gbmF2aWdhdGlvbiBiYXInKTtcbiAgICB9XG5cbiAgICBsZXQgYmFja0J1dHRvbiA9IF8uZmlsdGVyKGJ1dHRvbnMsICh2YWx1ZSkgPT4gdmFsdWUubGFiZWwgPT09ICdCYWNrJylbMF07XG4gICAgaWYgKGJhY2tCdXR0b24pIHtcbiAgICAgIGxvZy5kZWJ1ZyhgRm91bmQgbmF2aWdhdGlvbiBiYXIgJ2JhY2snIGJ1dHRvbi4gQ2xpY2tpbmcuYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy5kZWJ1ZyhgVW5hYmxlIHRvIGZpbmQgJ0JhY2snIGJ1dHRvbi4gVHJ5aW5nIGZpcnN0IGJ1dHRvbiBpbiBuYXZpZ2F0aW9uIGJhcmApO1xuICAgICAgYmFja0J1dHRvbiA9IGJ1dHRvbnNbMF07XG4gICAgfVxuICAgIGF3YWl0IHRoaXMubmF0aXZlQ2xpY2soYmFja0J1dHRvbik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGxvZy5lcnJvcihgVW5hYmxlIHRvIGZpbmQgbmF2aWdhdGlvbiBiYXIgYW5kIGJhY2sgYnV0dG9uOiAke2Vyci5tZXNzYWdlfWApO1xuICB9XG59O1xuXG5jb21tYW5kcy5mb3J3YXJkID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICBpZiAoIXRoaXMuaXNXZWJDb250ZXh0KCkpIHtcbiAgfVxuICBhd2FpdCB0aGlzLm1vYmlsZVdlYk5hdignZm9yd2FyZCcpO1xufTtcblxuY29tbWFuZHMuY2xvc2VXaW5kb3cgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGlmICghdGhpcy5pc1dlYkNvbnRleHQoKSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuTm90SW1wbGVtZW50ZWRFcnJvcigpO1xuICB9XG4gIGxldCBzY3JpcHQgPSBcInJldHVybiB3aW5kb3cub3BlbignJywnX3NlbGYnKS5jbG9zZSgpO1wiO1xuICByZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlQXRvbSgnZXhlY3V0ZV9zY3JpcHQnLCBbc2NyaXB0LCBbXV0sIHRydWUpO1xufTtcblxuXG5PYmplY3QuYXNzaWduKGV4dGVuc2lvbnMsIGNvbW1hbmRzLCBoZWxwZXJzKTtcbmV4cG9ydCB7IGNvbW1hbmRzLCBoZWxwZXJzIH07XG5leHBvcnQgZGVmYXVsdCBleHRlbnNpb25zO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLi8uLiJ9
