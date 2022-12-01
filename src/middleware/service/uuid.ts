import { Request, Response, NextFunction } from "express";
import { Service } from "../../models";
import { throwException } from "../../utilities";

export const serviceByUuidMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { params } = req;
  const service = await Service.findOne({
    uuid: params?.service_uuid as string,
  });

  if (!service)
    throwException(
      res,
      404,
      `service with uuid ${params?.service_uuid} does not exist`
    );

  next();
};
