
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        return user
    } catch (error) {
        console.error("Failed to fetch user:", error)
        throw new Error("Failed to fetch user.")
    }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    console.log("LOGIN_DEBUG: Intentando autenticar:", email);
                    const user = await getUser(email);
                    if (!user) {
                        console.log("LOGIN_DEBUG: Usuario no encontrado en DB:", email);
                        return null;
                    }

                    console.log("LOGIN_DEBUG: Usuario encontrado, comparando contraseñas...");
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) {
                        console.log("LOGIN_DEBUG: Autenticación exitosa para:", email);
                        return user;
                    } else {
                        console.log("LOGIN_DEBUG: Contraseña incorrecta para:", email);
                    }
                } else {
                    console.log("LOGIN_DEBUG: Error de validación Zod:", parsedCredentials.error.format());
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirigir a login
            } else if (isLoggedIn && nextUrl.pathname === '/login') {
                // Si está logueado y va a login, mandarlo a su dashboard según su rol
                const role = auth.user.role;
                if (role === 'TEACHER') {
                    return Response.redirect(new URL('/dashboard/teacher', nextUrl));
                }
                return Response.redirect(new URL('/dashboard/parent', nextUrl));
            }
            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role as string
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        }
    }
})
