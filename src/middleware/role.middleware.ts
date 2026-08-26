import {
    Request,
    Response,
    NextFunction
} from "express";

export function requireRole(
    role: "user" | "admin"
) {

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {

        if (req.session.role !== role) {
            res.status(403).render(
                "error",
                {
                    message: "Access denied"
                }
            );

            return;
        }

        next();
    };
}