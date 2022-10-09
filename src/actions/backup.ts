import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { HydratedDocument } from "mongoose";
import { Backup, Resource, TService } from "../models";
import { uploadToCloudinary, throwException, eventEmitter } from "../utilities";

export const createBackup = async (
  request: Request,
  response: Response,
  _: NextFunction
) => {
  const errors = validationResult(request);

  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });

  const { resource_uuid } = request.params;
  const resource = await Resource.findOne({ uuid: resource_uuid });

  const uploadResponse = await uploadToCloudinary(resource, request.file);

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

  updateServiceApiKey(request, resource.service);

  response.status(201).json({ backup, message: "backup created successfully" });
};

const updateServiceApiKey = async (
  request: Request,
  service: HydratedDocument<TService>
) => {
  const authHeader = request.headers?.authorization;
  const apiKey = authHeader.split(" ")[1];
  const apiKeys = [...service.api_keys];
  const index = apiKeys.findIndex(({ key }) => key === apiKey);
  apiKeys[index] = { ...apiKeys[index], last_used: new Date() };
  service.api_keys = apiKeys;
  await service.save();
};
