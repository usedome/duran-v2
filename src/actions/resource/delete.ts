import { Request, Response, NextFunction } from "express";
import { Resource } from "../../models";
import { throwException, deleteFromCloudinary } from "../../utilities";

export const deleteResource = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { params } = request;

  const resource = await Resource.findOne({ uuid: params?.resource_uuid });
  await resource.populate("service");

  try {
    const public_id = `${process.env.CLOUDINARY_FOLDER}/${resource.service.uuid}/${resource.uuid}`;
    await deleteFromCloudinary(public_id);
  } catch (error) {
    throwException(
      response,
      500,
      (error as Error)?.message ??
        `There was a problem deleting the resource with uuid ${resource.uuid}`
    );
  }
};
