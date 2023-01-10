import { Request, Response, NextFunction } from "express";
import { throwException, eventEmitter } from "../../utilities";
import { Resource } from "../../models";

export const createBackupMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { subdomains, params } = request;
  const resource_uuid =
    subdomains.length > 0 ? subdomains[0] : params?.resource_uuid ?? "";

  if (resource_uuid.trim() === "")
    return throwException(response, 400, `resource uuid is required`);

  const resource = await Resource.findOne({ uuid: resource_uuid });

  if (!resource)
    return throwException(
      response,
      404,
      `resource with uuid ${resource_uuid} does not exist`
    );

  const authHeader = request.headers?.authorization;
  let isAuthorized = false;
  let apiKey;

  const { service } = resource;

  if (!service.auth.is_enabled) isAuthorized = true;
  else if (!authHeader || authHeader.split(" ").length !== 2)
    isAuthorized = false;
  else {
    apiKey = authHeader.split(" ")[1] ?? "";
    isAuthorized = service.auth.api_keys.map(({ key }) => key).includes(apiKey);
  }

  if (!isAuthorized) {
    const {
      service: {
        notifications: { events },
      },
    } = resource;
    events?.BR_WRONG_CREDENTIALS &&
      eventEmitter.emit("backup.wrong.credentials", resource, apiKey);
    return throwException(response, 401, `valid api key is needed`);
  }

  if (!resource?.is_active)
    return throwException(
      response,
      400,
      `resource with uuid ${resource_uuid} is not currently active`
    );

  next();
};
