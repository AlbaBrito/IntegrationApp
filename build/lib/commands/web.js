'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _appiumIosDriver = require('appium-ios-driver');

var _asyncbox = require('asyncbox');

var _appiumSupport = require('appium-support');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var EXTRA_WEB_COORD_SCROLL_OFFSET = -10;
var IPHONE_WEB_COORD_OFFSET = -10;
var IPHONE_WEB_COORD_SMART_APP_BANNER_OFFSET = 84;
var IPAD_WEB_COORD_OFFSET = 10;
var IPAD_WEB_COORD_SMART_APP_BANNER_OFFSET = 95;

var extensions = {};

_Object$assign(extensions, _appiumIosDriver.iosCommands.web);

var getSafariIsIphone = _lodash2['default'].memoize(function getSafariIsIphone(sessionId, driver) {
  var isIphone, useragent;
  return _regeneratorRuntime.async(function getSafariIsIphone$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        isIphone = true;
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(driver.execute('return navigator.userAgent'));

      case 4:
        useragent = context$1$0.sent;

        isIphone = useragent.toLowerCase().includes('iphone');
        context$1$0.next = 12;
        break;

      case 8:
        context$1$0.prev = 8;
        context$1$0.t0 = context$1$0['catch'](1);

        _logger2['default'].warn('Unable to find device type from useragent. Assuming iPhone');
        _logger2['default'].debug('Error: ' + context$1$0.t0.message);

      case 12:
        return context$1$0.abrupt('return', isIphone);

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 8]]);
});

extensions.getElementHeightMemoized = _lodash2['default'].memoize(function callee$0$0(key, el) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        el = _appiumSupport.util.unwrapElement(el);
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.getNativeRect(el));

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent.height);

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
});

extensions.getExtraTranslateWebCoordsOffset = function callee$0$0() {
  var offset, implicitWaitMs, el;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        offset = 0;
        implicitWaitMs = this.implicitWaitMs;
        context$1$0.prev = 2;

        this.setImplicitWait(0);

        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('accessibility id', 'ReloadButton', false));

      case 6:
        context$1$0.next = 22;
        break;

      case 8:
        context$1$0.prev = 8;
        context$1$0.t0 = context$1$0['catch'](2);
        context$1$0.prev = 10;
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('accessibility id', 'URL', false));

      case 13:
        el = context$1$0.sent;
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(this.getElementHeightMemoized('URLBar', el));

      case 16:
        offset -= context$1$0.sent;
        context$1$0.next = 21;
        break;

      case 19:
        context$1$0.prev = 19;
        context$1$0.t1 = context$1$0['catch'](10);

      case 21:
        // no URL elements found, so continue

        // when scrolling has happened, there is a tick more offset needed
        offset += EXTRA_WEB_COORD_SCROLL_OFFSET;

      case 22:
        context$1$0.prev = 22;

        // return implicit wait to what it was
        this.setImplicitWait(implicitWaitMs);
        return context$1$0.finish(22);

      case 25:
        context$1$0.next = 27;
        return _regeneratorRuntime.awrap(getSafariIsIphone(this.opts.sessionId, this));

      case 27:
        if (!context$1$0.sent) {
          context$1$0.next = 31;
          break;
        }

        context$1$0.t2 = IPHONE_WEB_COORD_OFFSET;
        context$1$0.next = 32;
        break;

      case 31:
        context$1$0.t2 = IPAD_WEB_COORD_OFFSET;

      case 32:
        offset += context$1$0.t2;

        _logger2['default'].debug('Extra translated web coordinates offset: ' + offset);
        return context$1$0.abrupt('return', offset);

      case 35:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[2, 8, 22, 25], [10, 19]]);
};

extensions.getExtraNativeWebTapOffset = function callee$0$0() {
  var offset, implicitWaitMs, el;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        offset = 0;
        implicitWaitMs = this.implicitWaitMs;
        context$1$0.prev = 2;

        this.setImplicitWait(0);

        // first try to get tab offset
        context$1$0.prev = 4;
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('-ios predicate string', 'name LIKE \'*, Tab\' AND visible = 1', false));

      case 7:
        el = context$1$0.sent;
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(this.getElementHeightMemoized('TabBar', el));

      case 10:
        offset += context$1$0.sent;
        context$1$0.next = 15;
        break;

      case 13:
        context$1$0.prev = 13;
        context$1$0.t0 = context$1$0['catch'](4);

      case 15:
        context$1$0.prev = 15;
        context$1$0.next = 18;
        return _regeneratorRuntime.awrap(this.findNativeElementOrElements('accessibility id', 'Close app download offer', false));

      case 18:
        context$1$0.next = 20;
        return _regeneratorRuntime.awrap(getSafariIsIphone(this.opts.sessionId, this));

      case 20:
        if (!context$1$0.sent) {
          context$1$0.next = 24;
          break;
        }

        context$1$0.t1 = IPHONE_WEB_COORD_SMART_APP_BANNER_OFFSET;
        context$1$0.next = 25;
        break;

      case 24:
        context$1$0.t1 = IPAD_WEB_COORD_SMART_APP_BANNER_OFFSET;

      case 25:
        offset += context$1$0.t1;
        context$1$0.next = 30;
        break;

      case 28:
        context$1$0.prev = 28;
        context$1$0.t2 = context$1$0['catch'](15);

      case 30:
        context$1$0.prev = 30;

        // return implicit wait to what it was
        this.setImplicitWait(implicitWaitMs);
        return context$1$0.finish(30);

      case 33:

        _logger2['default'].debug('Additional native web tap offset computed: ' + offset);
        return context$1$0.abrupt('return', offset);

      case 35:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[2,, 30, 33], [4, 13], [15, 28]]);
};

extensions.nativeWebTap = function callee$0$0(el) {
  var atomsElement, _ref, x, y, _ref2, width, height;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        atomsElement = this.useAtomsElement(el);
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.executeAtom('get_top_left_coordinates', [atomsElement]));

      case 3:
        _ref = context$1$0.sent;
        x = _ref.x;
        y = _ref.y;
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.executeAtom('get_size', [atomsElement]));

      case 8:
        _ref2 = context$1$0.sent;
        width = _ref2.width;
        height = _ref2.height;

        x = x + width / 2;
        y = y + height / 2;

        this.curWebCoords = { x: x, y: y };
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(this.clickWebCoords());

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

extensions.clickCoords = function callee$0$0(coords) {
  var x, y;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        x = coords.x;
        y = coords.y;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.proxyCommand('/wda/tap/nil', 'POST', { x: x, y: y }));

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

extensions.translateWebCoords = function callee$0$0(coords) {
  var yOffset, webview, rect, wvPos, realDims, cmd, wvDims, urlBarHeight, realDimensionHeight, xRatio, yRatio, newCoords;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug('Translating coordinates (' + JSON.stringify(coords) + ') to web coordinates');

        // add static offset for safari in landscape mode
        yOffset = this.opts.curOrientation === 'LANDSCAPE' ? this.landscapeWebCoordsOffset : 0;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.getExtraNativeWebTapOffset());

      case 4:
        yOffset += context$1$0.sent;
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.getExtraTranslateWebCoordsOffset());

      case 7:
        coords.y += context$1$0.sent;
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(5, 100, function callee$1$0() {
          var implicitWaitMs;
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                implicitWaitMs = this.implicitWaitMs;
                context$2$0.prev = 1;

                this.setImplicitWait(0);
                context$2$0.next = 5;
                return _regeneratorRuntime.awrap(this.findNativeElementOrElements('-ios predicate string', 'type = \'XCUIElementTypeWebView\' AND visible = 1', false));

              case 5:
                return context$2$0.abrupt('return', context$2$0.sent);

              case 6:
                context$2$0.prev = 6;

                this.setImplicitWait(implicitWaitMs);
                return context$2$0.finish(6);

              case 9:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this, [[1,, 6, 9]]);
        }));

      case 10:
        webview = context$1$0.sent;

        webview = _appiumSupport.util.unwrapElement(webview);
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(this.proxyCommand('/element/' + webview + '/rect', 'GET'));

      case 14:
        rect = context$1$0.sent;
        wvPos = { x: rect.x, y: rect.y };
        realDims = { w: rect.width, h: rect.height };
        cmd = '(function () { return {w: document.documentElement.clientWidth, h: document.documentElement.clientHeight}; })()';
        context$1$0.next = 20;
        return _regeneratorRuntime.awrap(this.remote.execute(cmd));

      case 20:
        wvDims = context$1$0.sent;
        urlBarHeight = 64;

        wvPos.y += urlBarHeight;

        realDimensionHeight = 108;

        realDims.h -= realDimensionHeight;

        if (!(wvDims && realDims && wvPos)) {
          context$1$0.next = 39;
          break;
        }

        xRatio = realDims.w / wvDims.w;
        yRatio = realDims.h / wvDims.h;
        newCoords = {
          x: wvPos.x + Math.round(xRatio * coords.x),
          y: wvPos.y + yOffset + Math.round(yRatio * coords.y)
        };

        // additional logging for coordinates, since it is sometimes broken
        //   see https://github.com/appium/appium/issues/9159
        _logger2['default'].debug('Converted coordinates: ' + JSON.stringify(newCoords));
        _logger2['default'].debug('    rect: ' + JSON.stringify(rect));
        _logger2['default'].debug('    wvPos: ' + JSON.stringify(wvPos));
        _logger2['default'].debug('    realDims: ' + JSON.stringify(realDims));
        _logger2['default'].debug('    wvDims: ' + JSON.stringify(wvDims));
        _logger2['default'].debug('    xRatio: ' + JSON.stringify(xRatio));
        _logger2['default'].debug('    yRatio: ' + JSON.stringify(yRatio));
        _logger2['default'].debug('    yOffset: ' + JSON.stringify(yOffset));

        _logger2['default'].debug('Converted web coords ' + JSON.stringify(coords) + ' ' + ('into real coords ' + JSON.stringify(newCoords)));
        return context$1$0.abrupt('return', newCoords);

      case 39:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

extensions.checkForAlert = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        return context$1$0.abrupt('return', false);

      case 1:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

extensions.waitForAtom = function callee$0$0(promise) {
  var res, msg;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        res = null;
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(promise);

      case 4:
        res = context$1$0.sent;
        context$1$0.next = 11;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](1);
        msg = _lodash2['default'].isString(context$1$0.t0.message) ? context$1$0.t0.message : JSON.stringify(context$1$0.t0.message);
        throw new Error('Error while executing atom: ' + msg);

      case 11:
        return context$1$0.abrupt('return', this.parseExecuteResponse(res));

      case 12:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 7]]);
};

exports['default'] = extensions;
module.exports = exports['default'];

// sessionId parameter is for memoizing per session

// keep track of implicit wait, and set locally to 0

// try to see if there has been scrolling

// reload button found, which means scrolling has not happened

// no reload button, which indicates scrolling has happened

// extra offset necessary (where do these come from? they just work)

// keep track of implicit wait, and set locally to 0

// no element found, so no tabs and no need to deal with offset

// next try to see if there is an Smart App Banner

// no smart app banner found, so continue

// tap on absolute coordinates

// add extra offset for possible extra things in the top of the page

// absolutize web coords

// TODO: investigate where these come from. They appear to be constants in my tests

// TODO: Add check for alert and accept/dismiss it as per autoAcceptAlert capability
//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFJLEtBQUssa0NBQWdDLEdBQUcsQ0FBRzs7OzRDQUVoRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDOzs7Ozs7O0NBQ3RDLENBQUM7O3FCQUVhLFVBQVUiLCJmaWxlIjoibGliL2NvbW1hbmRzL3dlYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlvc0NvbW1hbmRzIH0gZnJvbSAnYXBwaXVtLWlvcy1kcml2ZXInO1xuaW1wb3J0IHsgcmV0cnlJbnRlcnZhbCB9IGZyb20gJ2FzeW5jYm94JztcbmltcG9ydCB7IHV0aWwgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5pbXBvcnQgbG9nIGZyb20gJy4uL2xvZ2dlcic7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5cbmNvbnN0IEVYVFJBX1dFQl9DT09SRF9TQ1JPTExfT0ZGU0VUID0gLTEwO1xuY29uc3QgSVBIT05FX1dFQl9DT09SRF9PRkZTRVQgPSAtMTA7XG5jb25zdCBJUEhPTkVfV0VCX0NPT1JEX1NNQVJUX0FQUF9CQU5ORVJfT0ZGU0VUID0gODQ7XG5jb25zdCBJUEFEX1dFQl9DT09SRF9PRkZTRVQgPSAxMDtcbmNvbnN0IElQQURfV0VCX0NPT1JEX1NNQVJUX0FQUF9CQU5ORVJfT0ZGU0VUID0gOTU7XG5cbmxldCBleHRlbnNpb25zID0ge307XG5cbk9iamVjdC5hc3NpZ24oZXh0ZW5zaW9ucywgaW9zQ29tbWFuZHMud2ViKTtcblxuY29uc3QgZ2V0U2FmYXJpSXNJcGhvbmUgPSBfLm1lbW9pemUoYXN5bmMgZnVuY3Rpb24gZ2V0U2FmYXJpSXNJcGhvbmUgKHNlc3Npb25JZCwgZHJpdmVyKSB7XG4gIC8vIHNlc3Npb25JZCBwYXJhbWV0ZXIgaXMgZm9yIG1lbW9pemluZyBwZXIgc2Vzc2lvblxuICBsZXQgaXNJcGhvbmUgPSB0cnVlO1xuICB0cnkge1xuICAgIGNvbnN0IHVzZXJhZ2VudCA9IGF3YWl0IGRyaXZlci5leGVjdXRlKCdyZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudCcpO1xuICAgIGlzSXBob25lID0gdXNlcmFnZW50LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2lwaG9uZScpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBsb2cud2FybihgVW5hYmxlIHRvIGZpbmQgZGV2aWNlIHR5cGUgZnJvbSB1c2VyYWdlbnQuIEFzc3VtaW5nIGlQaG9uZWApO1xuICAgIGxvZy5kZWJ1ZyhgRXJyb3I6ICR7ZXJyLm1lc3NhZ2V9YCk7XG4gIH1cbiAgcmV0dXJuIGlzSXBob25lO1xufSk7XG5cbmV4dGVuc2lvbnMuZ2V0RWxlbWVudEhlaWdodE1lbW9pemVkID0gXy5tZW1vaXplKGFzeW5jIGZ1bmN0aW9uIChrZXksIGVsKSB7XG4gIGVsID0gdXRpbC51bndyYXBFbGVtZW50KGVsKTtcbiAgcmV0dXJuIChhd2FpdCB0aGlzLmdldE5hdGl2ZVJlY3QoZWwpKS5oZWlnaHQ7XG59KTtcblxuZXh0ZW5zaW9ucy5nZXRFeHRyYVRyYW5zbGF0ZVdlYkNvb3Jkc09mZnNldCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgbGV0IG9mZnNldCA9IDA7XG5cbiAgLy8ga2VlcCB0cmFjayBvZiBpbXBsaWNpdCB3YWl0LCBhbmQgc2V0IGxvY2FsbHkgdG8gMFxuICBjb25zdCBpbXBsaWNpdFdhaXRNcyA9IHRoaXMuaW1wbGljaXRXYWl0TXM7XG5cbiAgLy8gdHJ5IHRvIHNlZSBpZiB0aGVyZSBoYXMgYmVlbiBzY3JvbGxpbmdcbiAgdHJ5IHtcbiAgICB0aGlzLnNldEltcGxpY2l0V2FpdCgwKTtcblxuICAgIGF3YWl0IHRoaXMuZmluZE5hdGl2ZUVsZW1lbnRPckVsZW1lbnRzKCdhY2Nlc3NpYmlsaXR5IGlkJywgJ1JlbG9hZEJ1dHRvbicsIGZhbHNlKTtcbiAgICAvLyByZWxvYWQgYnV0dG9uIGZvdW5kLCB3aGljaCBtZWFucyBzY3JvbGxpbmcgaGFzIG5vdCBoYXBwZW5lZFxuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBubyByZWxvYWQgYnV0dG9uLCB3aGljaCBpbmRpY2F0ZXMgc2Nyb2xsaW5nIGhhcyBoYXBwZW5lZFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBlbCA9IGF3YWl0IHRoaXMuZmluZE5hdGl2ZUVsZW1lbnRPckVsZW1lbnRzKCdhY2Nlc3NpYmlsaXR5IGlkJywgJ1VSTCcsIGZhbHNlKTtcbiAgICAgIG9mZnNldCAtPSBhd2FpdCB0aGlzLmdldEVsZW1lbnRIZWlnaHRNZW1vaXplZCgnVVJMQmFyJywgZWwpO1xuICAgIH0gY2F0Y2ggKGlnbikge1xuICAgICAgLy8gbm8gVVJMIGVsZW1lbnRzIGZvdW5kLCBzbyBjb250aW51ZVxuICAgIH1cblxuICAgIC8vIHdoZW4gc2Nyb2xsaW5nIGhhcyBoYXBwZW5lZCwgdGhlcmUgaXMgYSB0aWNrIG1vcmUgb2Zmc2V0IG5lZWRlZFxuICAgIG9mZnNldCArPSBFWFRSQV9XRUJfQ09PUkRfU0NST0xMX09GRlNFVDtcbiAgfSBmaW5hbGx5IHtcbiAgICAvLyByZXR1cm4gaW1wbGljaXQgd2FpdCB0byB3aGF0IGl0IHdhc1xuICAgIHRoaXMuc2V0SW1wbGljaXRXYWl0KGltcGxpY2l0V2FpdE1zKTtcbiAgfVxuXG4gIC8vIGV4dHJhIG9mZnNldCBuZWNlc3NhcnkgKHdoZXJlIGRvIHRoZXNlIGNvbWUgZnJvbT8gdGhleSBqdXN0IHdvcmspXG4gIG9mZnNldCArPSBhd2FpdCBnZXRTYWZhcmlJc0lwaG9uZSh0aGlzLm9wdHMuc2Vzc2lvbklkLCB0aGlzKSA/XG4gICAgSVBIT05FX1dFQl9DT09SRF9PRkZTRVQgOlxuICAgIElQQURfV0VCX0NPT1JEX09GRlNFVDtcblxuICBsb2cuZGVidWcoYEV4dHJhIHRyYW5zbGF0ZWQgd2ViIGNvb3JkaW5hdGVzIG9mZnNldDogJHtvZmZzZXR9YCk7XG4gIHJldHVybiBvZmZzZXQ7XG59O1xuXG5leHRlbnNpb25zLmdldEV4dHJhTmF0aXZlV2ViVGFwT2Zmc2V0ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICBsZXQgb2Zmc2V0ID0gMDtcblxuICAvLyBrZWVwIHRyYWNrIG9mIGltcGxpY2l0IHdhaXQsIGFuZCBzZXQgbG9jYWxseSB0byAwXG4gIGNvbnN0IGltcGxpY2l0V2FpdE1zID0gdGhpcy5pbXBsaWNpdFdhaXRNcztcbiAgdHJ5IHtcbiAgICB0aGlzLnNldEltcGxpY2l0V2FpdCgwKTtcblxuICAgIC8vIGZpcnN0IHRyeSB0byBnZXQgdGFiIG9mZnNldFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBlbCA9IGF3YWl0IHRoaXMuZmluZE5hdGl2ZUVsZW1lbnRPckVsZW1lbnRzKCctaW9zIHByZWRpY2F0ZSBzdHJpbmcnLCBgbmFtZSBMSUtFICcqLCBUYWInIEFORCB2aXNpYmxlID0gMWAsIGZhbHNlKTtcbiAgICAgIG9mZnNldCArPSBhd2FpdCB0aGlzLmdldEVsZW1lbnRIZWlnaHRNZW1vaXplZCgnVGFiQmFyJywgZWwpO1xuICAgIH0gY2F0Y2ggKGlnbikge1xuICAgICAgLy8gbm8gZWxlbWVudCBmb3VuZCwgc28gbm8gdGFicyBhbmQgbm8gbmVlZCB0byBkZWFsIHdpdGggb2Zmc2V0XG4gICAgfVxuXG4gICAgLy8gbmV4dCB0cnkgdG8gc2VlIGlmIHRoZXJlIGlzIGFuIFNtYXJ0IEFwcCBCYW5uZXJcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5maW5kTmF0aXZlRWxlbWVudE9yRWxlbWVudHMoJ2FjY2Vzc2liaWxpdHkgaWQnLCAnQ2xvc2UgYXBwIGRvd25sb2FkIG9mZmVyJywgZmFsc2UpO1xuICAgICAgb2Zmc2V0ICs9IGF3YWl0IGdldFNhZmFyaUlzSXBob25lKHRoaXMub3B0cy5zZXNzaW9uSWQsIHRoaXMpID9cbiAgICAgICAgSVBIT05FX1dFQl9DT09SRF9TTUFSVF9BUFBfQkFOTkVSX09GRlNFVCA6XG4gICAgICAgIElQQURfV0VCX0NPT1JEX1NNQVJUX0FQUF9CQU5ORVJfT0ZGU0VUO1xuICAgIH0gY2F0Y2ggKGlnbikge1xuICAgICAgLy8gbm8gc21hcnQgYXBwIGJhbm5lciBmb3VuZCwgc28gY29udGludWVcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgLy8gcmV0dXJuIGltcGxpY2l0IHdhaXQgdG8gd2hhdCBpdCB3YXNcbiAgICB0aGlzLnNldEltcGxpY2l0V2FpdChpbXBsaWNpdFdhaXRNcyk7XG4gIH1cblxuICBsb2cuZGVidWcoYEFkZGl0aW9uYWwgbmF0aXZlIHdlYiB0YXAgb2Zmc2V0IGNvbXB1dGVkOiAke29mZnNldH1gKTtcbiAgcmV0dXJuIG9mZnNldDtcbn07XG5cbmV4dGVuc2lvbnMubmF0aXZlV2ViVGFwID0gYXN5bmMgZnVuY3Rpb24gKGVsKSB7XG4gIGxldCBhdG9tc0VsZW1lbnQgPSB0aGlzLnVzZUF0b21zRWxlbWVudChlbCk7XG4gIGxldCB7eCwgeX0gPSBhd2FpdCB0aGlzLmV4ZWN1dGVBdG9tKCdnZXRfdG9wX2xlZnRfY29vcmRpbmF0ZXMnLCBbYXRvbXNFbGVtZW50XSk7XG4gIGxldCB7d2lkdGgsIGhlaWdodH0gPSBhd2FpdCB0aGlzLmV4ZWN1dGVBdG9tKCdnZXRfc2l6ZScsIFthdG9tc0VsZW1lbnRdKTtcbiAgeCA9IHggKyAod2lkdGggLyAyKTtcbiAgeSA9IHkgKyAoaGVpZ2h0IC8gMik7XG5cbiAgdGhpcy5jdXJXZWJDb29yZHMgPSB7eCwgeX07XG4gIGF3YWl0IHRoaXMuY2xpY2tXZWJDb29yZHMoKTtcbn07XG5cbmV4dGVuc2lvbnMuY2xpY2tDb29yZHMgPSBhc3luYyBmdW5jdGlvbiAoY29vcmRzKSB7XG4gIGxldCB7eCwgeX0gPSBjb29yZHM7XG5cbiAgLy8gdGFwIG9uIGFic29sdXRlIGNvb3JkaW5hdGVzXG4gIGF3YWl0IHRoaXMucHJveHlDb21tYW5kKCcvd2RhL3RhcC9uaWwnLCAnUE9TVCcsIHt4LCB5fSk7XG59O1xuXG5leHRlbnNpb25zLnRyYW5zbGF0ZVdlYkNvb3JkcyA9IGFzeW5jIGZ1bmN0aW9uIChjb29yZHMpIHtcbiAgbG9nLmRlYnVnKGBUcmFuc2xhdGluZyBjb29yZGluYXRlcyAoJHtKU09OLnN0cmluZ2lmeShjb29yZHMpfSkgdG8gd2ViIGNvb3JkaW5hdGVzYCk7XG5cbiAgLy8gYWRkIHN0YXRpYyBvZmZzZXQgZm9yIHNhZmFyaSBpbiBsYW5kc2NhcGUgbW9kZVxuICBsZXQgeU9mZnNldCA9IHRoaXMub3B0cy5jdXJPcmllbnRhdGlvbiA9PT0gJ0xBTkRTQ0FQRScgPyB0aGlzLmxhbmRzY2FwZVdlYkNvb3Jkc09mZnNldCA6IDA7XG5cbiAgLy8gYWRkIGV4dHJhIG9mZnNldCBmb3IgcG9zc2libGUgZXh0cmEgdGhpbmdzIGluIHRoZSB0b3Agb2YgdGhlIHBhZ2VcbiAgeU9mZnNldCArPSBhd2FpdCB0aGlzLmdldEV4dHJhTmF0aXZlV2ViVGFwT2Zmc2V0KCk7XG4gIGNvb3Jkcy55ICs9IGF3YWl0IHRoaXMuZ2V0RXh0cmFUcmFuc2xhdGVXZWJDb29yZHNPZmZzZXQoKTtcblxuICAvLyBhYnNvbHV0aXplIHdlYiBjb29yZHNcbiAgbGV0IHdlYnZpZXcgPSBhd2FpdCByZXRyeUludGVydmFsKDUsIDEwMCwgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGltcGxpY2l0V2FpdE1zID0gdGhpcy5pbXBsaWNpdFdhaXRNcztcbiAgICB0cnkge1xuICAgICAgdGhpcy5zZXRJbXBsaWNpdFdhaXQoMCk7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5maW5kTmF0aXZlRWxlbWVudE9yRWxlbWVudHMoJy1pb3MgcHJlZGljYXRlIHN0cmluZycsIGB0eXBlID0gJ1hDVUlFbGVtZW50VHlwZVdlYlZpZXcnIEFORCB2aXNpYmxlID0gMWAsIGZhbHNlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5zZXRJbXBsaWNpdFdhaXQoaW1wbGljaXRXYWl0TXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2VidmlldyA9IHV0aWwudW53cmFwRWxlbWVudCh3ZWJ2aWV3KTtcbiAgbGV0IHJlY3QgPSBhd2FpdCB0aGlzLnByb3h5Q29tbWFuZChgL2VsZW1lbnQvJHt3ZWJ2aWV3fS9yZWN0YCwgJ0dFVCcpO1xuICBsZXQgd3ZQb3MgPSB7eDogcmVjdC54LCB5OiByZWN0Lnl9O1xuICBsZXQgcmVhbERpbXMgPSB7dzogcmVjdC53aWR0aCwgaDogcmVjdC5oZWlnaHR9O1xuXG4gIGxldCBjbWQgPSAnKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHt3OiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIGg6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHR9OyB9KSgpJztcbiAgbGV0IHd2RGltcyA9IGF3YWl0IHRoaXMucmVtb3RlLmV4ZWN1dGUoY21kKTtcblxuICAvLyBUT0RPOiBpbnZlc3RpZ2F0ZSB3aGVyZSB0aGVzZSBjb21lIGZyb20uIFRoZXkgYXBwZWFyIHRvIGJlIGNvbnN0YW50cyBpbiBteSB0ZXN0c1xuICBsZXQgdXJsQmFySGVpZ2h0ID0gNjQ7XG4gIHd2UG9zLnkgKz0gdXJsQmFySGVpZ2h0O1xuXG4gIGxldCByZWFsRGltZW5zaW9uSGVpZ2h0ID0gMTA4O1xuICByZWFsRGltcy5oIC09IHJlYWxEaW1lbnNpb25IZWlnaHQ7XG5cbiAgaWYgKHd2RGltcyAmJiByZWFsRGltcyAmJiB3dlBvcykge1xuICAgIGxldCB4UmF0aW8gPSByZWFsRGltcy53IC8gd3ZEaW1zLnc7XG4gICAgbGV0IHlSYXRpbyA9IHJlYWxEaW1zLmggLyB3dkRpbXMuaDtcbiAgICBsZXQgbmV3Q29vcmRzID0ge1xuICAgICAgeDogd3ZQb3MueCArIE1hdGgucm91bmQoeFJhdGlvICogY29vcmRzLngpLFxuICAgICAgeTogd3ZQb3MueSArIHlPZmZzZXQgKyBNYXRoLnJvdW5kKHlSYXRpbyAqIGNvb3Jkcy55KSxcbiAgICB9O1xuXG4gICAgLy8gYWRkaXRpb25hbCBsb2dnaW5nIGZvciBjb29yZGluYXRlcywgc2luY2UgaXQgaXMgc29tZXRpbWVzIGJyb2tlblxuICAgIC8vICAgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hcHBpdW0vYXBwaXVtL2lzc3Vlcy85MTU5XG4gICAgbG9nLmRlYnVnKGBDb252ZXJ0ZWQgY29vcmRpbmF0ZXM6ICR7SlNPTi5zdHJpbmdpZnkobmV3Q29vcmRzKX1gKTtcbiAgICBsb2cuZGVidWcoYCAgICByZWN0OiAke0pTT04uc3RyaW5naWZ5KHJlY3QpfWApO1xuICAgIGxvZy5kZWJ1ZyhgICAgIHd2UG9zOiAke0pTT04uc3RyaW5naWZ5KHd2UG9zKX1gKTtcbiAgICBsb2cuZGVidWcoYCAgICByZWFsRGltczogJHtKU09OLnN0cmluZ2lmeShyZWFsRGltcyl9YCk7XG4gICAgbG9nLmRlYnVnKGAgICAgd3ZEaW1zOiAke0pTT04uc3RyaW5naWZ5KHd2RGltcyl9YCk7XG4gICAgbG9nLmRlYnVnKGAgICAgeFJhdGlvOiAke0pTT04uc3RyaW5naWZ5KHhSYXRpbyl9YCk7XG4gICAgbG9nLmRlYnVnKGAgICAgeVJhdGlvOiAke0pTT04uc3RyaW5naWZ5KHlSYXRpbyl9YCk7XG4gICAgbG9nLmRlYnVnKGAgICAgeU9mZnNldDogJHtKU09OLnN0cmluZ2lmeSh5T2Zmc2V0KX1gKTtcblxuICAgIGxvZy5kZWJ1ZyhgQ29udmVydGVkIHdlYiBjb29yZHMgJHtKU09OLnN0cmluZ2lmeShjb29yZHMpfSBgICtcbiAgICAgICAgICAgICAgYGludG8gcmVhbCBjb29yZHMgJHtKU09OLnN0cmluZ2lmeShuZXdDb29yZHMpfWApO1xuICAgIHJldHVybiBuZXdDb29yZHM7XG4gIH1cbn07XG5cbmV4dGVuc2lvbnMuY2hlY2tGb3JBbGVydCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXh0ZW5zaW9ucy53YWl0Rm9yQXRvbSA9IGFzeW5jIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIC8vIFRPRE86IEFkZCBjaGVjayBmb3IgYWxlcnQgYW5kIGFjY2VwdC9kaXNtaXNzIGl0IGFzIHBlciBhdXRvQWNjZXB0QWxlcnQgY2FwYWJpbGl0eVxuICBsZXQgcmVzID0gbnVsbDtcbiAgdHJ5IHtcbiAgICByZXMgPSBhd2FpdCBwcm9taXNlO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBsZXQgbXNnID0gXy5pc1N0cmluZyhlcnIubWVzc2FnZSkgPyBlcnIubWVzc2FnZSA6IEpTT04uc3RyaW5naWZ5KGVyci5tZXNzYWdlKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIHdoaWxlIGV4ZWN1dGluZyBhdG9tOiAke21zZ31gKTtcbiAgfVxuICByZXR1cm4gdGhpcy5wYXJzZUV4ZWN1dGVSZXNwb25zZShyZXMpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZXh0ZW5zaW9ucztcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4vLi4ifQ==
