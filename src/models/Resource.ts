import { Schema, model, HydratedDocument } from "mongoose";
import { resourcePlugin, capitalize } from "../utilities";
import { TService } from "./Service";

export type TResource = {
  _id: Schema.Types.ObjectId;
  uuid: string;
  service: HydratedDocument<TService>;
  name: string;
  description?: string;
  is_active: boolean;
};

const resourceSchema = new Schema<TResource>(
  {
    uuid: { type: String },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    name: {
      type: String,
      required: true,
      get: (name: string) => capitalize(name),
    },
    description: { type: String, required: false },
    is_active: { type: Boolean, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

resourceSchema.plugin(resourcePlugin);

export const Resource = model<TResource>("Resource", resourceSchema);
