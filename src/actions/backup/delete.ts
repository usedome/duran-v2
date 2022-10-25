import { Request, Response, NextFunction } from "express";
import {
  deleteBackup as deleteCloudinaryBackup,
  throwException,
} from "../../utilities";
import { Backup } from "../../models";

export const deleteBackup = async (
  request: Request,
  response: Response,
  _: NextFunction
) => {
  const { backup_uuid } = request.params;

  const backup = await Backup.findOne({ uuid: backup_uuid });

  await backup.resource.populate("service");

  try {
    await deleteCloudinaryBackup(backup);
  } catch (error) {
    return throwException(
      response,
      500,
      (error as Error)?.message ??
        `There was a problem deleting the backup with uuid ${backup_uuid}`
    );
  }

  response.status(204);
  response.end();
};
