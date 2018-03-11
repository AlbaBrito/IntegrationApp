'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

var _execute = require('./execute');

var _execute2 = _interopRequireDefault(_execute);

var _gesture = require('./gesture');

var _gesture2 = _interopRequireDefault(_gesture);

var _find = require('./find');

var _find2 = _interopRequireDefault(_find);

var _proxyHelper = require('./proxy-helper');

var _proxyHelper2 = _interopRequireDefault(_proxyHelper);

var _alert = require('./alert');

var _alert2 = _interopRequireDefault(_alert);

var _source = require('./source');

var _source2 = _interopRequireDefault(_source);

var _general = require('./general');

var _general2 = _interopRequireDefault(_general);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _web = require('./web');

var _web2 = _interopRequireDefault(_web);

var _timeouts = require('./timeouts');

var _timeouts2 = _interopRequireDefault(_timeouts);

var _navigation = require('./navigation');

var _navigation2 = _interopRequireDefault(_navigation);

var _element = require('./element');

var _element2 = _interopRequireDefault(_element);

var _fileMovement = require('./file-movement');

var _fileMovement2 = _interopRequireDefault(_fileMovement);

var _screenshots = require('./screenshots');

var _screenshots2 = _interopRequireDefault(_screenshots);

var _pasteboard = require('./pasteboard');

var _pasteboard2 = _interopRequireDefault(_pasteboard);

var _location = require('./location');

var _location2 = _interopRequireDefault(_location);

var commands = {};

_Object$assign(commands, _actions2['default'], _context2['default'], _execute2['default'], _gesture2['default'], _find2['default'], _proxyHelper2['default'], _source2['default'], _general2['default'], _log2['default'], _web2['default'], _timeouts2['default'], _navigation2['default'], _element2['default'], _fileMovement2['default'], _alert2['default'], _screenshots2['default'], _pasteboard2['default'], _location2['default']);

exports['default'] = commands;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3VCQUE0QixXQUFXOzs7O3VCQUNYLFdBQVc7Ozs7dUJBQ1QsV0FBVzs7Ozt1QkFDWCxXQUFXOzs7O29CQUNkLFFBQVE7Ozs7MkJBQ0QsZ0JBQWdCOzs7O3FCQUN0QixTQUFTOzs7O3NCQUNSLFVBQVU7Ozs7dUJBQ1QsV0FBVzs7OzttQkFDZixPQUFPOzs7O21CQUNQLE9BQU87Ozs7d0JBQ0gsWUFBWTs7OzswQkFDVCxjQUFjOzs7O3VCQUNqQixXQUFXOzs7OzRCQUNOLGlCQUFpQjs7OzsyQkFDbkIsZUFBZTs7OzswQkFDZixjQUFjOzs7O3dCQUNoQixZQUFZOzs7O0FBRzNDLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsZUFBYyxRQUFRLG9aQUk0RCxDQUFDOztxQkFFcEUsUUFBUSIsImZpbGUiOiJsaWIvY29tbWFuZHMvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYWN0aW9uc0NvbW1hbmRzIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgY29udGV4dENvbW1hbmRzIGZyb20gJy4vY29udGV4dCc7XG5pbXBvcnQgZXhlY3V0ZUV4dGVuc2lvbnMgZnJvbSAnLi9leGVjdXRlJztcbmltcG9ydCBnZXN0dXJlRXh0ZW5zaW9ucyBmcm9tICcuL2dlc3R1cmUnO1xuaW1wb3J0IGZpbmRFeHRlbnNpb25zIGZyb20gJy4vZmluZCc7XG5pbXBvcnQgcHJveHlIZWxwZXJFeHRlbnNpb25zIGZyb20gJy4vcHJveHktaGVscGVyJztcbmltcG9ydCBhbGVydEV4dGVuc2lvbnMgZnJvbSAnLi9hbGVydCc7XG5pbXBvcnQgc291cmNlRXh0ZW5zaW9ucyBmcm9tICcuL3NvdXJjZSc7XG5pbXBvcnQgZ2VuZXJhbEV4dGVuc2lvbnMgZnJvbSAnLi9nZW5lcmFsJztcbmltcG9ydCBsb2dFeHRlbnNpb25zIGZyb20gJy4vbG9nJztcbmltcG9ydCB3ZWJFeHRlbnNpb25zIGZyb20gJy4vd2ViJztcbmltcG9ydCB0aW1lb3V0RXh0ZW5zaW9ucyBmcm9tICcuL3RpbWVvdXRzJztcbmltcG9ydCBuYXZpZ2F0aW9uRXh0ZW5zaW9ucyBmcm9tICcuL25hdmlnYXRpb24nO1xuaW1wb3J0IGVsZW1lbnRFeHRlbnNpb25zIGZyb20gJy4vZWxlbWVudCc7XG5pbXBvcnQgZmlsZU1vdmVtZW50RXh0ZW5zaW9ucyBmcm9tICcuL2ZpbGUtbW92ZW1lbnQnO1xuaW1wb3J0IHNjcmVlbnNob3RFeHRlbnNpb25zIGZyb20gJy4vc2NyZWVuc2hvdHMnO1xuaW1wb3J0IHBhc3RlYm9hcmRFeHRlbnNpb25zIGZyb20gJy4vcGFzdGVib2FyZCc7XG5pbXBvcnQgbG9jYXRpb25FeHRlbnNpb25zIGZyb20gJy4vbG9jYXRpb24nO1xuXG5cbmxldCBjb21tYW5kcyA9IHt9O1xuXG5PYmplY3QuYXNzaWduKGNvbW1hbmRzLCBhY3Rpb25zQ29tbWFuZHMsIGNvbnRleHRDb21tYW5kcywgZXhlY3V0ZUV4dGVuc2lvbnMsXG4gIGdlc3R1cmVFeHRlbnNpb25zLCBmaW5kRXh0ZW5zaW9ucywgcHJveHlIZWxwZXJFeHRlbnNpb25zLCBzb3VyY2VFeHRlbnNpb25zLFxuICBnZW5lcmFsRXh0ZW5zaW9ucywgbG9nRXh0ZW5zaW9ucywgd2ViRXh0ZW5zaW9ucywgdGltZW91dEV4dGVuc2lvbnMsXG4gIG5hdmlnYXRpb25FeHRlbnNpb25zLCBlbGVtZW50RXh0ZW5zaW9ucywgZmlsZU1vdmVtZW50RXh0ZW5zaW9ucyxcbiAgYWxlcnRFeHRlbnNpb25zLCBzY3JlZW5zaG90RXh0ZW5zaW9ucywgcGFzdGVib2FyZEV4dGVuc2lvbnMsIGxvY2F0aW9uRXh0ZW5zaW9ucyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbW1hbmRzO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLi8uLiJ9
