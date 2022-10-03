import { TResource } from "../models";
import { Mail } from "../channels";

export const backupSuccessfulListener = (resource: TResource) => {
  const mail = new Mail();
  mail.send({
    subject: `${resource.service.name} - New Backup`,
    resource,
    template: "backup-successful.ejs",
  });
};

export const backupWrongCredentialsListener = (resource: TResource) => {};

export const backupUnauthorizedIpListener = (resource: TResource) => {};
