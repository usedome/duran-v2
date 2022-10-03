import { Schema } from "mongoose";

export const servicePlugin = (schema: Schema) => {
  schema.pre(["findOne"], async function () {
    this.populate("user");
  });
};
