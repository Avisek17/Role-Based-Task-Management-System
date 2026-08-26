import { Router, Request, Response } from "express";
import { tasks } from "../data/tasks";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    const status = req.query.status;

    let filteredTasks = tasks;

    if (status === "completed") {
        filteredTasks = tasks.filter(
            task => task.completed
        );
    }

    if (status === "pending") {
        filteredTasks = tasks.filter(
            task => !task.completed
        );
    }

    res.render("tasks/index", {
        tasks: filteredTasks,
        status
    });
});

router.get("/new", (req: Request, res: Response) => {
    res.render("tasks/new");
});

router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) {
        return res.status(404).render("error", {
            message: "Task not found"
        });
    }

    res.render("tasks/show", {
        task
    });
});

router.post("/", (req: Request, res: Response) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).render("error", {
            message: "Title and description are required"
        });
    }

    const newTask = {
        id: tasks.length > 0
            ? Math.max(...tasks.map(task => task.id)) + 1
            : 1,
        title,
        description,
        completed: false
    };

    tasks.push(newTask);

    res.redirect("/tasks");
});

router.post(
    "/:id/complete",
    (req: Request, res: Response) => {

        const id = Number(req.params.id);

        const task = tasks.find(
            task => task.id === id
        );

        if (!task) {
            return res.status(404).render("error", {
                message: "Task not found"
            });
        }

        task.completed = true;

        res.redirect(`/tasks/${id}`);
    }
);

router.post(
    "/:id/delete",
    (req: Request, res: Response) => {

        const id = Number(req.params.id);

        const index = tasks.findIndex(
            task => task.id === id
        );

        if (index === -1) {
            return res.status(404).render("error", {
                message: "Task not found"
            });
        }

        tasks.splice(index, 1);

        res.redirect("/tasks");
    }
);

export default router;