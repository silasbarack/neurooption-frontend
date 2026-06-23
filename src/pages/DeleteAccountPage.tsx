import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPages.css";

type DeleteResponse = {
  message?: string;
  data?: {
    message?: string;
  };
};

const API_URL =
  import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";

export default function DeleteAccountPage() {
  const navigate = useNavigate();

  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (confirmText.trim().toUpperCase() !== "DELETE") {
        throw new Error("Type DELETE to confirm account deletion");
      }

      const token = localStorage.getItem("neurooption_token");
      const storedUser = JSON.parse(
        localStorage.getItem("neurooption_user") || "{}"
      );

      if (!token || !storedUser?.id) {
        throw new Error("You are not signed in");
      }

      const response = await fetch(`${API_URL}/users/me/${storedUser.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result: DeleteResponse = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || result.data?.message || "Delete account failed"
        );
      }

      localStorage.removeItem("neurooption_token");
      localStorage.removeItem("neurooption_user");

      navigate("/login", { replace: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Cannot connect to backend";

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">N</div>
          <h1>NeuroOption</h1>
        </div>

        <h2>Delete Account</h2>

        <p className="auth-subtitle">
          This action is permanent. <Link to="/profile">Go back</Link>
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {message && <div className="auth-error">{message}</div>}

          <label htmlFor="confirmText">Type DELETE to confirm</label>
          <input
            id="confirmText"
            type="text"
            placeholder="DELETE"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "DELETING..." : "DELETE ACCOUNT"}
          </button>
        </form>
      </section>
    </main>
  );
}