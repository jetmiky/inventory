import NextAuth, { type DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface User {
        id: string;
        email: string;
        roles: string[];
    }

    interface Session {
        user: User & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** User available roles */
        roles: string[];
    }
}
