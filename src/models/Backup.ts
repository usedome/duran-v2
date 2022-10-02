import { Schema, model } from "mongoose";
import { uuidPlugin } from "../utilities";
import { TResource } from "./Resource";

export type TBackup = {
  _id: Schema.Types.ObjectId;
  uuid: string;
  resource: TResource;
  url: string;
  created_at: Date;
  updated_at: Date;
};

const backupSchema = new Schema<TBackup>(
  {
    uuid: { type: String },
    resource: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
    url: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

backupSchema.plugin(uuidPlugin);

export const Backup = model<TBackup>("Backup", backupSchema);
