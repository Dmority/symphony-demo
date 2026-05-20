import assert from "node:assert/strict";
import { test } from "node:test";
import {
  defaultLlmModelName,
  getLlmModelDefinition,
  isSupportedLlmModelName,
  parseLlmModelName,
  supportedLlmModelNames,
} from "./llm-models.js";

void test("defaults to the supported grok model", () => {
  assert.equal(defaultLlmModelName, "grok");
  assert.deepEqual(supportedLlmModelNames, ["grok"]);
  assert.deepEqual(getLlmModelDefinition(defaultLlmModelName), {
    name: "grok",
    label: "Grok",
    providerModel: "openrouter/x-ai/grok-4.3",
  });
});

void test("rejects unsupported model names", () => {
  assert.equal(isSupportedLlmModelName("grok"), true);
  assert.equal(isSupportedLlmModelName("gpt-4.1"), false);
  assert.equal(isSupportedLlmModelName("x-ai/grok-4.3"), false);
  assert.throws(
    () => parseLlmModelName("gpt-4.1"),
    /Unsupported LLM model\. Supported models: grok\./,
  );
});
