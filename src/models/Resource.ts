import { Schema, model } from "mongoose";
import { TService } from "./Service";

export type TResource = {
  _id: Schema.Types.ObjectId;
  uuid: string;
  service: TService;
  name: string;
  description?: string;
  is_active: boolean;
};

const resourceSchema = new Schema<TResource>(
  {
    uuid: { type: String },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    is_active: { type: Boolean, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const Resource = model<TResource>("Resource", resourceSchema);
