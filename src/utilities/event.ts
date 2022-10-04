import { EventEmitter } from "events";
import {
  backupSuccessfulListener,
  backupWrongCredentialsListener,
} from "../listeners";

export const eventEmitter = new EventEmitter();

export const initEvents = () => {
  eventEmitter.on("backup.successful", backupSuccessfulListener);
  eventEmitter.on("backup.wrong.credentials", backupWrongCredentialsListener);
};
