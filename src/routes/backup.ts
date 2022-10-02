import express from "express";
import { createBackup } from "../actions";

export const backupRouter = express.Router();

backupRouter.post("/:resource_uuid", createBackup);
