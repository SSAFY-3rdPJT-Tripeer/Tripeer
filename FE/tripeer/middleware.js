import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/plan")) {
    const cookieStore = cookies();
    if (!cookieStore.has("Authorization")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/place")) {
    const cookieStore = cookies();
    if (!cookieStore.has("Authorization")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/diary")) {
    const cookieStore = cookies();
    if (!cookieStore.has("Authorization")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export default middleware;
