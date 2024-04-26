import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/plan")) {
    const cookieStore = cookies();
    console.log(cookieStore.has("_ga"));
    // const token = localStorage.getItem("accessToken");
    // console.log(token);
    //   NextResponse.redirect('/login')
  }
}

export default middleware;
