import { Schema, model, HydratedDocument } from "mongoose";
import { capitalize } from "../utilities";
import { TUser } from "./User";

type TServiceAuth = {
  is_enabled: boolean;
  api_keys: TServiceApiKey[];
};

type TServiceIpWhitelist = {
  is_enabled: boolean;
  ips: TServiceIpAddress[];
};

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
  user: HydratedDocument<TUser>;
  name: string;
  description?: string;
  backup_duration: string;
  auth: TServiceAuth;
  ip_whitelist: TServiceIpWhitelist[];
  notifications: TServiceNotification;
  created_at: Date;
  updated_at: Date;
};

const serviceSchema = new Schema<TService>(
  {
    uuid: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      required: true,
      get: (name: string) => capitalize(name),
    },
    description: { type: String },
    backup_duration: { type: String, required: true },
    auth: { type: Schema.Types.Mixed, required: true },
    ip_whitelist: { type: Schema.Types.Mixed, required: true },
    notifications: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const Service = model<TService>("Service", serviceSchema);
