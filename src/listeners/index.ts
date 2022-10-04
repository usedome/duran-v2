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

export const backupWrongCredentialsListener = (
  resource: TResource,
  apiKey?: string
) => {
  const mail = new Mail();
  mail.send({
    subject: `${resource.service.name} - Unauthorized Backup Request`,
    resource,
    template: "backup-wrong_credentials.ejs",
    apiKey,
  });
};

export const backupUnauthorizedIpListener = (resource: TResource) => {};
