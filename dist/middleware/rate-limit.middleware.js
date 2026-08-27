"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLimiter = exports.generalLImiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.generalLImiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: " Too many requests. Please try again after some time."
    }
});
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many attemptss. Please try again later."
    }
});
//# sourceMappingURL=rate-limit.middleware.js.map