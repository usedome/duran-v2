import { Schema } from "mongoose";

export const backupPlugin = (schema: Schema) => {
  schema.pre(["findOne"], async function () {
    this.populate("resource");
  });
};
