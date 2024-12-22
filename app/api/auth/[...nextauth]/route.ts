import prisma from '@/prisma/client';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
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
                    where: { email: credentials?.email },
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
            // @ts-ignore
            if (user) token.roles = user.roles;
            return token;
        },
    },
});

export { handler as GET, handler as POST };
