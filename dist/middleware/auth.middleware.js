export function requireAuth(req, res, next) {
    if (!req.session.userId) {
        res.redirect("/auth/login");
        return;
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map