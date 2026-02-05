'use client'

import { useActionState, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { authenticate } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    );
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();
    const role = searchParams.get('role');

    const roleTitle = role === 'teacher' ? 'Docente' : role === 'parent' ? 'Familiar' : role === 'admin' ? 'Administrativo' : 'Institucional';

    return (
        <Card className="glass border-white/40 shadow-2xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-extrabold tracking-tight text-center">Portal {roleTitle}</CardTitle>
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
                            <Label htmlFor="password">Contraseña</Label>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                autoComplete="new-password"
                                className="rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all duration-200 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
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

                    <div className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-100 italic">
                        Desarrollado por <span className="font-semibold text-primary/70">WMarconi</span>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-sky-50 via-white to-cyan-50 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 animate-pulse-slow"></div>

            <div className="relative z-10 w-full max-w-sm">
                <Link href="/">
                    <Button variant="outline" className="mb-8 rounded-full bg-white/80 border-white hover:bg-white hover:text-primary text-slate-600 transition-all shadow-sm backdrop-blur-sm gap-2 pl-3 pr-5 h-10">
                        <div className="bg-primary/10 p-1 rounded-full">
                            <ArrowLeft className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="font-bold text-sm">Volver al inicio</span>
                    </Button>
                </Link>

                <div className="flex justify-center mb-8">
                    <div className="rounded-3xl bg-white p-2 shadow-2xl border border-slate-100 italic">
                        <Image src="/logo.png" alt="Logo COEM" width={80} height={80} className="object-contain" />
                    </div>
                </div>

                <Suspense fallback={<div className="text-center">Cargando...</div>}>
                    <LoginForm />
                </Suspense>

                <div className="mt-8 text-center space-y-2 text-xs text-slate-500 font-medium">
                    <p>Carrera 9 E #27-58, La Cumbre - Floridablanca</p>
                    <p>Tel: 6583490 - 3107823186</p>
                    <p>colcoem11@hotmail.com</p>
                </div>
            </div>
        </div>
    );
}
