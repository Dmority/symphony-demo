import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const mastraChatUrl =
    env.VITE_MASTRA_CHAT_URL ?? "http://localhost:4111/chat/playgroundAgent";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/chat": {
          target: new URL(mastraChatUrl).origin,
          changeOrigin: true,
        },
      },
    },
  };
});
