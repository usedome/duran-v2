import express from "express";
import { backupRouter } from "./routes";
import { bootstrap, loadEnv, initEvents } from "./utilities";

// Loading up relevant environment variables
loadEnv();

const app = express();

initEvents();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(backupRouter);

bootstrap(app);
