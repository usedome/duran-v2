import { EventEmitter } from "events";
import {
  backupSuccessfulListener,
  backupWrongCredentialsListener,
} from "../listeners";

export const initEvents = () => {
  const eventEmitter = new EventEmitter();

  eventEmitter.on("backup.successful", backupSuccessfulListener);
  eventEmitter.on("backup.wrong.credentials", backupWrongCredentialsListener);
};
