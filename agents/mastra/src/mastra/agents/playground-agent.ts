import { Agent } from "@mastra/core/agent";
import { loadEnv } from "../config/env";

const env = loadEnv();
const model = env.OPENROUTER_MODEL.startsWith("openrouter/")
  ? env.OPENROUTER_MODEL
  : `openrouter/${env.OPENROUTER_MODEL}`;

export const playgroundAgent = new Agent({
  id: "playgroundAgent",
  name: "Playground Agent",
  instructions: [
    "You are a concise chat playground assistant.",
    "Answer directly, ask clarifying questions only when needed, and never request secrets.",
    "If a user includes credentials or tokens, tell them not to share secrets and avoid repeating the value.",
  ].join(" "),
  model,
});
