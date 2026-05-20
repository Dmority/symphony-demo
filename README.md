# Symphony Demo

Simple chat playground built with React, Mastra, OpenRouter, TypeScript, and pnpm.

## Structure

```text
frontend/
agents/mastra/
```

## Requirements

- Node.js 22 or later
- pnpm 9.15.4
- Aikido Safe Chain
- OpenRouter API key

## Setup

Install Aikido Safe Chain before installing dependencies. Safe Chain wraps `pnpm` and blocks known malicious packages before they are installed.

```sh
curl -fsSL https://github.com/AikidoSec/safe-chain/releases/latest/download/install-safe-chain.sh | sh
safe-chain setup
```

Restart the shell after `safe-chain setup`, then install dependencies with pnpm.

```sh
pnpm install --frozen-lockfile
```

Create a local environment file from `.env.example` and set `OPENROUTER_API_KEY`.
The Mastra agent loads OpenRouter settings from process environment variables and from `.env` files at the repository root or `agents/mastra`.

The default model is `x-ai/grok-4.3`. Override it with `OPENROUTER_MODEL` when needed.

## Development

```sh
pnpm dev
```

- Frontend: http://localhost:5173
- Mastra server: http://localhost:4111
- Chat route: http://localhost:4111/chat/playgroundAgent

## Validation

```sh
pnpm run typecheck
pnpm run lint
pnpm test
pnpm audit
```

## Supply Chain Notes

Use `pnpm` as the only TypeScript package manager. Do not introduce `package-lock.json`, `yarn.lock`, or `bun.lockb`.

Review every lockfile change for package name similarity, unexpected registry URLs, new lifecycle scripts, dependency confusion risk, and newly published or compromised packages.
