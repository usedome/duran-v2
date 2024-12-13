import { Router } from "express";
import { ping } from "../actions";

export const pingRouter = Router();

pingRouter.post("/ping", ping);
