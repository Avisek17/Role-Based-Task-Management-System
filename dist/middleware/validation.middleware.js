import { validationResult } from "express-validator";
export function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
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