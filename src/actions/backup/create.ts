import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { HydratedDocument } from "mongoose";
import { Backup, Resource, TService } from "../../models";
import {
  uploadToCloudinary,
  throwException,
  eventEmitter,
} from "../../utilities";

export const createBackup = async (
  request: Request,
  response: Response,
  _: NextFunction
) => {
  const errors = validationResult(request);

  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });

  const { subdomains, params } = request;
  const resource_uuid =
    subdomains.length > 0 ? subdomains[0] : params?.resource_uuid ?? "";

  const resource = await Resource.findOne({ uuid: resource_uuid });

  const uploadResponse = await uploadToCloudinary(
    resource,
    request.file,
    request.body.format
  );

  if (!uploadResponse)
    return throwException(
      response,
      424,
      "there was a problem completing the request"
    );

  const { uuid, url } = uploadResponse;

  await resource.service.populate("user");

  const backup = await Backup.create({ uuid, url, resource: resource._id });
  const {
    service: {
      notifications: { events },
    },
  } = resource;
  events?.BR_SUCCESSFUL && eventEmitter.emit("backup.successful", resource);

  resource.service.auth.is_enabled &&
    updateServiceApiKey(request, resource.service);

  response.status(201).json({ backup, message: "backup created successfully" });
};

const updateServiceApiKey = async (
  request: Request,
  service: HydratedDocument<TService>
) => {
  const authHeader = request.headers?.authorization;
  const apiKey = authHeader.split(" ")[1];
  const apiKeys = [...service.auth.api_keys];
  const index = apiKeys.findIndex(({ key }) => key === apiKey);
  apiKeys[index] = { ...apiKeys[index], last_used: new Date() };
  service.auth.api_keys = apiKeys;
  await service.save();
};
