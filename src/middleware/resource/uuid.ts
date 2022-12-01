import { Request, Response, NextFunction } from "express";
import { Resource } from "../../models";
import { throwException } from "../../utilities";

export const resourceByUuidMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { params, subdomains } = request;
  const uuid =
    subdomains.length > 0 ? subdomains[0] : (params?.resource_uuid as string);

  const resource = await Resource.findOne({ uuid });

  if (!resource)
    throwException(response, 404, `resource with uuid ${uuid} does not exist`);

  next();
};
