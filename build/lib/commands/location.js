'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _teen_process = require('teen_process');

var _appiumSupport = require('appium-support');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var commands = {};

commands.setGeoLocation = function callee$0$0(location) {
  var latitude, longitude;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        latitude = location.latitude;
        longitude = location.longitude;

        if (!_appiumSupport.util.hasValue(latitude) || !_appiumSupport.util.hasValue(longitude)) {
          _logger2['default'].errorAndThrow('Both latitude and longitude should be set');
        }

        if (!this.isRealDevice()) {
          context$1$0.next = 18;
          break;
        }

        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.which('idevicelocation'));

      case 6:
        if (context$1$0.sent) {
          context$1$0.next = 8;
          break;
        }

        _logger2['default'].errorAndThrow('idevicelocation doesn\'t exist on the host');

      case 8:
        context$1$0.prev = 8;
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('idevicelocation', ['-u', this.opts.udid, '' + latitude, '' + longitude]));

      case 11:
        context$1$0.next = 16;
        break;

      case 13:
        context$1$0.prev = 13;
        context$1$0.t0 = context$1$0['catch'](8);
        throw new Error('Can\'t set the location on device \'' + this.opts.udid + '\'. Original error: ' + context$1$0.t0.message);

      case 16:
        context$1$0.next = 20;
        break;

      case 18:
        context$1$0.next = 20;
        return _regeneratorRuntime.awrap(this.opts.device.setGeolocation('' + latitude, '' + longitude));

      case 20:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[8, 13]]);
};

exports.commands = commands;
exports['default'] = commands;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9sb2NhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzRCQUFxQixjQUFjOzs2QkFDVixnQkFBZ0I7O3NCQUN6QixXQUFXOzs7O0FBRTNCLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsUUFBUSxDQUFDLGNBQWMsR0FBRyxvQkFBZ0IsUUFBUTtNQUMzQyxRQUFRLEVBQUUsU0FBUzs7OztBQUFuQixnQkFBUSxHQUFlLFFBQVEsQ0FBL0IsUUFBUTtBQUFFLGlCQUFTLEdBQUksUUFBUSxDQUFyQixTQUFTOztBQUV4QixZQUFJLENBQUMsb0JBQUssUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsb0JBQUssUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQ3pELDhCQUFJLGFBQWEsNkNBQTZDLENBQUM7U0FDaEU7O2FBRUcsSUFBSSxDQUFDLFlBQVksRUFBRTs7Ozs7O3lDQUNULGtCQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQzs7Ozs7Ozs7QUFDckMsNEJBQUksYUFBYSw4Q0FBNkMsQ0FBQzs7Ozs7eUNBR3pELHdCQUFLLGlCQUFpQixFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFLLFFBQVEsT0FBTyxTQUFTLENBQUcsQ0FBQzs7Ozs7Ozs7O2NBRTlFLElBQUksS0FBSywwQ0FBc0MsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLDRCQUFzQixlQUFFLE9BQU8sQ0FBRzs7Ozs7Ozs7eUNBR2pHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsTUFBSSxRQUFRLE9BQU8sU0FBUyxDQUFHOzs7Ozs7O0NBRXZFLENBQUM7O1FBRU8sUUFBUSxHQUFSLFFBQVE7cUJBQ0YsUUFBUSIsImZpbGUiOiJsaWIvY29tbWFuZHMvbG9jYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleGVjIH0gZnJvbSAndGVlbl9wcm9jZXNzJztcbmltcG9ydCB7IGZzLCB1dGlsIH0gZnJvbSAnYXBwaXVtLXN1cHBvcnQnO1xuaW1wb3J0IGxvZyBmcm9tICcuLi9sb2dnZXInO1xuXG5sZXQgY29tbWFuZHMgPSB7fTtcblxuY29tbWFuZHMuc2V0R2VvTG9jYXRpb24gPSBhc3luYyBmdW5jdGlvbiAobG9jYXRpb24pIHtcbiAgbGV0IHtsYXRpdHVkZSwgbG9uZ2l0dWRlfSA9IGxvY2F0aW9uO1xuXG4gIGlmICghdXRpbC5oYXNWYWx1ZShsYXRpdHVkZSkgfHwgIXV0aWwuaGFzVmFsdWUobG9uZ2l0dWRlKSkge1xuICAgIGxvZy5lcnJvckFuZFRocm93KGBCb3RoIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgc2hvdWxkIGJlIHNldGApO1xuICB9XG5cbiAgaWYgKHRoaXMuaXNSZWFsRGV2aWNlKCkpIHtcbiAgICBpZiAoIShhd2FpdCBmcy53aGljaCgnaWRldmljZWxvY2F0aW9uJykpKSB7XG4gICAgICBsb2cuZXJyb3JBbmRUaHJvdyhgaWRldmljZWxvY2F0aW9uIGRvZXNuJ3QgZXhpc3Qgb24gdGhlIGhvc3RgKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGV4ZWMoJ2lkZXZpY2Vsb2NhdGlvbicsIFsnLXUnLCB0aGlzLm9wdHMudWRpZCwgYCR7bGF0aXR1ZGV9YCwgYCR7bG9uZ2l0dWRlfWBdKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbid0IHNldCB0aGUgbG9jYXRpb24gb24gZGV2aWNlICcke3RoaXMub3B0cy51ZGlkfScuIE9yaWdpbmFsIGVycm9yOiAke2UubWVzc2FnZX1gKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgdGhpcy5vcHRzLmRldmljZS5zZXRHZW9sb2NhdGlvbihgJHtsYXRpdHVkZX1gLCBgJHtsb25naXR1ZGV9YCk7XG4gIH1cbn07XG5cbmV4cG9ydCB7IGNvbW1hbmRzIH07XG5leHBvcnQgZGVmYXVsdCBjb21tYW5kcztcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4vLi4ifQ==
