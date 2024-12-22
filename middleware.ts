import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const getDefaultRouteOf = (role: string) => {
    switch (role) {
        case 'administrator':
            return '/users';
        case 'manager-inventory':
            return '/inventories';
        case 'staff-inventory':
            return '/inventory-orders';
        default:
            return '/';
    }
};

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.redirect(new URL('/auth/login', request.url));

    const path = request.nextUrl.pathname;
    const defaultRoute = getDefaultRouteOf(token.roles[0]);

    if (path.startsWith('/inventory-orders') || path.startsWith('/inventory-usages')) {
        if (!token.roles.includes('staff-inventory')) return NextResponse.redirect(new URL(defaultRoute, request.url));
    }

    if (path.startsWith('/suppliers') || path.startsWith('/inventories') || path.startsWith('/inventory-types') || path.startsWith('/inventory-brands')) {
        if (!token.roles.includes('manager-inventory')) return NextResponse.redirect(new URL(defaultRoute, request.url));
    }

    if (path.startsWith('/users')) {
        if (!token.roles.includes('administrator')) return NextResponse.redirect(new URL(defaultRoute, request.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|icon|auth).*)'],
};
