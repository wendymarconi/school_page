"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, User, MapPin, Clock, Loader2, Pencil } from "lucide-react";
import { createSubject, updateSubject } from "@/app/dashboard/admin/subjects/actions";

interface Teacher {
    id: string;
    name: string | null;
    email: string;
}

export function SubjectForm({
    teachers,
    initialData
}: {
    teachers: Teacher[],
    initialData?: {
        id: string;
        name: string;
        teacherId: string;
        location: string | null;
        schedule: string | null;
    }
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);

        try {
            let result;
            if (initialData) {
                result = await updateSubject(initialData.id, formData);
            } else {
                result = await createSubject(formData);
            }

            if (result.success) {
                router.push("/dashboard/admin/subjects");
                router.refresh();
            } else {
                setError(result.error || "Ocurrió un error inesperado.");
            }
        } catch (err) {
            setError("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="max-w-2xl mx-auto shadow-2xl border-slate-100 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
                <CardTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
                    {initialData ? <Pencil className="h-6 w-6" /> : <Book className="h-6 w-6" />}
                    {initialData ? "Editar Materia" : "Registro de Nueva Materia"}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm font-semibold animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-700 font-bold flex items-center gap-2">
                            <Book className="h-4 w-4 text-primary" /> Nombre de la Materia
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ej: Matemáticas, Ciencias, etc."
                            required
                            defaultValue={initialData?.name}
                            className="h-12 border-slate-200 focus:ring-primary focus:border-primary text-lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="teacherId" className="text-slate-700 font-bold flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" /> Asignar Profesor
                        </Label>
                        <select
                            id="teacherId"
                            name="teacherId"
                            required
                            defaultValue={initialData?.teacherId}
                            className="flex h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-lg ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Selecciona un profesor...</option>
                            {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name || teacher.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-slate-700 font-bold flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" /> Curso / Aula
                            </Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="Ej: 304, Aula Magna"
                                defaultValue={initialData?.location || ""}
                                className="h-12 border-slate-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="schedule" className="text-slate-700 font-bold flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" /> Horario
                            </Label>
                            <Input
                                id="schedule"
                                name="schedule"
                                placeholder="Ej: Lun 7:00 AM - 9:00 AM"
                                defaultValue={initialData?.schedule || ""}
                                className="h-12 border-slate-200"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1 h-12 text-lg font-bold"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] h-12 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Guardando...
                                </>
                            ) : (
                                initialData ? "Guardar Cambios" : "Registrar Materia"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
