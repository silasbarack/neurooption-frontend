import { Link } from "react-router-dom";

export default function TournamentsPage() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1>Tournaments</h1>
        <p>Active and upcoming trading tournaments will appear here.</p>
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
  link: {
    color: "#74f2a7",
  },
};
