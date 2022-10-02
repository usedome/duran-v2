import { Request, Response, NextFunction } from "express";
import { throwException } from "../utilities";
import { Resource } from "../models";

export const createBackupMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { resource_uuid } = request.params;
  const resource = await Resource.findOne({ uuid: resource_uuid });

  if (!resource)
    return throwException(
      response,
      404,
      `resource with uuid ${resource_uuid} does not exist`
    );

  const authHeader = request.headers?.authorization;
  let isAuthorized = false;

  if (!authHeader || authHeader.split(" ").length !== 2) isAuthorized = false;
  else {
    const apiKey = authHeader.split(" ")[1];
    isAuthorized = resource.service.api_keys
      .map(({ key }) => key)
      .includes(apiKey);
  }

  if (!isAuthorized)
    return throwException(response, 401, `valid api key is needed`);

  next();
};
