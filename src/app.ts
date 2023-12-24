import express from "express";
import { backupRouter, resourceRouter, serviceRouter } from "./routes";
import { bootstrap, loadEnv, initEvents } from "./utilities";
import { Request, Response, NextFunction } from "express";

// Loading up relevant environment variables
loadEnv();

const app = express();

initEvents();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/ping", (_: Request, response: Response, __: NextFunction) => {
  return response.status(200).json({ status: "ok" });
});
app.use(backupRouter);
app.use(resourceRouter);
app.use(serviceRouter);

bootstrap(app);
