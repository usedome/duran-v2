import { Schema } from "mongoose";

export const resourcePlugin = (schema: Schema) => {
  schema.pre(["findOne"], async function () {
    this.populate("service");
  });
};
