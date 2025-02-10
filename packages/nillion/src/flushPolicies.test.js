"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var addPolicies_1 = require("./addPolicies");
var fixture_1 = require("./fixture");
var flushPolicies_1 = require("./flushPolicies");
var getAllPolicies_1 = require("./getAllPolicies");
vitest_1.describe.skip("all policies should be removed", function () {
    (0, vitest_1.test)("there should be 0 items left after flushing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var initialResult, data, results, result, getResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, getAllPolicies_1.getAllPolicies)(fixture_1.SCHEMA_ID)];
                case 1:
                    initialResult = _a.sent();
                    if (!(initialResult.length === 0)) return [3 /*break*/, 3];
                    data = [
                        {
                            policy: {
                                $allot: "you should take advantage of higher yield. If yield is higher at your responsible market, supply more.",
                            },
                            priority: {
                                $allot: 1,
                            },
                        },
                        {
                            policy: {
                                $allot: "You can only supply your own wallet balance, but not control wallet balance of others in the portfolio ",
                            },
                            priority: {
                                $allot: 2,
                            },
                        },
                    ];
                    return [4 /*yield*/, (0, addPolicies_1.addPolicies)(data, fixture_1.SCHEMA_ID)];
                case 2:
                    results = _a.sent();
                    (0, vitest_1.expect)(results).toBeDefined();
                    (0, vitest_1.expect)(results).toBeInstanceOf(Array);
                    (0, vitest_1.expect)(results.length).toBe(data.length);
                    // loop to check results are uuidv4
                    results.forEach(function (result) {
                        (0, vitest_1.expect)(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
                    });
                    _a.label = 3;
                case 3: return [4 /*yield*/, (0, flushPolicies_1.flushPolicies)(fixture_1.SCHEMA_ID)];
                case 4:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBeDefined();
                    return [4 /*yield*/, (0, getAllPolicies_1.getAllPolicies)(fixture_1.SCHEMA_ID)];
                case 5:
                    getResult = _a.sent();
                    (0, vitest_1.expect)(getResult.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
