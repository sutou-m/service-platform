import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (path.startsWith("/contractor") && !path.startsWith("/contractor/login")) {
    if (!token || token.role !== "CONTRACTOR") {
      return NextResponse.redirect(new URL("/contractor/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/contractor/:path*"],
};
