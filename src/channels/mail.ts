import Mailgun from "mailgun.js";
import Client from "mailgun.js/dist/lib/client";
import { default as formData } from "form-data";
import * as path from "path";
import { renderFile } from "ejs";
import { TResource } from "../models";
import { getTimestamp } from "../utilities";

type TMailParams = {
  resource: TResource;
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
      const templatePath = path.join("src", "templates", params.template);
      const { resource } = params;

      renderFile(
        templatePath,
        { resource, timestamp: getTimestamp() },
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
