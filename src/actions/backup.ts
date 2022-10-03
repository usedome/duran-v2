import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { EventEmitter } from "events";
import { Backup, Resource } from "../models";
import { uploadToCloudinary, throwException, eventEmitter } from "../utilities";

export const createBackup = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errors = validationResult(request);

  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });

  const { resource_uuid } = request.params;
  const resource = await Resource.findOne({ uuid: resource_uuid });

  const { uuid, url } = await uploadToCloudinary(resource, request.file);

  if (!uuid)
    return throwException(
      response,
      424,
      "there was a problem completing the request"
    );

  await resource.service.populate("user");

  const backup = await Backup.create({ uuid, url, resource: resource._id });
  eventEmitter.emit("backup.successful", resource);

  response
    .status(201)
    .json({ backup, message: "resource backedup successfully" });
};
