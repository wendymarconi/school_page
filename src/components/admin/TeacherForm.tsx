"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Lock, ChevronLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createTeacher, updateTeacher } from "@/app/dashboard/admin/teachers/actions";

interface TeacherFormProps {
    teacher?: {
        id: string;
        name: string | null;
        email: string;
    };
    isEdit?: boolean;
}

export function TeacherForm({ teacher, isEdit = false }: TeacherFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const result = isEdit
            ? await updateTeacher(teacher!.id, formData)
            : await createTeacher(formData);

        if (result.success) {
            router.push("/dashboard/admin/teachers");
            router.refresh();
        } else {
            setError(result.message || "Algo salió mal.");
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link
                href="/dashboard/admin/teachers"
                className="inline-flex items-center text-slate-500 hover:text-primary mb-6 transition-colors"
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Volver a la lista
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
                    <form action={handleSubmit} className="space-y-6">
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
                                    placeholder={isEdit ? "Dejar en blanco para mantener" : "Mínimo 6 caracteres"}
                                    className="pl-10 h-12 border-slate-200 focus:ring-primary/20 rounded-xl"
                                    required={!isEdit}
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">
                                El profesor podrá cambiar esta contraseña al iniciar sesión.
                            </p>
                        </div>

                        {error && (
                            <div className="p-4 bg-destructive/5 text-destructive text-sm font-semibold rounded-xl border border-destructive/10">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 text-lg font-bold rounded-2xl gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            {isEdit ? "Guardar Cambios" : "Registrar Profesor"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
