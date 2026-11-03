import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../../api/api";
import { clearToken, clearUser, getToken } from "../../utils/storage";

/**
 * On the sign-in page: someone who is still signed in
 * (for example after switching the browser to its desktop site) goes
 * straight back to the trading screen instead of signing in again. The
 * saved session is only dropped when the backend says it is invalid.
 */
export function useSignedInRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/account/me`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((response) => {
        if (response.ok) navigate("/trading", { replace: true });
        else if (response.status === 401) {
          clearToken();
          clearUser();
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [navigate]);
}
