import rateLimit from "express-rate-limit";
export const generalLImiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: " Too many requests. Please try again after some time."
    }
});
export const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many attemptss. Please try again later."
    }
});
//# sourceMappingURL=rate-limit.middleware.js.map