import { Schema, Model, Types, model } from "mongoose";

export type TUser = {
  _id: Types.ObjectId;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  default_service: string;
  created_at: Date;
  updated_at: Date;
};

const userSchema = new Schema<TUser>(
  {
    uuid: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    default_service: { type: String, required: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const User = model<TUser>("User", userSchema);
