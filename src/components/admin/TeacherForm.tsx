"use client"

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Lock, ChevronLeft, Save, Loader2, AlertTriangle, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createTeacher, updateTeacher } from "@/app/dashboard/admin/teachers/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TeacherFormProps {
    teacher?: {
        id: string;
        name: string | null;
        email: string;
    };
    isEdit?: boolean;
}

export function TeacherForm({ teacher }: TeacherFormProps) {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: "" });
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const isEdit = !!teacher;

    // Evaluar fortaleza de contraseña
    const evaluatePassword = (pwd: string) => {
        let score = 0;
        let message = "";

        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        if (score === 0) message = "";
        else if (score === 1) message = "Muy débil";
        else if (score === 2) message = "Débil";
        else if (score === 3) message = "Buena";
        else message = "Excelente";

        setPasswordStrength({ score, message });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const pwd = e.target.value;
        setPassword(pwd);
        evaluatePassword(pwd);
    };

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        try {
            const result = isEdit
                ? await updateTeacher(teacher!.id, formData)
                : await createTeacher(formData);

            if (result.success) {
                // Usar window.location en lugar de router.push para evitar problemas de sesión
                window.location.href = "/dashboard/admin/teachers";
            } else {
                setError(result.message || "Algo salió mal.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error en handleSubmit:", error);
            setError("Error inesperado al procesar la solicitud.");
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link
                href="/dashboard/admin/teachers"
            >
                <Button variant="outline" className="mb-6 rounded-full bg-white border-slate-200 hover:text-primary hover:border-primary/50 text-slate-600 transition-all shadow-sm gap-2 pl-3 pr-5 h-10">
                    <div className="bg-primary/10 p-1 rounded-full">
                        <ChevronLeft className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="font-bold text-sm">Volver a la lista</span>
                </Button>
            </Link>

            <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                    <CardTitle className="text-2xl font-black text-slate-900">
                        {isEdit ? "Editar Profesor" : "Nuevo Profesor"}
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium pt-1">
                        {isEdit ? `Actualizando la información de ${teacher?.name}` : "Completa los datos para registrar un nuevo docente."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <form ref={formRef} action={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-bold text-slate-700">Nombre Completo</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Nombre del docente"
                                    defaultValue={teacher?.name || ""}
                                    className="pl-10 h-12 border-slate-200 focus:ring-primary/20 rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold text-slate-700">Correo Electrónico</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    defaultValue={teacher?.email || ""}
                                    className="pl-10 h-12 border-slate-200 focus:ring-primary/20 rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-bold text-slate-700">
                                {isEdit ? "Cambiar Contraseña (opcional)" : "Contraseña Temporal"}
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={isEdit ? "Dejar en blanco para mantener" : "Mínimo 8 caracteres"}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className="pl-10 h-12 border-slate-200 focus:ring-primary/20 rounded-xl"
                                    required={!isEdit}
                                />
                            </div>
                            {password && (
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${passwordStrength.score === 1 ? "w-1/4 bg-red-500" :
                                                passwordStrength.score === 2 ? "w-2/4 bg-orange-500" :
                                                    passwordStrength.score === 3 ? "w-3/4 bg-yellow-500" :
                                                        passwordStrength.score === 4 ? "w-full bg-green-500" : "w-0"
                                                }`}
                                        />
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-600">{passwordStrength.message}</span>
                                </div>
                            )}
                            <div className="text-[10px] text-slate-500 space-y-0.5">
                                <p className="flex items-center gap-1">
                                    {password.length >= 8 || isEdit ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-slate-400" />}
                                    Mínimo 8 caracteres
                                </p>
                                <p className="flex items-center gap-1">
                                    {/[A-Z]/.test(password) || isEdit ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-slate-400" />}
                                    Una letra mayúscula
                                </p>
                                <p className="flex items-center gap-1">
                                    {/[0-9]/.test(password) || isEdit ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-slate-400" />}
                                    Un número
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-destructive/5 text-destructive text-sm font-semibold rounded-xl border border-destructive/10">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 h-14 text-lg font-bold rounded-2xl border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
                                    >
                                        Cancelar
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Está seguro que desea cancelar?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Si cancela ahora, perderá todos los datos ingresados y no se guardarán los cambios.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Volver al formulario</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => router.push("/dashboard/admin/teachers")}
                                            className="bg-destructive hover:bg-destructive/90"
                                        >
                                            Sí, cancelar operación
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        type="button"
                                        className="flex-[2] h-14 text-lg font-bold rounded-2xl gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                        {isEdit ? "Guardar Cambios" : "Registrar Profesor"}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Desea {isEdit ? "guardar los cambios" : "registrar este profesor"}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Verifique que la información sea correcta antes de confirmar la operación.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Revisar datos</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setConfirmDialogOpen(false);
                                                if (formRef.current) {
                                                    formRef.current.requestSubmit();
                                                }
                                            }}
                                        >
                                            Sí, {isEdit ? "guardar cambios" : "registrar"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
