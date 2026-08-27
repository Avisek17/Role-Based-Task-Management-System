import {
    Request,
    Response,
    NextFunction
} from "express";

import { validationResult } from "express-validator";

export function handleValidationErrors(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).render(
            "error",
            {
                message: errors
                    .array()
                    .map(error => error.msg)
                    .join(", ")
            }
        );
    }

    next();
}