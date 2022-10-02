import express from "express";
import { createBackupMiddleware } from "../middleware";
import { createBackup } from "../actions";

export const backupRouter = express.Router();

backupRouter.post("/:resource_uuid", createBackupMiddleware, createBackup);
