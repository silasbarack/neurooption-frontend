import React from "react";
import { Link } from "react-router-dom";
import { PageHeader, EmptyState } from "../components/common";
import { FAQ_CATEGORIES, FAQ_ITEMS } from "../data/mockData";

const GUIDE_STEPS = [
  { title: "Create your account", description: "Sign up and verify your email to get started." },
  { title: "Practice on Demo", description: "Use the Demo account to learn the platform risk-free." },
  { title: "Fund your account", description: "Deposit via M-Pesa, Airtel Money, Bank, Card, or Binance Pay." },
  { title: "Place your first trade", description: "Pick an asset, set your expiry and amount, then BUY or SELL." },
];

export default function HelpPage() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("All");
  const [openId, setOpenId] = React.useState<string | null>(null);

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = category === "All" || item.categoryId === category;
    const matchesQuery =
      query.trim().length === 0 || item.question.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <main className="np-page">
      <div className="np-container">
        <PageHeader
          title="Help Center"
          subtitle="Find answers fast, or reach out to our support team."
          actions={
            <Link to="/chat" className="np-btn np-btn-primary">
              💬 Contact Support
            </Link>
          }
        />

        <div className="np-search">
          <span className="np-search-icon">🔍</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for help, e.g. withdrawal, KYC, OTC"
          />
        </div>

        <div className="np-tabs">
          <button
            type="button"
            className={`np-tab ${category === "All" ? "active" : ""}`}
            onClick={() => setCategory("All")}
          >
            All
          </button>
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`np-tab ${category === cat.id ? "active" : ""}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <section className="np-section">
          {filteredFaqs.length === 0 ? (
            <EmptyState icon="❓" title="No results" description="Try a different search term or category." />
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {filteredFaqs.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <div key={item.id} className="np-card" style={{ padding: "14px 18px" }}>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        background: "transparent",
                        border: 0,
                        color: "inherit",
                        cursor: "pointer",
                        textAlign: "left",
                        font: "inherit",
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{item.question}</span>
                      <span className="np-text-muted">{isOpen ? "−" : "+"}</span>
                    </button>

                    {isOpen && (
                      <p className="np-text-muted" style={{ marginTop: 10, fontSize: 13.5 }}>
                        {item.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="np-section">
          <div className="np-section-head">
            <h2>Beginner's Guide</h2>
          </div>

          <div className="np-grid np-grid-4">
            {GUIDE_STEPS.map((step, index) => (
              <div key={step.title} className="np-card">
                <div className="np-text-muted" style={{ fontSize: 11, fontWeight: 800 }}>
                  STEP {index + 1}
                </div>
                <div style={{ fontWeight: 800, margin: "6px 0 4px" }}>{step.title}</div>
                <div className="np-text-muted" style={{ fontSize: 13 }}>
                  {step.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
