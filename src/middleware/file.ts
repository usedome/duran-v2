import multer from "multer";

const storage = multer.diskStorage({});

export const fileMiddleware = multer({ storage });
