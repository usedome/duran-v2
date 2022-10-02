import { Response } from "express";

export const throwException = (
  res: Response,
  statusCode: number,
  message: string
) => {
  res.status(statusCode).json({ message });
  res.end();
};
