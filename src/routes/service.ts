import { Router } from "express";
import { authMiddleware, serviceByUuidMiddleware } from "../middleware";
import { deleteService } from "../actions";

export const serviceRouter = Router();

serviceRouter.delete(
  "/services/:service_uuid",
  authMiddleware,
  serviceByUuidMiddleware,
  deleteService
);
