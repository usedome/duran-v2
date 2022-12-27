import { Router } from "express";
import {
  authMiddleware,
  corsMiddleware,
  resourceByUuidMiddleware,
} from "../middleware";
import { deleteResource } from "../actions";

export const resourceRouter = Router();

resourceRouter.delete(
  "/resources/:resource_uuid",
  corsMiddleware,
  authMiddleware,
  resourceByUuidMiddleware,
  deleteResource
);
