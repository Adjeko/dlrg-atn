import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import PocketBase from 'pocketbase';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  const pb = new PocketBase('http://127.0.0.1:8090');
  // console.log(JSON.stringify(request.cookies.get('pb_test')))

  pb.authStore.loadFromCookie(request.cookies.get('pb_auth')?.value + "")
  
  if (!pb.authStore.isValid &&
    (request.nextUrl.pathname == '/'
      || request.nextUrl.pathname.startsWith('/onboarding')
      || request.nextUrl.pathname.startsWith('/course'))) {

    const redirect_to = new URL("/signin", request.url);
    redirect_to.searchParams.set('originUrl', request.nextUrl.pathname);
    return NextResponse.redirect(redirect_to)
  }

  // return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/",
};