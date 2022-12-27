import { Router } from "express";
import {
  authMiddleware,
  corsMiddleware,
  serviceByUuidMiddleware,
} from "../middleware";
import { deleteService } from "../actions";

export const serviceRouter = Router();

serviceRouter.delete(
  "/services/:service_uuid",
  corsMiddleware,
  authMiddleware,
  serviceByUuidMiddleware,
  deleteService
);
