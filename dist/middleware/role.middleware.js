"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
function requireRole(role) {
    return (req, res, next) => {
        if (req.session.role !== role) {
            res.status(403).render("error", {
                message: "Access denied"
            });
            return;
        }
        next();
    };
}
//# sourceMappingURL=role.middleware.js.map