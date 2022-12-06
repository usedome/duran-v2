import { Request, Response, NextFunction } from "express";
import { Service } from "../../models";
import { deleteFromCloudinary, throwException } from "../../utilities";

export const deleteService = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { params } = request;
  const service = await Service.findOne({
    uuid: params?.service_uuid as string,
  });

  try {
    const public_id = `${process.env.CLOUDINARY_FOLDER}/${service.uuid}`;
    await deleteFromCloudinary(public_id, false);
  } catch (error) {
    throwException(
      response,
      500,
      (error as Error)?.message ??
        `There was a problem deleting the service with uuid ${service.uuid}`
    );
  }

  response.status(204);
  response.end();
};
