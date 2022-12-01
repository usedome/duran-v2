import { Router } from "express";
import { authMiddleware, resourceByUuidMiddleware } from "../middleware";
import { deleteResource } from "../actions";

export const resourceRouter = Router();

resourceRouter.delete(
  "/resources/:resource_uuid",
  authMiddleware,
  resourceByUuidMiddleware,
  deleteResource
);
