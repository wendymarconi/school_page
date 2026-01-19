"use client"

import { useState } from "react";
import { createStudent } from "@/app/dashboard/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface CreateStudentFormProps {
    parents: any[];
    classes: any[];
}

export default function CreateStudentForm({ parents, classes }: CreateStudentFormProps) {
    const [state, setState] = useState<{ errors?: any, message?: string } | null>(null);
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        const result = await createStudent(formData);
        if (result && (result.errors || result.message)) {
            setState(result);
            setIsPending(false);
        }
    }

    return (
        <Card className="max-w-2xl mx-auto shadow-xl border-slate-100 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10 py-8">
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                    Inscripción de Nuevo Alumno
                </CardTitle>
                <p className="text-slate-500 text-sm mt-1">Completa los datos para registrar al estudiante en el sistema.</p>
            </CardHeader>
            <CardContent className="p-8">
                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-700 font-semibold">Nombre Completo del Alumno</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ej: Juan Pérez"
                            required
                            className="h-12 border-slate-200 focus:ring-primary/20"
                        />
                        {state?.errors?.name && (
                            <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                                <AlertCircle className="h-4 w-4" /> {state.errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="birthDate" className="text-slate-700 font-semibold">Fecha de Nacimiento</Label>
                        <Input
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            required
                            className="h-12 border-slate-200"
                        />
                        {state?.errors?.birthDate && (
                            <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                                <AlertCircle className="h-4 w-4" /> {state.errors.birthDate}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="parentId" className="text-slate-700 font-semibold">Acudiente / Padre de Familia</Label>
                        <select
                            id="parentId"
                            name="parentId"
                            required
                            className="flex h-12 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Seleccione un acudiente...</option>
                            {parents.map((parent) => (
                                <option key={parent.id} value={parent.id}>
                                    {parent.user.name} ({parent.user.email})
                                </option>
                            ))}
                        </select>
                        {state?.errors?.parentId && (
                            <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                                <AlertCircle className="h-4 w-4" /> {state.errors.parentId}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="classId" className="text-slate-700 font-semibold">Asignar a Clase (Opcional)</Label>
                        <select
                            id="classId"
                            name="classId"
                            className="flex h-12 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Sin asignar por ahora</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} - {c.location || 'Sin curso'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {state?.message && !state.errors && (
                        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-3 border border-destructive/20">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            {state.message}
                        </div>
                    )}

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                            disabled={isPending}
                        >
                            {isPending ? "Procesando..." : "Registrar Alumno"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
