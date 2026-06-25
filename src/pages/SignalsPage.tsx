import { Link } from "react-router-dom";

export default function SignalsPage() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.heading}>Signals</h1>
        <p>No signals yet.</p>
        <small style={styles.small}>
          Signals will appear here when your signal service is connected.
        </small>
        <Link style={styles.link} to="/trading">Back to Trading</Link>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#070b14",
    color: "#fff",
    fontFamily: "Roboto, sans-serif",
    display: "grid",
    placeItems: "center",
    padding: "24px",
  },
  card: {
    background: "#111827",
    padding: "28px",
    borderRadius: "20px",
    maxWidth: "620px",
    width: "100%",
  },
  heading: {
    color: "#fff",
  },
  small: {
    display: "block",
    marginTop: "8px",
    color: "#9aa4b8",
  },
  link: {
    display: "inline-block",
    marginTop: "16px",
    color: "#74f2a7",
  },
};
