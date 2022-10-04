import { Schema, model, HydratedDocument } from "mongoose";
import { TResource } from "./Resource";

export type TBackup = {
  _id: Schema.Types.ObjectId;
  uuid: string;
  resource: HydratedDocument<TResource>;
  url: string;
  created_at: Date;
  updated_at: Date;
};

const backupSchema = new Schema<TBackup>(
  {
    uuid: { type: String, required: true },
    resource: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
    url: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const Backup = model<TBackup>("Backup", backupSchema);
