import { Request, Response, NextFunction } from "express";
import { Resource } from "../../models";
import Mailgun from "mailgun.js";
import { default as formData } from "form-data";

export const ping = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const dbStatus = await checkDatabase();
  const emailStatus = await checkEmail();

  response.status(200).json({ database: dbStatus, email: emailStatus });
};

const checkDatabase = async () => {
  let dbStatus = "healthy";

  try {
    await Resource.find({ uuid: "some-random-uuid" });
  } catch (error) {
    dbStatus = "unhealthy";
  }

  return dbStatus;
};

const checkEmail = async () => {
  let mailStatus = "healthy";

  try {
    const mailgun = new Mailgun(formData);
    const client = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY as string,
    });
    await client.messages.create(process.env.MAIL_DOMAIN as string, {
      from: process.env.MAIL_FROM as string,
      subject: "This is a test email",
      text: "This is test email text",
      to: "abc@email.com",
    });
  } catch (error) {
    mailStatus = "unhealthy";
  }

  return mailStatus;
};
