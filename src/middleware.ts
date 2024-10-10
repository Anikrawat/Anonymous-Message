import {auth} from "@/auth"
import { NextResponse } from "next/server"

export default auth((req)=>{
    const session = req.auth
    const url = req.nextUrl

    if (session && (
        url.pathname.startsWith('/signin')||
        url.pathname.startsWith('/signup')||
        url.pathname.startsWith('/verify')
    )) {
        return NextResponse.redirect(new URL('/dashboard',req.url))
    }

    if(!session && (
        url.pathname.startsWith("/dashboard")
    )){
        const redirectUrl = new URL("/signup", req.url);
        redirectUrl.searchParams.set("callbackUrl", url.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next()
})

export const config = {
    matcher:[
        '/signin',
        '/signup',
        '/',
        '/dashboard',
        '/verify/:path*'
    ]
}