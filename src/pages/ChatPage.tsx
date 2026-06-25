import React from "react";
import { PageHeader } from "../components/common";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, type ChatMessage } from "../data/mockData";

export default function ChatPage() {
  const [activeConvoId, setActiveConvoId] = React.useState(MOCK_CONVERSATIONS[0].id);
  const [draft, setDraft] = React.useState("");
  const [extraMessages, setExtraMessages] = React.useState<ChatMessage[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const activeConvo = MOCK_CONVERSATIONS.find((c) => c.id === activeConvoId) ?? MOCK_CONVERSATIONS[0];

  const messages = [...MOCK_MESSAGES, ...extraMessages].filter(
    (message) => message.conversationId === activeConvoId
  );

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, activeConvoId]);

  function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;

    const message: ChatMessage = {
      id: `local-${Date.now()}`,
      conversationId: activeConvoId,
      sender: "user",
      text: draft.trim(),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };

    setExtraMessages((current) => [...current, message]);
    setDraft("");
  }

  return (
    <main className="np-page">
      <div className="np-container np-container-wide">
        <PageHeader title="Chat" subtitle="Support and community conversations, all in one place." />

        <div className="np-chat-shell">
          <aside className="np-chat-sidebar">
            {MOCK_CONVERSATIONS.map((convo) => (
              <button
                key={convo.id}
                type="button"
                className={`np-chat-convo ${convo.id === activeConvoId ? "active" : ""}`}
                onClick={() => setActiveConvoId(convo.id)}
              >
                <div className="np-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                  {convo.name.slice(0, 2).toUpperCase()}
                </div>

                <div className="np-chat-convo-text">
                  <div className="np-chat-convo-name">{convo.name}</div>
                  <div className="np-chat-convo-preview">{convo.lastMessage}</div>
                </div>

                {convo.unread > 0 && <span className="np-chat-unread">{convo.unread}</span>}
              </button>
            ))}
          </aside>

          <section className="np-chat-main">
            <div className="np-chat-header">
              <div className="np-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                {activeConvo.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{activeConvo.name}</div>
                <div className="np-text-muted" style={{ fontSize: 11.5 }}>
                  {activeConvo.online ? "🟢 Online" : "⚪ Offline"}
                </div>
              </div>
            </div>

            <div className="np-chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`np-chat-bubble-row ${message.sender === "user" ? "user" : ""}`}>
                  <div className={`np-chat-bubble ${message.sender === "user" ? "user" : "support"}`}>
                    {message.text}
                    <span className="np-chat-bubble-time">{message.time}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="np-chat-input-row" onSubmit={handleSend}>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit" className="np-btn np-btn-primary">
                Send
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
