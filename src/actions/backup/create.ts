import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { HydratedDocument } from "mongoose";
import { Backup, Resource, TResource, TService } from "../../models";
import {
  uploadToCloudinary,
  deleteMultipleFromCloudinary,
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

  const backup = await Backup.create({
    uuid,
    url,
    resource: resource._id,
    format: request.body.format,
  });
  const {
    service: {
      notifications: { events },
    },
  } = resource;
  events?.BR_SUCCESSFUL && eventEmitter.emit("backup.successful", resource);

  resource.service.auth.is_enabled &&
    updateServiceApiKey(request, resource.service);

  response.status(201).json({ backup, message: "backup created successfully" });

  deleteElapsedBackups(resource, request.body.format);
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

const deleteElapsedBackups = async (
  resource: HydratedDocument<TResource>,
  format: string
) => {
  const service = resource?.service as TService;
  const days =
    service.backup_duration === "1w"
      ? 7
      : service.backup_duration === "1m"
      ? 30
      : 90;
  const elapsedDate = new Date(Date.now() - days * 86400000);
  const elapsedBackups = await Backup.find({
    resource: resource._id,
    created_at: { $lt: elapsedDate },
  });
  const backupIds = elapsedBackups.map(
    ({ uuid }) =>
      `${process.env.CLOUDINARY_FOLDER}/${service.uuid}/${
        resource.uuid
      }/${uuid}.${format.toLowerCase()}`
  );

  if (backupIds.length === 0) return;
  deleteMultipleFromCloudinary(backupIds, format);
  await Backup.deleteMany({
    resource: resource._id,
    created_at: { $lt: elapsedDate },
  });
};
