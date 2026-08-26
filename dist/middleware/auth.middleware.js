"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        res.redirect("/auth/login");
        return;
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map