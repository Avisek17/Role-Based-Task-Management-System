"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = handleValidationErrors;
const express_validator_1 = require("express-validator");
function handleValidationErrors(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("error", {
            message: errors
                .array()
                .map(error => error.msg)
                .join(", ")
        });
    }
    next();
}
//# sourceMappingURL=validation.middleware.js.map