"use strict"
// Removed simulateRequest and getDecodedResultLog
Object.defineProperty(exports, "__esModule", { value: true })
exports.getRequestConfig = exports.buildRequest = void 0
var buildRequest_1 = require("./buildRequest")
Object.defineProperty(exports, "buildRequest", {
  enumerable: true,
  get: function () {
    return buildRequest_1.buildRequest
  },
})
var getRequestConfig_1 = require("./getRequestConfig")
Object.defineProperty(exports, "getRequestConfig", {
  enumerable: true,
  get: function () {
    return getRequestConfig_1.getRequestConfig
  },
})
