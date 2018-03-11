'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _xmldom = require('xmldom');

var _xmldom2 = _interopRequireDefault(_xmldom);

var _js2xmlparser2 = require("js2xmlparser2");

var _js2xmlparser22 = _interopRequireDefault(_js2xmlparser2);

var commands = {},
    helpers = {},
    extensions = {};

var APPIUM_SRC_XML = '<?xml version="1.0" encoding="UTF-8"?><AppiumAUT/>';

commands.getPageSource = function callee$0$0() {
  var script, srcTree;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!this.isWebContext()) {
          context$1$0.next = 5;
          break;
        }

        script = 'return document.documentElement.outerHTML';
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.executeAtom('execute_script', [script, []]));

      case 4:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 5:
        if (!this.settings.getSettings().useJSONSource) {
          context$1$0.next = 12;
          break;
        }

        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.mobileGetSource({ format: 'json' }));

      case 8:
        srcTree = context$1$0.sent;
        return context$1$0.abrupt('return', getSourceXml(getTreeForXML(srcTree)));

      case 12:
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(this.getNativePageSource());

      case 14:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 15:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getNativePageSource = function callee$0$0() {
  var srcTree, parser, tree, doc;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.proxyCommand('/source', 'GET'));

      case 2:
        srcTree = context$1$0.sent;
        parser = new _xmldom2['default'].DOMParser();
        tree = parser.parseFromString(srcTree);
        doc = parser.parseFromString(APPIUM_SRC_XML);

        doc.documentElement.appendChild(tree.documentElement);

        return context$1$0.abrupt('return', new _xmldom2['default'].XMLSerializer().serializeToString(doc));

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.mobileGetSource = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (_lodash2['default'].isString(opts.format)) {
          context$1$0.next = 4;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.getNativePageSource());

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 4:
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(this.proxyCommand('/source?format=' + encodeURIComponent(opts.format), 'GET'));

      case 6:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

/* Will get JSON of the form:
 *   { isEnabled: '1',
 *     isVisible: '1',
 *     frame: '{{0, 0}, {375, 667}}',
 *     children:
 *      [ { isEnabled: '1',
 *          isVisible: '1',
 *          frame: '{{0, 0}, {375, 667}}',
 *          children: [],
 *          rect: { x: 0, y: 0, width: 375, height: 667 },
 *          value: null,
 *          label: null,
 *          type: 'Other',
 *          name: null,
 *          rawIdentifier: null },
 *     rect: { origin: { x: 0, y: 0 }, size: { width: 375, height: 667 } },
 *     value: null,
 *     label: 'UICatalog',
 *     type: 'Application',
 *     name: 'UICatalog',
 *     rawIdentifier: null }
 */
function getTreeForXML(srcTree) {
  function getTree(element, elementIndex, parentPath) {
    var curPath = parentPath + '/' + elementIndex;
    var rect = element.rect || {};
    var subtree = {
      '@': {
        type: 'XCUIElementType' + element.type,
        enabled: parseInt(element.isEnabled, 10) === 1,
        visible: parseInt(element.isVisible, 10) === 1,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      },
      '>': []
    };
    if (element.name !== null) {
      subtree['@'].name = element.name;
    }
    if (element.label !== null) {
      subtree['@'].label = element.label;
    }
    if (element.value !== null) {
      subtree['@'].value = element.value;
    }
    for (var i = 0; i < (element.children || []).length; i++) {
      subtree['>'].push(getTree(element.children[i], i, curPath));
    }
    return _defineProperty({}, 'XCUIElementType' + element.type, subtree);
  }
  var tree = getTree(srcTree, 0, '');
  return tree;
}

function getSourceXml(jsonSource) {
  return (0, _js2xmlparser22['default'])("AppiumAUT", jsonSource, {
    wrapArray: { enabled: false, elementName: 'element' },
    declaration: { include: true },
    prettyPrinting: { indentString: '  ' }
  });
}

_Object$assign(extensions, commands, helpers);
exports.commands = commands;
exports.helpers = helpers;
exports['default'] = extensions;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9zb3VyY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7OztzQkFDSCxRQUFROzs7OzZCQUNSLGVBQWU7Ozs7QUFHbEMsSUFBSSxRQUFRLEdBQUcsRUFBRTtJQUFFLE9BQU8sR0FBRyxFQUFFO0lBQUUsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFakQsSUFBTSxjQUFjLEdBQUcsb0RBQW9ELENBQUM7O0FBRzVFLFFBQVEsQ0FBQyxhQUFhLEdBQUc7TUFFZixNQUFNLEVBS1IsT0FBTzs7OzthQU5ULElBQUksQ0FBQyxZQUFZLEVBQUU7Ozs7O0FBQ2YsY0FBTSxHQUFHLDJDQUEyQzs7eUNBQzdDLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzthQUczRCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLGFBQWE7Ozs7Ozt5Q0FDdkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUMsQ0FBQzs7O0FBQXRELGVBQU87NENBQ0osWUFBWSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7Ozt5Q0FFOUIsSUFBSSxDQUFDLG1CQUFtQixFQUFFOzs7Ozs7Ozs7O0NBRTFDLENBQUM7O0FBRUYsT0FBTyxDQUFDLG1CQUFtQixHQUFHO01BQ3hCLE9BQU8sRUFFUCxNQUFNLEVBRU4sSUFBSSxFQUVKLEdBQUc7Ozs7O3lDQU5hLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQzs7O0FBQW5ELGVBQU87QUFFUCxjQUFNLEdBQUcsSUFBSSxvQkFBTyxTQUFTLEVBQUU7QUFFL0IsWUFBSSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDO0FBRXRDLFdBQUcsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQzs7QUFDaEQsV0FBRyxDQUFD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LEVBQUUsSUFBSSxFQUFDO0dBQ3JDLENBQUMsQ0FBQztDQUNKOztBQUdELGVBQWMsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwQyxRQUFRLEdBQVIsUUFBUTtRQUFFLE9BQU8sR0FBUCxPQUFPO3FCQUNYLFVBQVUiLCJmaWxlIjoibGliL2NvbW1hbmRzL3NvdXJjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeG1sZG9tIGZyb20gJ3htbGRvbSc7XG5pbXBvcnQganMyeG1sIGZyb20gXCJqczJ4bWxwYXJzZXIyXCI7XG5cblxubGV0IGNvbW1hbmRzID0ge30sIGhlbHBlcnMgPSB7fSwgZXh0ZW5zaW9ucyA9IHt9O1xuXG5jb25zdCBBUFBJVU1fU1JDX1hNTCA9ICc8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiPz48QXBwaXVtQVVULz4nO1xuXG5cbmNvbW1hbmRzLmdldFBhZ2VTb3VyY2UgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmlzV2ViQ29udGV4dCgpKSB7XG4gICAgY29uc3Qgc2NyaXB0ID0gJ3JldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub3V0ZXJIVE1MJztcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlQXRvbSgnZXhlY3V0ZV9zY3JpcHQnLCBbc2NyaXB0LCBbXV0pO1xuICB9XG5cbiAgaWYgKHRoaXMuc2V0dGluZ3MuZ2V0U2V0dGluZ3MoKS51c2VKU09OU291cmNlKSB7XG4gICAgbGV0IHNyY1RyZWUgPSBhd2FpdCB0aGlzLm1vYmlsZUdldFNvdXJjZSh7Zm9ybWF0OiAnanNvbid9KTtcbiAgICByZXR1cm4gZ2V0U291cmNlWG1sKGdldFRyZWVGb3JYTUwoc3JjVHJlZSkpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmdldE5hdGl2ZVBhZ2VTb3VyY2UoKTtcbiAgfVxufTtcblxuaGVscGVycy5nZXROYXRpdmVQYWdlU291cmNlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICBsZXQgc3JjVHJlZSA9IGF3YWl0IHRoaXMucHJveHlDb21tYW5kKCcvc291cmNlJywgJ0dFVCcpO1xuXG4gIGxldCBwYXJzZXIgPSBuZXcgeG1sZG9tLkRPTVBhcnNlcigpO1xuXG4gIGxldCB0cmVlID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhzcmNUcmVlKTtcblxuICBsZXQgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhBUFBJVU1fU1JDX1hNTCk7XG4gIGRvYy5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodHJlZS5kb2N1bWVudEVsZW1lbnQpO1xuXG4gIHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyhkb2MpO1xufTtcblxuaGVscGVycy5tb2JpbGVHZXRTb3VyY2UgPSBhc3luYyBmdW5jdGlvbiAob3B0cyA9IHt9KSB7XG4gIGlmICghXy5pc1N0cmluZyhvcHRzLmZvcm1hdCkpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXROYXRpdmVQYWdlU291cmNlKCk7XG4gIH1cbiAgcmV0dXJuIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKGAvc291cmNlP2Zvcm1hdD0ke2VuY29kZVVSSUNvbXBvbmVudChvcHRzLmZvcm1hdCl9YCwgJ0dFVCcpO1xufTtcblxuLyogV2lsbCBnZXQgSlNPTiBvZiB0aGUgZm9ybTpcbiAqICAgeyBpc0VuYWJsZWQ6ICcxJyxcbiAqICAgICBpc1Zpc2libGU6ICcxJyxcbiAqICAgICBmcmFtZTogJ3t7MCwgMH0sIHszNzUsIDY2N319JyxcbiAqICAgICBjaGlsZHJlbjpcbiAqICAgICAgWyB7IGlzRW5hYmxlZDogJzEnLFxuICogICAgICAgICAgaXNWaXNpYmxlOiAnMScsXG4gKiAgICAgICAgICBmcmFtZTogJ3t7MCwgMH0sIHszNzUsIDY2N319JyxcbiAqICAgICAgICAgIGNoaWxkcmVuOiBbXSxcbiAqICAgICAgICAgIHJlY3Q6IHsgeDogMCwgeTogMCwgd2lkdGg6IDM3NSwgaGVpZ2h0OiA2NjcgfSxcbiAqICAgICAgICAgIHZhbHVlOiBudWxsLFxuICogICAgICAgICAgbGFiZWw6IG51bGwsXG4gKiAgICAgICAgICB0eXBlOiAnT3RoZXInLFxuICogICAgICAgICAgbmFtZTogbnVsbCxcbiAqICAgICAgICAgIHJhd0lkZW50aWZpZXI6IG51bGwgfSxcbiAqICAgICByZWN0OiB7IG9yaWdpbjogeyB4OiAwLCB5OiAwIH0sIHNpemU6IHsgd2lkdGg6IDM3NSwgaGVpZ2h0OiA2NjcgfSB9LFxuICogICAgIHZhbHVlOiBudWxsLFxuICogICAgIGxhYmVsOiAnVUlDYXRhbG9nJyxcbiAqICAgICB0eXBlOiAnQXBwbGljYXRpb24nLFxuICogICAgIG5hbWU6ICdVSUNhdGFsb2cnLFxuICogICAgIHJhd0lkZW50aWZpZXI6IG51bGwgfVxuICovXG5mdW5jdGlvbiBnZXRUcmVlRm9yWE1MIChzcmNUcmVlKSB7XG4gIGZ1bmN0aW9uIGdldFRyZWUgKGVsZW1lbnQsIGVsZW1lbnRJbmRleCwgcGFyZW50UGF0aCkge1xuICAgIGxldCBjdXJQYXRoID0gYCR7cGFyZW50UGF0aH0vJHtlbGVtZW50SW5kZXh9YDtcbiAgICBsZXQgcmVjdCA9IGVsZW1lbnQucmVjdCB8fCB7fTtcbiAgICBsZXQgc3VidHJlZSA9IHtcbiAgICAgICdAJzoge1xuICAgICAgICB0eXBlOiBgWENVSUVsZW1lbnRUeXBlJHtlbGVtZW50LnR5cGV9YCxcbiAgICAgICAgZW5hYmxlZDogcGFyc2VJbnQoZWxlbWVudC5pc0VuYWJsZWQsIDEwKSA9PT0gMSxcbiAgICAgICAgdmlzaWJsZTogcGFyc2VJbnQoZWxlbWVudC5pc1Zpc2libGUsIDEwKSA9PT0gMSxcbiAgICAgICAgeDogcmVjdC54LFxuICAgICAgICB5OiByZWN0LnksXG4gICAgICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgICAgfSxcbiAgICAgICc+JzogW11cbiAgICB9O1xuICAgIGlmIChlbGVtZW50Lm5hbWUgIT09IG51bGwpIHtcbiAgICAgIHN1YnRyZWVbJ0AnXS5uYW1lID0gZWxlbWVudC5uYW1lO1xuICAgIH1cbiAgICBpZiAoZWxlbWVudC5sYWJlbCAhPT0gbnVsbCkge1xuICAgICAgc3VidHJlZVsnQCddLmxhYmVsID0gZWxlbWVudC5sYWJlbDtcbiAgICB9XG4gICAgaWYgKGVsZW1lbnQudmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHN1YnRyZWVbJ0AnXS52YWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgKGVsZW1lbnQuY2hpbGRyZW4gfHwgW10pLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdWJ0cmVlWyc+J10ucHVzaChnZXRUcmVlKGVsZW1lbnQuY2hpbGRyZW5baV0sIGksIGN1clBhdGgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIFtgWENVSUVsZW1lbnRUeXBlJHtlbGVtZW50LnR5cGV9YF06IHN1YnRyZWVcbiAgICB9O1xuICB9XG4gIGxldCB0cmVlID0gZ2V0VHJlZShzcmNUcmVlLCAwLCAnJyk7XG4gIHJldHVybiB0cmVlO1xufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VYbWwgKGpzb25Tb3VyY2UpIHtcbiAgcmV0dXJuIGpzMnhtbChcIkFwcGl1bUFVVFwiLCBqc29uU291cmNlLCB7XG4gICAgd3JhcEFycmF5OiB7ZW5hYmxlZDogZmFsc2UsIGVsZW1lbnROYW1lOiAnZWxlbWVudCd9LFxuICAgIGRlY2xhcmF0aW9uOiB7aW5jbHVkZTogdHJ1ZX0sXG4gICAgcHJldHR5UHJpbnRpbmc6IHtpbmRlbnRTdHJpbmc6ICcgICd9XG4gIH0pO1xufVxuXG5cbk9iamVjdC5hc3NpZ24oZXh0ZW5zaW9ucywgY29tbWFuZHMsIGhlbHBlcnMpO1xuZXhwb3J0IHsgY29tbWFuZHMsIGhlbHBlcnMgfTtcbmV4cG9ydCBkZWZhdWx0IGV4dGVuc2lvbnM7XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uLy4uIn0=
