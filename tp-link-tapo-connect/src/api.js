"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.isTapoDevice = exports.securePassthrough = exports.getDeviceInfo = exports.setHue = exports.setColourTemperature = exports.setBrightness = exports.turnOff = exports.turnOn = exports.loginDeviceByIp = exports.loginDevice = exports.handshake = exports.listDevicesByType = exports.listDevices = exports.cloudLogin = void 0;
var axios_1 = require("axios");
var tplinkCipher_1 = require("./tplinkCipher");
var network_tools_1 = require("./network-tools");
var baseUrl = 'https://eu-wap.tplinkcloud.com/';
var cloudLogin = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var loginRequest, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loginRequest = {
                    "method": "login",
                    "params": {
                        "appType": "Tapo_Android",
                        "cloudPassword": password,
                        "cloudUserName": email,
                        "terminalUUID": "59284a9c-e7b1-40f9-8ecd-b9e70c90d19b"
                    }
                };
                return [4 /*yield*/, axios_1["default"]({
                        method: 'post',
                        url: baseUrl,
                        data: loginRequest
                    })];
            case 1:
                response = _a.sent();
                checkError(response.data);
                return [2 /*return*/, response.data.result.token];
        }
    });
}); };
exports.cloudLogin = cloudLogin;
var listDevices = function (cloudToken) { return __awaiter(void 0, void 0, void 0, function () {
    var getDeviceRequest, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getDeviceRequest = {
                    "method": "getDeviceList"
                };
                return [4 /*yield*/, axios_1["default"]({
                        method: 'post',
                        url: baseUrl + "?token=" + cloudToken,
                        data: getDeviceRequest
                    })];
            case 1:
                response = _a.sent();
                checkError(response.data);
                return [2 /*return*/, Promise.all(response.data.result.deviceList.map(function (deviceInfo) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, augmentTapoDevice(deviceInfo)];
                    }); }); }))];
        }
    });
}); };
exports.listDevices = listDevices;
var listDevicesByType = function (cloudToken, deviceType) { return __awaiter(void 0, void 0, void 0, function () {
    var devices;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.listDevices(cloudToken)];
            case 1:
                devices = _a.sent();
                return [2 /*return*/, devices.filter(function (d) { return d.deviceType === deviceType; })];
        }
    });
}); };
exports.listDevicesByType = listDevicesByType;
var handshake = function (deviceIp) { return __awaiter(void 0, void 0, void 0, function () {
    var keyPair, handshakeRequest, response, setCookieHeader, sessionCookie, deviceKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tplinkCipher_1.generateKeyPair()];
            case 1:
                keyPair = _a.sent();
                handshakeRequest = {
                    method: "handshake",
                    params: {
                        "key": keyPair.publicKey
                    }
                };
                return [4 /*yield*/, axios_1["default"]({
                        method: 'post',
                        url: "http://" + deviceIp + "/app",
                        data: handshakeRequest
                    })];
            case 2:
                response = _a.sent();
                checkError(response.data);
                setCookieHeader = response.headers['set-cookie'][0];
                sessionCookie = setCookieHeader.substring(0, setCookieHeader.indexOf(';'));
                deviceKey = tplinkCipher_1.readDeviceKey(response.data.result.key, keyPair.privateKey);
                return [2 /*return*/, {
                        key: deviceKey.subarray(0, 16),
                        iv: deviceKey.subarray(16, 32),
                        deviceIp: deviceIp,
                        sessionCookie: sessionCookie
                    }];
        }
    });
}); };
exports.handshake = handshake;
var loginDevice = function (email, password, device) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _a = exports.loginDeviceByIp;
            _b = [email, password];
            return [4 /*yield*/, network_tools_1.resolveMacToIp(device.deviceMac)];
        case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
    }
}); }); };
exports.loginDevice = loginDevice;
var loginDeviceByIp = function (email, password, deviceIp) { return __awaiter(void 0, void 0, void 0, function () {
    var deviceKey, loginDeviceRequest, loginDeviceResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.handshake(deviceIp)];
            case 1:
                deviceKey = _a.sent();
                loginDeviceRequest = {
                    "method": "login_device",
                    "params": {
                        "username": tplinkCipher_1.base64Encode(tplinkCipher_1.shaDigest(email)),
                        "password": tplinkCipher_1.base64Encode(password)
                    }
                };
                return [4 /*yield*/, exports.securePassthrough(loginDeviceRequest, deviceKey)];
            case 2:
                loginDeviceResponse = _a.sent();
                deviceKey.token = loginDeviceResponse.token;
                return [2 /*return*/, deviceKey];
        }
    });
}); };
exports.loginDeviceByIp = loginDeviceByIp;
var turnOn = function (deviceKey, deviceOn) {
    if (deviceOn === void 0) { deviceOn = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var turnDeviceOnRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    turnDeviceOnRequest = {
                        "method": "set_device_info",
                        "params": {
                            "device_on": deviceOn
                        }
                    };
                    return [4 /*yield*/, exports.securePassthrough(turnDeviceOnRequest, deviceKey)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.turnOn = turnOn;
var turnOff = function (deviceKey) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, exports.turnOn(deviceKey, false)];
    });
}); };
exports.turnOff = turnOff;
var setBrightness = function (deviceKey, brightnessLevel) {
    if (brightnessLevel === void 0) { brightnessLevel = 100; }
    return __awaiter(void 0, void 0, void 0, function () {
        var setBrightnessRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setBrightnessRequest = {
                        "method": "set_device_info",
                        "params": {
                            "brightness": brightnessLevel
                        }
                    };
                    return [4 /*yield*/, exports.securePassthrough(setBrightnessRequest, deviceKey)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.setBrightness = setBrightness;
var setColourTemperature = function (deviceKey, colourTemperature) {
    if (colourTemperature === void 0) { colourTemperature = 2500; }
    return __awaiter(void 0, void 0, void 0, function () {
        var setBrightnessRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setBrightnessRequest = {
                        "method": "set_device_info",
                        "params": {
                            "brightness": 100,
                            "color_temp": colourTemperature
                        }
                    };
                    return [4 /*yield*/, exports.securePassthrough(setBrightnessRequest, deviceKey)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.setColourTemperature = setColourTemperature;
var setHue = function (deviceKey, hue) {
    if (hue === void 0) { hue = 360; }
    return __awaiter(void 0, void 0, void 0, function () {
        var setBrightnessRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setBrightnessRequest = {
                        "method": "set_device_info",
                        "params": {
                            "hue": hue
                        }
                    };
                    return [4 /*yield*/, exports.securePassthrough(setBrightnessRequest, deviceKey)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.setHue = setHue;
var getDeviceInfo = function (handshakeResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var turnDeviceOnRequest, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                turnDeviceOnRequest = {
                    "method": "get_device_info"
                };
                _a = augmentTapoDeviceInfo;
                return [4 /*yield*/, exports.securePassthrough(turnDeviceOnRequest, handshakeResponse)];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
        }
    });
}); };
exports.getDeviceInfo = getDeviceInfo;
var securePassthrough = function (deviceRequest, deviceKey) { return __awaiter(void 0, void 0, void 0, function () {
    var encryptedRequest, securePassthroughRequest, response, decryptedResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                encryptedRequest = tplinkCipher_1.encrypt(deviceRequest, deviceKey);
                securePassthroughRequest = {
                    "method": "securePassthrough",
                    "params": {
                        "request": encryptedRequest
                    }
                };
                return [4 /*yield*/, axios_1["default"]({
                        method: 'post',
                        url: "http://" + deviceKey.deviceIp + "/app?token=" + deviceKey.token,
                        data: securePassthroughRequest,
                        headers: {
                            "Cookie": deviceKey.sessionCookie
                        }
                    })];
            case 1:
                response = _a.sent();
                checkError(response.data);
                decryptedResponse = tplinkCipher_1.decrypt(response.data.result.response, deviceKey);
                checkError(decryptedResponse);
                return [2 /*return*/, decryptedResponse.result];
        }
    });
}); };
exports.securePassthrough = securePassthrough;
var augmentTapoDevice = function (deviceInfo) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (exports.isTapoDevice(deviceInfo.deviceType)) {
            return [2 /*return*/, __assign(__assign({}, deviceInfo), { alias: tplinkCipher_1.base64Decode(deviceInfo.alias) })];
        }
        else {
            return [2 /*return*/, deviceInfo];
        }
        return [2 /*return*/];
    });
}); };
var augmentTapoDeviceInfo = function (deviceInfo) {
    return __assign(__assign({}, deviceInfo), { ssid: tplinkCipher_1.base64Decode(deviceInfo.ssid), nickname: tplinkCipher_1.base64Decode(deviceInfo.nickname) });
};
var isTapoDevice = function (deviceType) {
    switch (deviceType) {
        case 'SMART.TAPOPLUG':
        case 'SMART.TAPOBULB':
            return true;
        default: return false;
    }
};
exports.isTapoDevice = isTapoDevice;
var checkError = function (responseData) {
    var errorCode = responseData.error_code;
    if (errorCode) {
        switch (errorCode) {
            case 0: return;
            case -1010: throw new Error("Invalid public key length");
            case -1501: throw new Error("Invalid request or credentials");
            case -1002: throw new Error("Incorrect request");
            case -1003: throw new Error("JSON format error");
            case -20675: throw new Error("Cloud token expired or invalid");
            case 9999: throw new Error("Device token expired or invalid");
            default: throw new Error("Unexpected Error Code: " + errorCode);
        }
    }
};
