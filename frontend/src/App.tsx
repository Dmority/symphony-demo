import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";

const fallbackChatUrl = "/chat/playgroundAgent";

function getChatUrl(): string {
  const configuredUrl = import.meta.env.VITE_MASTRA_CHAT_URL as string | undefined;

  if (configuredUrl === undefined || configuredUrl.trim() === "") {
    return fallbackChatUrl;
  }

  try {
    const url = new URL(configuredUrl);
    return url.pathname;
  } catch {
    return configuredUrl;
  }
}

function textFromParts(parts: readonly { type: string; text?: string }[]): string {
  return parts
    .map((part) => (part.type === "text" ? part.text ?? "" : ""))
    .join("");
}

export function App() {
  const [input, setInput] = useState("");
  const api = useMemo(() => getChatUrl(), []);
  const { error, messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api }),
  });

  const isBusy = status === "submitted" || status === "streaming";
  const canSend = input.trim().length > 0 && !isBusy;

  return (
    <main className="app-shell">
      <section className="workspace" aria-label="Chat playground">
        <header className="topbar">
          <div>
            <h1>Chat Playground</h1>
            <p>OpenRouter backed Mastra agent</p>
          </div>
          <div className="status-pill" data-state={status}>
            {status}
          </div>
        </header>

        <div className="thread" aria-live="polite">
          {messages.length === 0 ? (
            <div className="empty-state">
              <span>Ask the playground agent a question.</span>
            </div>
          ) : (
            messages.map((message) => (
              <article className="message" data-role={message.role} key={message.id}>
                <div className="message-role">
                  {message.role === "user" ? "You" : "Agent"}
                </div>
                <p>{textFromParts(message.parts)}</p>
              </article>
            ))
          )}
        </div>

        {error ? <div className="error-banner">{error.message}</div> : null}

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            const text = input.trim();

            if (text.length === 0 || isBusy) {
              return;
            }

            void sendMessage({ text });
            setInput("");
          }}
        >
          <textarea
            aria-label="Message"
            onChange={(event) => {
              setInput(event.target.value);
            }}
            placeholder="Type a message..."
            rows={3}
            value={input}
          />
          <div className="composer-actions">
            <button
              disabled={!isBusy}
              onClick={() => {
                void stop();
              }}
              type="button"
            >
              Stop
            </button>
            <button disabled={!canSend} type="submit">
              Send
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
