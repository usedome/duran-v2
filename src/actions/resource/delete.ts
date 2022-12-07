import { Request, Response, NextFunction } from "express";
import { Resource, Backup } from "../../models";
import { throwException, deleteFromCloudinary } from "../../utilities";

export const deleteResource = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { params } = request;

  const resource = await Resource.findOne({ uuid: params?.resource_uuid });
  const numBackups = await Backup.find({
    resource: resource._id,
  }).countDocuments();

  if (numBackups === 0)
    return throwException(
      response,
      400,
      `resource with uuid ${params?.resource_uuid} does not have any backups`
    );

  await resource.populate("service");

  try {
    const public_id = `${process.env.CLOUDINARY_FOLDER}/${resource.service.uuid}/${resource.uuid}`;
    await deleteFromCloudinary(public_id, false);
  } catch (error) {
    console.log(error);
    throwException(
      response,
      500,
      (error as Error)?.message ??
        `There was a problem deleting the resource with uuid ${resource.uuid}`
    );
  }

  response.status(204);
  response.end();
};
