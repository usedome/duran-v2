import { EventEmitter } from "events";
import {
  backupSuccessfulListener,
  backupUnauthorizedIpListener,
  backupWrongCredentialsListener,
} from "../listeners";

export const eventEmitter = new EventEmitter();

export const initEvents = () => {
  eventEmitter.on("backup.successful", backupSuccessfulListener);
  eventEmitter.on("backup.wrong.credentials", backupWrongCredentialsListener);
  eventEmitter.on("backup.unauthorized.ip", backupUnauthorizedIpListener);
};
