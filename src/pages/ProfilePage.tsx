import { Link, useNavigate } from "react-router-dom";

type StoredUser = {
  id?: string;
  email?: string;
  fullName?: string;
};

export default function ProfilePage() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("neurooption_user");
  const user: StoredUser | null = storedUser ? JSON.parse(storedUser) : null;

  function handleLogout() {
    localStorage.removeItem("neurooption_token");
    localStorage.removeItem("neurooption_user");
    navigate("/login", { replace: true });
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>Profile</h1>

        <div style={styles.row}>
          <span style={styles.label}>Name</span>
          <strong>{user?.fullName || "NeuroOption User"}</strong>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Email</span>
          <strong>{user?.email || "No email found"}</strong>
        </div>

        <div style={styles.actions}>
          <Link style={styles.link} to="/trading">
            Back to Trading
          </Link>

          <Link style={styles.dangerLink} to="/delete-account">
            Delete Account
          </Link>

          <button style={styles.button} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#090d17",
    color: "#ffffff",
    fontFamily: "Roboto, sans-serif",
    display: "grid",
    placeItems: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    background: "#111827",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 22px 80px rgba(0,0,0,0.35)",
  },
  title: {
    color: "#fff",
    marginBottom: "24px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  label: {
    color: "#94a3b8",
  },
  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "24px",
  },
  link: {
    color: "#77f2a1",
    textDecoration: "none",
  },
  dangerLink: {
    color: "#ff6b6b",
    textDecoration: "none",
  },
  button: {
    background: "#1f2937",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer",
  },
};