'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appiumIosDriver = require('appium-ios-driver');

var desiredCapConstraints = _lodash2['default'].defaults({
  showXcodeLog: {
    isBoolean: true
  },
  wdaLocalPort: {
    isNumber: true
  },
  iosInstallPause: {
    isNumber: true
  },
  xcodeConfigFile: {
    isString: true
  },
  xcodeOrgId: {
    isString: true
  },
  xcodeSigningId: {
    isString: true
  },
  keychainPath: {
    isString: true
  },
  keychainPassword: {
    isString: true
  },
  bootstrapPath: {
    isString: true
  },
  agentPath: {
    isString: true
  },
  tapWithShortPressDuration: {
    isNumber: true
  },
  scaleFactor: {
    isString: true
  },
  usePrebuiltWDA: {
    isBoolean: true
  },
  customSSLCert: {
    isString: true
  },
  preventWDAAttachments: {
    isBoolean: true
  },
  webDriverAgentUrl: {
    isString: true
  },
  useNewWDA: {
    isBoolean: true
  },
  wdaLaunchTimeout: {
    isNumber: true
  },
  wdaConnectionTimeout: {
    isNumber: true
  },
  updatedWDABundleId: {
    isString: true
  },
  resetOnSessionStartOnly: {
    isBoolean: true
  },
  commandTimeouts: {
    isString: true
  },
  wdaStartupRetries: {
    isNumber: true
  },
  wdaStartupRetryInterval: {
    isNumber: true
  },
  prebuildWDA: {
    isBoolean: true
  },
  connectHardwareKeyboard: {
    isBoolean: true
  },
  calendarAccessAuthorized: {
    isBoolean: true
  },
  startIWDP: {
    isBoolean: true
  },
  useSimpleBuildTest: {
    isBoolean: true
  },
  waitForQuiescence: {
    isBoolean: true
  },
  maxTypingFrequency: {
    isNumber: true
  },
  nativeTyping: {
    isBoolean: true
  },
  simpleIsVisibleCheck: {
    isBoolean: true
  },
  useCarthageSsl: {
    isBoolean: true
  },
  shouldUseSingletonTestManager: {
    isBoolean: true
  },
  isHeadless: {
    isBoolean: true
  },
  webkitDebugProxyPort: {
    isNumber: true
  },
  useXctestrunFile: {
    isBoolean: true
  },
  absoluteWebLocations: {
    isBoolean: true
  },
  simulatorWindowCenter: {
    isString: true
  },
  useJSONSource: {
    isBoolean: true
  }
}, _appiumIosDriver.desiredCapConstraints);

exports.desiredCapConstraints = desiredCapConstraints;
exports['default'] = desiredCapConstraints;
//# sourceMappingURL=data:application/json;charset=utf8;base64,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cUIsRUFBRTtBQUNyQixZQUFRLEVBQUUsSUFBSTtHQUNmO0FBQ0QsZUFBYSxFQUFFO0FBQ2IsYUFBUyxFQUFFLElBQUk7R0FDaEI7Q0FDRix5Q0FBMkIsQ0FBQzs7UUFFcEIscUJBQXFCLEdBQXJCLHFCQUFxQjtxQkFDZixxQkFBcUIiLCJmaWxlIjoibGliL2Rlc2lyZWQtY2Fwcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBkZXNpcmVkQ2FwQ29uc3RyYWludHMgYXMgaW9zRGVzaXJlZENhcENvbnN0cmFpbnRzIH0gZnJvbSAnYXBwaXVtLWlvcy1kcml2ZXInO1xuXG5cbmxldCBkZXNpcmVkQ2FwQ29uc3RyYWludHMgPSBfLmRlZmF1bHRzKHtcbiAgc2hvd1hjb2RlTG9nOiB7XG4gICAgaXNCb29sZWFuOiB0cnVlXG4gIH0sXG4gIHdkYUxvY2FsUG9ydDoge1xuICAgIGlzTnVtYmVyOiB0cnVlXG4gIH0sXG4gIGlvc0luc3RhbGxQYXVzZToge1xuICAgIGlzTnVtYmVyOiB0cnVlXG4gIH0sXG4gIHhjb2RlQ29uZmlnRmlsZToge1xuICAgIGlzU3RyaW5nOiB0cnVlXG4gIH0sXG4gIHhjb2RlT3JnSWQ6IHtcbiAgICBpc1N0cmluZzogdHJ1ZVxuICB9LFxuICB4Y29kZVNpZ25pbmdJZDoge1xuICAgIGlzU3RyaW5nOiB0cnVlXG4gIH0sXG4gIGtleWNoYWluUGF0aDoge1xuICAgIGlzU3RyaW5nOiB0cnVlXG4gIH0sXG4gIGtleWNoYWluUGFzc3dvcmQ6IHtcbiAgICBpc1N0cmluZzogdHJ1ZVxuICB9LFxuICBib290c3RyYXBQYXRoOiB7XG4gICAgaXNTdHJpbmc6IHRydWVcbiAgfSxcbiAgYWdlbnRQYXRoOiB7XG4gICAgaXNTdHJpbmc6IHRydWVcbiAgfSxcbiAgdGFwV2l0aFNob3J0UHJlc3NEdXJhdGlvbjoge1xuICAgIGlzTnVtYmVyOiB0cnVlXG4gIH0sXG4gIHNjYWxlRmFjdG9yOiB7XG4gICAgaXNTdHJpbmc6IHRydWVcbiAgfSxcbiAgdXNlUHJlYnVpbHRXREE6IHtcbiAgICBpc0Jvb2xlYW46IHRydWVcbiAgfSxcbiAgY3VzdG9tU1NMQ2VydDoge1xuICAgIGlzU3RyaW5nOiB0cnVlXG4gIH0sXG4gIHByZXZlbnRXREFBdHRhY2htZW50czoge1xuICAgIGlzQm9vbGVhbjogdHJ1ZVxuICB9LFxuICB3ZWJEcml2ZXJBZ2VudFVybDoge1xuICAgIGlzU3RyaW5nOiB0cnVlXG4gIH0sXG4gIHVzZU5ld1dEQToge1xuICAgIGlzQm9vbGVhbjogdHJ1ZVxuICB9LFxuICB3ZGFMYXVuY2hUaW1lb3V0OiB7XG4gICAgaXNOdW1iZXI6IHRydWVcbiAgfSxcbiAgd2RhQ29ubmVjdGlvblRpbWVvdXQ6IHtcbiAgICBpc051bWJlcjogdHJ1ZVxuICB9LFxuICB1cGRhdGVkV0RBQnVuZGxlSWQ6IHtcbiAgICBpc1N0cmluZzogdHJ1ZVxuICB9LFxuICByZXNldE9uU2Vzc2lvblN0YXJ0T25seToge1xuICAgIGlzQm9vbGVhbjogdHJ1ZVxuICB9LFxuICBjb21tYW5kVGltZW91dHM6IHtcbiAgICBpc1N0cmluZzogdHJ1ZVxuICB9LFxuICB3ZGFTdGFydHVwUmV0cmllczoge1xuICAgIGlzTnVtYmVyOiB0cnVlXG4gIH0sXG4gIHdkYVN0YXJ0dXBSZXRyeUludGVydmFsOiB7XG4gICAgaXNOdW1iZXI6IHRydWVcbiAgfSxcbiAgcHJlYnVpbGRXREE6IHtcbiAgICBpc0Jvb2xlYW46IHRydWVcbiAgfSxcbiAgY29ubmVjdEhhcmR3YXJlS2V5Ym9hcmQ6IHtcbiAgICBpc0Jvb2xlYW46IHRydWVcbiAgfSxcbiAgY2FsZW5kYXJBY2Nlc3NBdXRob3JpemVkOiB7XG4gICAgaXNCb29sZWFuOiB0cnVlXG4gIH0sXG4gIHN0YXJ0SVdEUDoge1xuICAgIGlzQm9vbGVhbjogdHJ1ZSxcbiAgfSxcbiAgdXNlU2ltcGxlQnVpbGRUZXN0OiB7XG4gICAgaXNCb29sZWFuOiB0cnVlXG4gIH0sXG4gIHdhaXRGb3JRdWllc2NlbmNlOiB7XG4gICAgaXNCb29sZWFuOiB0cnVlXG4gIH0sXG4gIG1heFR5cGluZ0ZyZXF1ZW5jeToge1xuICAgIGlzTnVtYmVyOiB0cnVlXG4gIH0sXG4gIG5hdGl2ZVR5cGluZzoge1xuICAgIGlzQm9vbGVhbjogdHJ1ZVxuICB9LFxuICBzaW1wbGVJc1Zpc2libGVDaGVjazoge1xuICAgIGlzQm9vbGVhbjogdHJ1ZVxuICB9LFxuICB1c2VDYXJ0aGFnZVNzbDoge1xuICAgIGlzQm9vbGVhbjogdHJ1ZVxuICB9LFxuICBzaG91bGRVc2VTaW5nbGV0b25UZXN0TWFuYWdlcjoge1xuICAgIGlzQm9vbGVhbjogdHJ1ZVxuICB9LFxuICBpc0hlYWRsZXNzOiB7XG4gICAgaXNCb29sZWFuOiB0cnVlXG4gIH0sXG4gIHdlYmtpdERlYnVnUHJveHlQb3J0OiB7XG4gICAgaXNOdW1iZXI6IHRydWVcbiAgfSxcbiAgdXNlWGN0ZXN0cnVuRmlsZToge1xuICAgIGlzQm9vbGVhbjogdHJ1ZVxuICB9LFxuICBhYnNvbHV0ZVdlYkxvY2F0aW9uczoge1xuICAgIGlzQm9vbGVhbjogdHJ1ZVxuICB9LFxuICBzaW11bGF0b3JXaW5kb3dDZW50ZXI6IHtcbiAgICBpc1N0cmluZzogdHJ1ZVxuICB9LFxuICB1c2VKU09OU291cmNlOiB7XG4gICAgaXNCb29sZWFuOiB0cnVlXG4gIH1cbn0sIGlvc0Rlc2lyZWRDYXBDb25zdHJhaW50cyk7XG5cbmV4cG9ydCB7IGRlc2lyZWRDYXBDb25zdHJhaW50cyB9O1xuZXhwb3J0IGRlZmF1bHQgZGVzaXJlZENhcENvbnN0cmFpbnRzO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLiJ9
