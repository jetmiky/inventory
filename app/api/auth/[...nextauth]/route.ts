import prisma from '@/prisma/client';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const config = {
    session: {
        strategy: 'jwt',
    },

    pages: {
        signIn: '/auth/login',
    },

    providers: [
        CredentialsProvider({
            name: 'Credentials',

            credentials: {
                email: { type: 'text', label: 'email' },
                password: { type: 'password', label: 'password' },
            },

            async authorize(credentials, req) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email, deletedAt: null },
                    include: { roles: true },
                });

                if (!user) return null;

                const isPasswordMatched = user.password === credentials?.password;
                if (isPasswordMatched) {
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                        roles: user.roles.map((role) => role.usid),
                    };
                }

                return null;
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) token.roles = user.roles;
            return token;
        },

        async session({ session, token }) {
            return {
                ...session,
                user: {
                    name: token.name,
                    email: token.email,
                    roles: token.roles,
                },
            };
        },
    },
} satisfies NextAuthOptions;

const handler = NextAuth(config);

export { config };
export { handler as GET, handler as POST };
