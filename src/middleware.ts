import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getPocketBase } from './services/pocketbase';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  const pb = getPocketBase();
  // console.log(JSON.stringify(request.cookies.get('pb_test')))
  
  pb.authStore.loadFromCookie(request.cookies.get('pb_auth')?.value + "")
  console.log("Authstore valid:" + pb.authStore.isValid.toString() + " URL: " + request.nextUrl.pathname.toString())
  if (!pb.authStore.isValid &&
    (request.nextUrl.pathname == '/'
      || request.nextUrl.pathname.startsWith('/onboarding')
      || request.nextUrl.pathname.startsWith('/course'))) {

    const redirect_to = new URL("/signin", request.url);
    redirect_to.searchParams.set('originUrl', request.nextUrl.pathname);
    return NextResponse.redirect(redirect_to)
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/",
};