import { chatRoute } from "@mastra/ai-sdk";
import { Mastra } from "@mastra/core/mastra";
import type { ApiRoute } from "@mastra/core/server";
import { PinoLogger } from "@mastra/loggers";
import { playgroundAgent } from "./agents/playground-agent";
import { loadEnv } from "./config/env";

const env = loadEnv();
const chatApiRoute = chatRoute({
  path: "/chat/:agentId",
}) as unknown as ApiRoute;

export const mastra = new Mastra({
  agents: {
    playgroundAgent,
  },
  server: {
    host: env.MASTRA_HOST,
    port: env.MASTRA_PORT,
    cors: {
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    },
    apiRoutes: [chatApiRoute],
  },
  logger: new PinoLogger({
    name: "mastra-agent",
    level: "info",
  }),
});
