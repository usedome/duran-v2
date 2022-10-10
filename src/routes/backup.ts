import express from "express";
import { createBackupMiddleware, fileMiddleware } from "../middleware";
import { createBackup } from "../actions";
import { check, body } from "express-validator";

export const backupRouter = express.Router();

backupRouter.post(
  "/:resource_uuid",
  fileMiddleware.single("backup"),
  check("backup")
    .custom((_, { req }) => {
      if (!req?.file) return false;
      return Boolean(req?.file?.mimetype);
    })
    .withMessage("backup is required"),
  body("format", "format is required").exists(),
  createBackupMiddleware,
  createBackup
);
