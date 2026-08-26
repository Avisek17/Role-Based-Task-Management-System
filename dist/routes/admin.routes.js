"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const task_model_1 = require("../models/task.model");
const router = (0, express_1.Router)();
/*
    ADMIN DASHBOARD
*/
router.get("/", async (req, res) => {
    try {
        const users = await user_model_1.User.findAll({
            attributes: [
                "id",
                "username",
                "role",
                "createdAt"
            ]
        });
        const tasks = await task_model_1.Task.findAll();
        res.render("admin/dashboard", {
            users,
            tasks
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).render("error", {
            message: "Unable to load admin dashboard"
        });
    }
});
exports.default = router;
//# sourceMappingURL=admin.routes.js.map