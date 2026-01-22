"use client"

import { useState } from "react";
import { createStudent, updateStudent } from "@/app/dashboard/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, GraduationCap, Search, User } from "lucide-react";

interface StudentFormProps {
    parents: any[];
    classes: any[];
    initialData?: any;
}

export default function StudentForm({ parents, classes, initialData }: StudentFormProps) {
    const [state, setState] = useState<{ errors?: any, message?: string } | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [parentSearch, setParentSearch] = useState("");
    const [classSearch, setClassSearch] = useState("");

    // Formatear fecha para el input date (YYYY-MM-DD)
    const defaultBirthDate = initialData?.birthDate
        ? new Date(initialData.birthDate).toISOString().split('T')[0]
        : "";

    // Obtener acudientes actuales para el valor por defecto
    const currentParentIds = initialData?.parents?.map((p: any) => p.parentId) || [];

    // Obtener clases actuales para el valor por defecto
    const currentClassIds = initialData?.enrollments?.map((e: any) => e.classId) || [];

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        setState(null);

        let result;
        if (initialData) {
            result = await updateStudent(initialData.id, formData);
        } else {
            result = await createStudent(formData);
        }

        if (result && (result.errors || result.message)) {
            setState(result);
            setIsPending(false);
        }
    }

    return (
        <Card className="max-w-2xl mx-auto shadow-xl border-slate-100 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10 py-8">
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                    <GraduationCap className="h-6 w-6" />
                    {initialData ? "Editar Alumno" : "Inscripción de Nuevo Alumno"}
                </CardTitle>
                <p className="text-slate-500 text-sm mt-1">
                    {initialData
                        ? `Actualiza la información de ${initialData.name}`
                        : "Completa los datos para registrar al estudiante en el sistema."}
                </p>
            </CardHeader>
            <CardContent className="p-8">
                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-700 font-semibold">Nombre Completo del Alumno</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ej: Juan Pérez"
                            defaultValue={initialData?.name}
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
                            defaultValue={defaultBirthDate}
                            required
                            className="h-12 border-slate-200"
                        />
                        {state?.errors?.birthDate && (
                            <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                                <AlertCircle className="h-4 w-4" /> {state.errors.birthDate}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-slate-700 font-semibold">Acudientes Responsables</Label>
                            <div className="relative w-full max-w-[250px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Buscar acudiente..."
                                    value={parentSearch}
                                    onChange={(e) => setParentSearch(e.target.value)}
                                    className="pl-9 h-9 text-xs border-slate-200"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 max-h-56 overflow-y-auto">
                            {parents.map((parent) => {
                                const matchesSearch =
                                    parent.user.name.toLowerCase().includes(parentSearch.toLowerCase()) ||
                                    parent.user.email.toLowerCase().includes(parentSearch.toLowerCase());

                                return (
                                    <div
                                        key={parent.id}
                                        className={`flex items-center space-x-3 p-2 hover:bg-white rounded-lg transition-colors ${!matchesSearch ? 'hidden' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`parent-${parent.id}`}
                                            name="parentIds"
                                            value={parent.id}
                                            defaultChecked={currentParentIds.includes(parent.id)}
                                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                                        />
                                        <label
                                            htmlFor={`parent-${parent.id}`}
                                            className="text-sm font-medium text-slate-700 cursor-pointer leading-none flex-1"
                                        >
                                            <span className="block">{parent.user.name}</span>
                                            <span className="text-[10px] text-slate-500">{parent.user.email}</span>
                                        </label>
                                    </div>
                                );
                            })}

                            {parents.filter(p =>
                                p.user.name.toLowerCase().includes(parentSearch.toLowerCase()) ||
                                p.user.email.toLowerCase().includes(parentSearch.toLowerCase())
                            ).length === 0 && (
                                    <div className="col-span-full py-8 text-center">
                                        <User className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-sm text-slate-500 font-medium">No se encontraron acudientes</p>
                                        <p className="text-[10px] text-slate-400 italic">Intenta con otro nombre o correo</p>
                                    </div>
                                )}
                        </div>
                        {state?.errors?.parentIds && (
                            <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                                <AlertCircle className="h-4 w-4" /> {state.errors.parentIds}
                            </p>
                        )}
                        <p className="text-[11px] text-slate-500 italic">Puedes seleccionar más de un acudiente si es necesario.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-slate-700 font-semibold">Inscripción a Materias / Clases</Label>
                            <div className="relative w-full max-w-[250px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Buscar materia..."
                                    value={classSearch}
                                    onChange={(e) => setClassSearch(e.target.value)}
                                    className="pl-9 h-9 text-xs border-slate-200"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 max-h-56 overflow-y-auto">
                            {classes.map((c) => {
                                const matchesSearch =
                                    c.name.toLowerCase().includes(classSearch.toLowerCase()) ||
                                    (c.location && c.location.toLowerCase().includes(classSearch.toLowerCase()));

                                return (
                                    <div
                                        key={c.id}
                                        className={`flex items-center space-x-3 p-3 bg-white border border-slate-100 rounded-lg hover:border-primary/30 transition-all ${!matchesSearch ? 'hidden' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`class-${c.id}`}
                                            name="classIds"
                                            value={c.id}
                                            defaultChecked={currentClassIds.includes(c.id)}
                                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                                        />
                                        <label
                                            htmlFor={`class-${c.id}`}
                                            className="text-sm font-medium text-slate-700 cursor-pointer flex-1"
                                        >
                                            <span className="block font-bold">{c.name}</span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-tight">{c.location || 'Sin ubicación'}</span>
                                        </label>
                                    </div>
                                );
                            })}

                            {classes.filter(c =>
                                c.name.toLowerCase().includes(classSearch.toLowerCase()) ||
                                (c.location && c.location.toLowerCase().includes(classSearch.toLowerCase()))
                            ).length === 0 && (
                                    <div className="col-span-full py-8 text-center text-slate-400 italic text-sm">
                                        No se encontraron materias.
                                    </div>
                                )}
                        </div>
                        <p className="text-[11px] text-slate-500 italic">Selecciona todas las materias en las que el alumno participará.</p>
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
                            {isPending ? "Procesando..." : (initialData ? "Guardar Cambios" : "Registrar Alumno")}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
