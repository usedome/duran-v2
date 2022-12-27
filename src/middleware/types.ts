import { TUser } from "../models";

export type TAuthMiddlewareResponse = {
  message: string;
  user: TUser;
};
