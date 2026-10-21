import { NextResponse, type NextRequest } from "next/server";
import { buildCsp, createNonce } from "@/lib/security/csp";

export function middleware(request: NextRequest) {
  const nonce = createNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-request-id", crypto.randomUUID());

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("Content-Security-Policy", buildCsp(nonce));
  response.headers.set("x-nonce", nonce);

  // CSRF: require same-origin for state-changing API calls with cookie auth
  if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    const path = request.nextUrl.pathname;
    if (path.startsWith("/api/") && !path.startsWith("/api/mcp") && !path.startsWith("/api/v1/bot")) {
      const origin = request.headers.get("origin");
      const host = request.headers.get("host");
      if (origin && host) {
        try {
          const o = new URL(origin);
          if (o.host !== host) {
            return NextResponse.json(
              { title: "CSRF check failed", status: 403 },
              { status: 403, headers: { "content-type": "application/problem+json" } },
            );
          }
        } catch {
          return NextResponse.json(
            { title: "Invalid origin", status: 403 },
            { status: 403 },
          );
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
