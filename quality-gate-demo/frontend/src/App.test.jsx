import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import App, { GATE_CHECKS } from "./App";

const okResponse = (body) => ({ ok: true, json: () => Promise.resolve(body) });

afterEach(() => vi.restoreAllMocks());

describe("App", () => {
  test("shows ok when the API is healthy", async () => {
    global.fetch = vi.fn().mockResolvedValue(okResponse({ status: "ok" }));
    render(<App />);
    expect(await screen.findByText("API status: ok")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith("/api/health");
  });

  test("shows down when the request fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network"));
    render(<App />);
    expect(await screen.findByText("API status: down")).toBeInTheDocument();
  });

  test("shows down on a non-2xx response", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    render(<App />);
    expect(await screen.findByText("API status: down")).toBeInTheDocument();
  });

  test("shows down when the API reports a different status", async () => {
    global.fetch = vi.fn().mockResolvedValue(okResponse({ status: "degraded" }));
    render(<App />);
    expect(await screen.findByText("API status: down")).toBeInTheDocument();
  });

  test("re-checks when the button is clicked", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce(okResponse({ status: "ok" }));
    render(<App />);
    expect(await screen.findByText("API status: down")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Check again" }));
    expect(await screen.findByText("API status: ok")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test("lists every gate check", async () => {
    global.fetch = vi.fn().mockResolvedValue(okResponse({ status: "ok" }));
    render(<App />);
    await screen.findByText("API status: ok");
    for (const name of GATE_CHECKS) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });
});
