import { Request, Response, NextFunction } from "express";
import { Backup } from "../../models";
import { throwException } from "../../utilities";

export const deleteBackupMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { backup_uuid } = request.params;

  const backup = await Backup.findOne({ uuid: backup_uuid });

  if (!backup)
    return throwException(
      response,
      404,
      `backup with uuid ${backup_uuid} does not exist`
    );

  next();
};
