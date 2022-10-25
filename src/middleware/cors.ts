import cors from "cors";

const corsOptions = {
  origin: (process.env.ENABLED_CORS_DOMAINS ?? "").split(","),
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors({ ...corsOptions });
