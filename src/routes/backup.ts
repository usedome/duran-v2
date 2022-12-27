import express from "express";
import {
  createBackupMiddleware,
  authMiddleware,
  fileMiddleware,
  corsMiddleware,
} from "../middleware";
import { backupByUuidMiddleware } from "../middleware/backup/uuid";
import { createBackup } from "../actions";
import { deleteBackup } from "../actions/backup/delete";
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

backupRouter.delete(
  "/backups/:backup_uuid",
  corsMiddleware,
  authMiddleware,
  backupByUuidMiddleware,
  deleteBackup
);
