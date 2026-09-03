import { Request, Response, NextFunction } from "express";

import multer from "multer";

import { AppError } from "../errors/AppError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  /*
        ==================================
        APP ERROR
        ==================================
    */

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,

      message: err.message,
    });
  }

  /*
        ==================================
        MULTER ERROR
        ==================================
    */

  if (err instanceof multer.MulterError) {
    /*
            File exceeds configured
            upload size limit.
        */

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,

        message: "File size cannot exceed 5 MB",
      });
    }

    /*
            Unexpected Multer error.
        */

    return res.status(400).json({
      success: false,

      message: "File upload failed",
    });
  }

  /*
        ==================================
        UNKNOWN ERROR
        ==================================
    */

  return res.status(500).json({
    success: false,

    message: "Internal server error",
  });
};
