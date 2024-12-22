import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.redirect(new URL('/auth/login', request.url));
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|icon|auth/login).*)'],
};
