const llmModelDefinitions = {
  grok: {
    label: "Grok",
    providerModel: "openrouter/x-ai/grok-4.3",
  },
} as const;

export type LlmModelName = keyof typeof llmModelDefinitions;

export interface LlmModelDefinition {
  readonly name: LlmModelName;
  readonly label: string;
  readonly providerModel: string;
}

export const defaultLlmModelName = "grok" satisfies LlmModelName;

export const supportedLlmModelNames = Object.keys(
  llmModelDefinitions,
) as readonly LlmModelName[];

export function unsupportedLlmModelMessage(): string {
  return `Unsupported LLM model. Supported models: ${supportedLlmModelNames.join(", ")}.`;
}

export function isSupportedLlmModelName(value: string): value is LlmModelName {
  return Object.hasOwn(llmModelDefinitions, value);
}

export function parseLlmModelName(value: string): LlmModelName {
  if (isSupportedLlmModelName(value)) {
    return value;
  }

  throw new Error(unsupportedLlmModelMessage());
}

export function getLlmModelDefinition(name: LlmModelName): LlmModelDefinition {
  const definition = llmModelDefinitions[name];

  return {
    name,
    label: definition.label,
    providerModel: definition.providerModel,
  };
}
