import { NextRequest, NextResponse } from "next/server";

function normalizeApiBase(): string {
  const raw =
    process.env.NEXT_PUBLIC_ORIGO_API_BASE?.trim() ?? "https://api.origo.kz";
  return raw.replace(/\/$/, "");
}

/** Same-origin proxy for browser load-more; avoids CORS on the Origo API. */
export async function GET(request: NextRequest) {
  const search = request.nextUrl.search;
  const upstream = `${normalizeApiBase()}/api/v1/products${search}`;
  const res = await fetch(upstream, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: {
      "Content-Type":
        res.headers.get("content-type") ?? "application/json; charset=utf-8",
    },
  });
}
