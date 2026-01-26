'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        console.log("Acción authenticate iniciada para:", formData.get('email'));
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            console.log("Error de Auth detectado:", error.type);
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciales inválidas.';
                default:
                    return 'Algo salió mal. Por favor intenta de nuevo.';
            }
        }
        // IMPORTANTE: Los errores de redirección deben lanzarse para que Next.js los maneje
        throw error;
    }
}

export async function logout() {
    await signOut({ redirectTo: "/login" });
}
