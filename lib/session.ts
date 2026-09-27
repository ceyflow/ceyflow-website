// Edge-safe session signing, shared by middleware and server code.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "cf_session";
export type Session = { uid: number; email: string; name: string };

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret || "dev-only-secret-change-me");
}

export async function signSession(s: Session) {
  return new SignJWT(s).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key());
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, key());
    return { uid: payload.uid as number, email: payload.email as string, name: payload.name as string };
  } catch {
    return null;
  }
}
