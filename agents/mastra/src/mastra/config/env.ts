import { config } from "dotenv";
import { resolve } from "node:path";
import { z } from "zod";
import {
  defaultLlmModelName,
  isSupportedLlmModelName,
  parseLlmModelName,
  unsupportedLlmModelMessage,
} from "./llm-models";

config({ path: resolve(process.cwd(), "../../.env"), override: false });
config({ path: resolve(process.cwd(), ".env"), override: false });

const envSchema = z.object({
  OPENROUTER_API_KEY: z.string().min(1, "OPENROUTER_API_KEY is required."),
  AGENT_LLM_MODEL: z
    .string()
    .min(1)
    .default(defaultLlmModelName)
    .refine(isSupportedLlmModelName, {
      message: unsupportedLlmModelMessage(),
    })
    .transform(parseLlmModelName),
  MASTRA_HOST: z.string().min(1).default("0.0.0.0"),
  MASTRA_PORT: z.coerce.number().int().positive().default(4111),
});

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(): AppEnv {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid environment configuration: ${details}`);
  }

  return parsed.data;
}
