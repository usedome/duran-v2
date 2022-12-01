import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { throwException } from "../utilities";
import { TAuthMiddlewareResponse } from "./types";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { headers } = req;

  let isAuthorized = false;

  if (!headers?.authorization) isAuthorized = false;
  else {
    try {
      const authUrl = (process.env.ZILCH_URL ?? "") + "/me";
      const { data } = await axios.get<TAuthMiddlewareResponse>(authUrl, {
        headers: { authorization: headers.authorization },
      });

      isAuthorized = Boolean(data?.user);
    } catch (error) {
      console.log(error);
      isAuthorized = false;
    }
  }

  if (!isAuthorized) throwException(res, 401, "user is not authorized");

  next();
};
