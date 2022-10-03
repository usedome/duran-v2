import Mailgun from "mailgun.js";
import Client from "mailgun.js/dist/lib/client";
import { default as formData } from "form-data";

export class Mail {
  private mailClient: Client;

  constructor() {
    const mailgun = new Mailgun(formData);
    this.mailClient = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY as string,
    });
  }

  public async send(subject: string, text: string) {
    const params = {
      from: process.env.MAIL_FROM as string,
      to: process.env.MAIL_TO as string,
      subject,
      text,
    };
    await this.mailClient.messages.create(
      process.env.MAIL_DOMAIN as string,
      params
    );
  }
}
