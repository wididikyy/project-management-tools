/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "./prisma";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Sign in",
            id: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const user = await prisma.users.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !(await compare(credentials.password, user.password!))) {
                    return null;
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    username: user.username,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role,
                    username: token.username,
                },
            };
        },
        jwt: ({ token, user }) => {
            if (user) {
                const u = user as unknown as any;
                return {
                    ...token,
                    id: u.id,
                    role: u.role,
                    username: u.username,
                };
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET
};