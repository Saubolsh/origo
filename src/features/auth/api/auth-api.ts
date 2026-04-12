import { AUTH_API_BASE, AUTH_USE_MOCK } from "@/shared/config";
import type { AuthUser } from "../model/types";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Base64 (not URL-safe) for arbitrary UTF-8 — `btoa` alone throws on Cyrillic etc. */
function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function encodeJwtMock(email: string, firstName: string, lastName: string) {
  const header = utf8ToBase64(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = utf8ToBase64(
    JSON.stringify({
      sub: email,
      first_name: firstName,
      last_name: lastName,
      mock: true,
      iat: Math.floor(Date.now() / 1000),
    })
  );
  return `${header}.${payload}.mock-signature`;
}

function pickToken(data: Record<string, unknown>): string | null {
  const direct =
    (typeof data.access_token === "string" && data.access_token) ||
    (typeof data.accessToken === "string" && data.accessToken) ||
    (typeof data.token === "string" && data.token) ||
    (typeof data.jwt === "string" && data.jwt);
  if (direct) return direct;
  const inner = data.data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    return pickToken(inner as Record<string, unknown>);
  }
  return null;
}

function pickUser(
  data: Record<string, unknown>,
  fallback: AuthUser
): AuthUser {
  const u = data.user;
  if (u && typeof u === "object" && !Array.isArray(u)) {
    const o = u as Record<string, unknown>;
    const email = typeof o.email === "string" ? o.email : fallback.email;
    const first =
      (typeof o.first_name === "string" && o.first_name) ||
      (typeof o.firstName === "string" && o.firstName) ||
      fallback.firstName;
    const last =
      (typeof o.last_name === "string" && o.last_name) ||
      (typeof o.lastName === "string" && o.lastName) ||
      fallback.lastName;
    return { email, firstName: first, lastName: last };
  }
  return fallback;
}

async function parseJsonResponse(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {};
  }
}

export type AuthResult = { token: string; user: AuthUser };

export async function loginRequest(
  email: string,
  password: string
): Promise<AuthResult> {
  const fallbackUser: AuthUser = {
    email,
    firstName: "",
    lastName: "",
  };

  if (AUTH_USE_MOCK) {
    await delay(450);
    if (!email.includes("@") || password.length < 1) {
      throw new Error("Invalid email or password");
    }
    const token = encodeJwtMock(email, "Demo", "User");
    return {
      token,
      user: { email, firstName: "Demo", lastName: "User" },
    };
  }

  const res = await fetch(`${AUTH_API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = (await parseJsonResponse(res)) as Record<string, unknown>;
  if (!res.ok) {
    const err =
      typeof data.error === "string"
        ? data.error
        : `Request failed (${res.status})`;
    throw new Error(err);
  }
  const token = pickToken(data);
  if (!token) {
    throw new Error("Invalid response: no token");
  }
  return { token, user: pickUser(data, fallbackUser) };
}

export async function registerRequest(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResult> {
  const fallbackUser: AuthUser = { email, firstName, lastName };

  if (AUTH_USE_MOCK) {
    await delay(550);
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    const token = encodeJwtMock(email, firstName, lastName);
    return { token, user: fallbackUser };
  }

  const res = await fetch(`${AUTH_API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    }),
  });
  const data = (await parseJsonResponse(res)) as Record<string, unknown>;
  if (!res.ok) {
    const err =
      typeof data.error === "string"
        ? data.error
        : `Request failed (${res.status})`;
    throw new Error(err);
  }
  const token = pickToken(data);
  if (!token) {
    // Some APIs return only user on register; issue a client-side session token for demo
    const synthetic = encodeJwtMock(email, firstName, lastName);
    return { token: synthetic, user: pickUser(data, fallbackUser) };
  }
  return { token, user: pickUser(data, fallbackUser) };
}

export async function forgotPasswordRequest(email: string): Promise<void> {
  if (AUTH_USE_MOCK) {
    await delay(500);
    if (!email.includes("@")) {
      throw new Error("Invalid email");
    }
    return;
  }

  const res = await fetch(`${AUTH_API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = (await parseJsonResponse(res)) as Record<string, unknown>;
    const err =
      typeof data.error === "string"
        ? data.error
        : `Request failed (${res.status})`;
    throw new Error(err);
  }
}
