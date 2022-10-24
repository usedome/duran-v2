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
      resource_type: "auto",
    });
    return { uuid, url: response.secure_url };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteBackup = async (uuid: string) => {
  initCloudinary();
  const response = await cloudinary.uploader.destroy(
    "backmeup_dev/3758c7c3-f08a-47e4-9579-423422e0c5d2/ac5b3dde-10dd-4ed3-8047-1884b3892910/" +
      uuid,
    {}
  );
  console.log(uuid);
  console.log(response);
  if (!response) {
    const error = new Error();
    error.message = `There was a problem deleting the backup with uuid ${uuid}`;
    throw error;
  }
};
