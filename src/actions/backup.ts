import { Request, Response, NextFunction } from "express";

export const createBackup = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { resource_uuid } = request.params;
  response.status(200).json({ resource_uuid });
};
