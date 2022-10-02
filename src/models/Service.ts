import { Schema, model } from "mongoose";
import { TUser } from "./User";

type TServiceApiKey = {
  name: string;
  uuid: string;
  key: string;
  last_used: Date | null;
};

type TServiceIpAddress = {
  uuid: string;
  value: string;
  last_used?: Date | null;
};

type TServiceNotification = {
  channels: string[];
  events: { [key: string]: boolean };
};

export type TService = {
  _id: Schema.Types.ObjectId;
  uuid: string;
  user: TUser;
  name: string;
  description?: string;
  backup_duration: string;
  api_keys: TServiceApiKey[];
  ips: TServiceIpAddress[];
  notifications: TServiceNotification;
  created_at: Date;
  updated_at: Date;
};

const serviceSchema = new Schema<TService>(
  {
    uuid: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    backup_duration: { type: String, required: true },
    api_keys: { type: Schema.Types.Mixed, required: true },
    ips: { type: Schema.Types.Mixed, required: true },
    notifications: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const Service = model<TService>("Service", serviceSchema);
