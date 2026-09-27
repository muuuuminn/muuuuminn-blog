import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createRemoteJWKSet, jwtVerify } from "jose";

type HeaderReader = Pick<Headers, "get">;

type CmsAuthEnv = CloudflareEnv & {
  ADMIN_EMAIL?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  CMS_DEV_BYPASS?: string;
};

export type AdminIdentity = {
  email: string;
};

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function normalizeTeamDomain(value: string): string {
  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function getKeySet(teamDomain: string) {
  const existing = keySets.get(teamDomain);
  if (existing) {
    return existing;
  }

  const keySet = createRemoteJWKSet(
    new URL(`https://${teamDomain}/cdn-cgi/access/certs`),
  );
  keySets.set(teamDomain, keySet);
  return keySet;
}

export async function verifyAdmin(
  requestHeaders: HeaderReader,
): Promise<AdminIdentity | null> {
  const context = await getCloudflareContext({ async: true });
  const env = context.env as CmsAuthEnv;

  const developmentBypass =
    env.CMS_DEV_BYPASS === "true" || process.env.CMS_DEV_BYPASS === "true";

  if (process.env.NODE_ENV === "development" && developmentBypass) {
    return { email: env.ADMIN_EMAIL || "local-admin" };
  }

  const teamDomain = normalizeTeamDomain(env.ACCESS_TEAM_DOMAIN || "");
  const audience = env.ACCESS_AUD || "";
  const adminEmail = (env.ADMIN_EMAIL || "").trim().toLowerCase();
  const token = requestHeaders.get("cf-access-jwt-assertion") || "";

  if (!teamDomain || !audience || !adminEmail || !token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getKeySet(teamDomain), {
      audience,
      issuer: `https://${teamDomain}`,
    });
    const email = typeof payload.email === "string" ? payload.email : "";

    if (email.toLowerCase() !== adminEmail) {
      return null;
    }

    return { email };
  } catch {
    return null;
  }
}

export function hasSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return origin !== null && origin === new URL(request.url).origin;
}
