import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "";

export const GATE_CHECKS = [
  "Lint",
  "Unit tests and coverage",
  "Dependency audit",
  "Secret scan",
  "CodeQL analysis",
  "Container image scan",
  "End-to-end smoke test",
  "Lighthouse performance and accessibility",
];

const STATUS_COPY = {
  loading: "Checking the API",
  ok: "The API is running",
  down: "The API is not responding",
};

export default function App() {
  const [status, setStatus] = useState("loading");

  const checkHealth = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/api/health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStatus(data.status === "ok" ? "ok" : "down");
    } catch {
      setStatus("down");
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return (
    <main className="page">
      <h1>Quality Gate Demo</h1>

      <section className="panel" aria-labelledby="status-heading">
        <h2 id="status-heading">Service status</h2>
        <p className="status" data-state={status} role="status">
          <span className="dot" aria-hidden="true" />
          <span data-testid="api-status">API status: {status}</span>
        </p>
        <p className="hint">{STATUS_COPY[status]}.</p>
        <button type="button" onClick={checkHealth} disabled={status === "loading"}>
          Check again
        </button>
      </section>

      <section className="panel" aria-labelledby="gate-heading">
        <h2 id="gate-heading">What must pass before merge</h2>
        <ul className="checks">
          {GATE_CHECKS.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
