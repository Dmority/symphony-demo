import { Agent } from "@mastra/core/agent";
import { loadEnv } from "../config/env";
import { getLlmModelDefinition } from "../config/llm-models";

const env = loadEnv();
const llmModel = getLlmModelDefinition(env.AGENT_LLM_MODEL);

export const playgroundAgent = new Agent({
  id: "playgroundAgent",
  name: "Playground Agent",
  instructions: [
    "You are a concise chat playground assistant.",
    "Answer directly, ask clarifying questions only when needed, and never request secrets.",
    "If a user includes credentials or tokens, tell them not to share secrets and avoid repeating the value.",
  ].join(" "),
  model: llmModel.providerModel,
});
