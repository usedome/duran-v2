import { HydratedDocument } from "mongoose";
import { TResource } from "../models";
import { Mail } from "../channels";

export const backupSuccessfulListener = (
  resource: HydratedDocument<TResource>
) => {
  const mail = new Mail();
  mail.send({
    subject: `${resource.service.name} - New Backup`,
    resource,
    template: "backup-successful.ejs",
  });
};

export const backupWrongCredentialsListener = async (
  resource: HydratedDocument<TResource>,
  apiKey?: string
) => {
  await resource.service.populate("user");

  const mail = new Mail();
  mail.send({
    subject: `${resource.service.name} - Unauthorized Backup Request`,
    resource,
    template: "backup-wrong_credentials.ejs",
    apiKey,
  });
};

export const backupUnauthorizedIpListener = (resource: TResource) => {};
