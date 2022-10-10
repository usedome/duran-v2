import Mailgun from "mailgun.js";
import Client from "mailgun.js/dist/lib/client";
import { default as formData } from "form-data";
import * as path from "path";
import { renderFile } from "ejs";
import { HydratedDocument } from "mongoose";
import { TResource } from "../models";
import { getTimestamp } from "../utilities";

type TMailParams = {
  resource: HydratedDocument<TResource>;
  apiKey?: string;
  subject: string;
  template: string;
};

export class Mail {
  private mailClient: Client;

  constructor() {
    const mailgun = new Mailgun(formData);
    this.mailClient = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY as string,
    });
  }

  public async send(params: TMailParams) {
    try {
      const templatePath =
        (process.env?.NODE_ENV ?? "").toLowerCase() === "production"
          ? path.join(__dirname, "../", "templates", params.template)
          : path.join("src", "templates", params.template);
      const { resource } = params;

      renderFile(
        templatePath,
        {
          resource,
          timestamp: getTimestamp(),
          apiKey: params?.apiKey ?? undefined,
        },
        async (error, html) => {
          if (error) throw error;

          await this.mailClient.messages.create(
            process.env.MAIL_DOMAIN as string,
            {
              ...(({ subject }) => ({ subject }))(params),
              from: process.env.MAIL_FROM as string,
              to: resource.service.user.email,
              html,
            }
          );
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}
