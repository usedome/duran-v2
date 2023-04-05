import { v2 as cloudinary } from "cloudinary";
import { HydratedDocument } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { TResource } from "../models";

const initCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
  });
};

const imageFormats = ["jpg", "jpeg", "png", "webp", "gif"];

export const uploadToCloudinary = async (
  resource: HydratedDocument<TResource>,
  file: Express.Multer.File,
  format: string
): Promise<{ uuid: string; url: string } | null> => {
  const folder = `${process.env.CLOUDINARY_FOLDER}/${resource.service.uuid}/${resource.uuid}`;
  const uuid = uuidV4();
  initCloudinary();

  try {
    const response = await cloudinary.uploader.upload(file.path, {
      folder,
      format,
      public_id: uuid,
      access_mode: "public",
      resource_type: imageFormats.includes(format.toLowerCase())
        ? "image"
        : "raw",
    });
    return { uuid, url: response.secure_url };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteMultipleFromCloudinary = async (
  public_ids: string[],
  format: string
) => {
  initCloudinary();
  for (const public_id of public_ids) {
    cloudinary.uploader.destroy(public_id, {
      resource_type: imageFormats.includes(format.toLowerCase())
        ? "image"
        : "raw",
    });
  }
};

export const deleteFromCloudinary = async (
  public_id: string,
  isBackup = true,
  format = ""
) => {
  initCloudinary();
  if (isBackup) {
    cloudinary.uploader.destroy(public_id, {
      resource_type: imageFormats.includes(format.toLowerCase())
        ? "image"
        : "raw",
    });
    return;
  }
  await deleteFolder(public_id);
};

const deleteFolder = async (public_id: string) => {
  await cloudinary.api.delete_resources_by_prefix(
    public_id.endsWith("/") ? public_id : public_id + "/",
    { resource_type: "image" }
  );

  await cloudinary.api.delete_resources_by_prefix(
    public_id.endsWith("/") ? public_id : public_id + "/",
    { resource_type: "raw" }
  );

  await cloudinary.api.delete_folder(public_id);
};
