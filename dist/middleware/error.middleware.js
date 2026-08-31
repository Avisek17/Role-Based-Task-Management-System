"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const multer_1 = __importDefault(require("multer"));
const AppError_1 = require("../errors/AppError");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    /*
          ==================================
          APP ERROR
          ==================================
      */
    if (err instanceof AppError_1.AppError) {
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
    if (err instanceof multer_1.default.MulterError) {
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
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map