import { Request, Response, NextFunction } from "express";
import { deleteFromCloudinary, throwException } from "../../utilities";
import { Backup } from "../../models";

export const deleteBackup = async (
  request: Request,
  response: Response,
  _: NextFunction
) => {
  const { backup_uuid } = request.params;

  const backup = await Backup.findOne({ uuid: backup_uuid });
  const { resource } = backup;

  await resource.populate("service");

  try {
    const public_id = `${process.env.CLOUDINARY_FOLDER}/${resource.service.uuid}/${resource.uuid}/${backup.uuid}`;
    await deleteFromCloudinary(public_id);
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
