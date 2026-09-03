import {
    Router,
    Request,
    Response
} from "express";

import { User } from "../../legacy-express/models/user.model";
import { Task } from "../../legacy-express/models/task.model";

const router = Router();

/*
    ADMIN DASHBOARD
*/
router.get(
    "/",
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const users =
                await User.findAll({
                    attributes: [
                        "id",
                        "username",
                        "role",
                        "createdAt"
                    ]
                });

            const tasks =
                await Task.findAll();

            res.render(
                "admin/dashboard",
                {
                    users,
                    tasks
                }
            );

        } catch (error) {

            console.error(error);

            res.status(500).render(
                "error",
                {
                    message:
                        "Unable to load admin dashboard"
                }
            );
        }
    }
);

export default router;