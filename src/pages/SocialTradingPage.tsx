import { Link } from "react-router-dom";

export default function SocialTradingPage() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.heading}>Social Trading</h1>
        <p>Follow and copy other traders&apos; strategies here.</p>
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
  link: {
    color: "#74f2a7",
  },
};