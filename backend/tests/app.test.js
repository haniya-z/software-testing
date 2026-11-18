const request = require("supertest");
const app = require("../src/app");

describe("GET /api/health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("broken");
    expect(typeof res.body.uptime).toBe("number");
  });
});

describe("GET /api/version", () => {
  it("returns name and version", async () => {
    const res = await request(app).get("/api/version");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ name: "quality-gate-backend", version: "1.0.0" });
  });
});

describe("POST /api/echo", () => {
  it("echoes a trimmed message", async () => {
    const res = await request(app).post("/api/echo").send({ message: "  hi  " });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("hi");
  });

  it("rejects an empty message", async () => {
    const res = await request(app).post("/api/echo").send({ message: "   " });
    expect(res.status).toBe(400);
  });

  it("rejects a missing body", async () => {
    const res = await request(app).post("/api/echo");
    expect(res.status).toBe(400);
  });
});

describe("unknown API route", () => {
  it("returns 404 JSON", async () => {
    const res = await request(app).get("/api/nope");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Not found");
  });
});
