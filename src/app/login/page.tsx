'use client'

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    );

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center px-4 bg-slate-50 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-100 opacity-50"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 w-full max-w-sm">
                <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al inicio
                </Link>

                <div className="flex justify-center mb-8">
                    <div className="rounded-2xl bg-white p-3 shadow-lg border border-slate-100 italic">
                        <GraduationCap className="h-10 w-10 text-primary" />
                    </div>
                </div>

                <Card className="glass border-white/40 shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-extrabold tracking-tight text-center">Acceso</CardTitle>
                        <CardDescription className="text-center">
                            Ingresa tus credenciales para continuar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction} className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-700 font-medium ml-1">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="usuario@ejemplo.com"
                                    required
                                    autoComplete="off"
                                    className="rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all duration-200"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center ml-1">
                                    <Label htmlFor="password" text-slate-700 font-medium>Contraseña</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    autoComplete="new-password"
                                    className="rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all duration-200"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full rounded-xl py-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <div className="flex items-center">
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-white"></div>
                                        Ingresando...
                                    </div>
                                ) : 'Ingresar'}
                            </Button>

                            {errorMessage && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="text-center text-xs text-slate-400 mt-2">
                                ¿Olvidaste tu contraseña? Contacta al administrador.
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
