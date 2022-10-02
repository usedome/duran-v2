import { Express } from "express";
import mongoose from "mongoose";
import http from "http";

export const bootstrap = async (app: Express) => {
  const port = Number(process.env.APP_PORT ?? "3001");
  app.set("port", port);

  try {
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    await mongoose.connect(uri);
    console.log("Connected to database");
  } catch (error) {
    console.error("Failed to connect to database");
    process.exit();
  }

  const server = http.createServer(app);
  server.listen(port);

  server.on("error", () => {
    console.log("error");
  });

  server.on("listening", () => {
    const addr = server.address();
    const bind =
      typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
  });
};
