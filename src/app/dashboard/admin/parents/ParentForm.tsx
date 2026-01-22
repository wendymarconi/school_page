"use client"

import { useState } from "react";
import { createParent, updateParent } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, UserPlus, Save } from "lucide-react";

interface ParentFormProps {
    initialData?: any;
    onSuccess?: () => void;
}

export default function ParentForm({ initialData, onSuccess }: ParentFormProps) {
    const [state, setState] = useState<{ errors?: any, message?: string } | null>(null);
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        setState(null);

        let result;
        if (initialData) {
            result = await updateParent(initialData.id, formData);
        } else {
            result = await createParent(formData);
        }

        if (result && (result.errors || result.message)) {
            setState(result);
            setIsPending(false);
        } else if (onSuccess) {
            onSuccess();
        }
    }

    return (
        <Card className="shadow-none border-none">
            <CardHeader className="px-0 pt-0 pb-6">
                <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                    {initialData ? <Save className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                    {initialData ? "Editar Acudiente" : "Registrar Nuevo Acudiente"}
                </CardTitle>
                <p className="text-slate-500 text-sm mt-1">
                    {initialData
                        ? "Actualiza los datos de contacto del acudiente."
                        : "Crea una cuenta para el padre de familia/responsable."}
                </p>
            </CardHeader>
            <CardContent className="px-0 pb-0">
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-700 font-semibold text-sm">Nombre Completo</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ej: María Rodríguez"
                            defaultValue={initialData?.user?.name}
                            required
                            className="h-11 border-slate-200"
                        />
                        {state?.errors?.name && (
                            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                <AlertCircle className="h-3 w-3" /> {state.errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">Correo Electrónico</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            defaultValue={initialData?.user?.email}
                            required
                            className="h-11 border-slate-200"
                        />
                        {state?.errors?.email && (
                            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                <AlertCircle className="h-3 w-3" /> {state.errors.email}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-slate-700 font-semibold text-sm">Número de Contacto</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="Ej: 310 123 4567"
                                defaultValue={initialData?.phone}
                                className="h-11 border-slate-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="relationship" className="text-slate-700 font-semibold text-sm">Parentesco</Label>
                            <select
                                id="relationship"
                                name="relationship"
                                defaultValue={initialData?.relationship || ""}
                                className="flex h-11 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20"
                            >
                                <option value="">Seleccione...</option>
                                <option value="Padre">Padre</option>
                                <option value="Madre">Madre</option>
                                <option value="Abuelo/a">Abuelo/a</option>
                                <option value="Tío/a">Tío/a</option>
                                <option value="Tutor Legal">Tutor Legal</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                    </div>

                    {!initialData && (
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">Contraseña Temporal</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                required
                                className="h-11 border-slate-200"
                            />
                            {state?.errors?.password && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3 w-3" /> {state.errors.password}
                                </p>
                            )}
                            <p className="text-[10px] text-slate-500 italic">Esta será la clave de acceso inicial del acudiente.</p>
                        </div>
                    )}

                    {state?.message && !state.errors && (
                        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2 border border-destructive/20">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            {state.message}
                        </div>
                    )}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full h-11 font-bold shadow-md shadow-primary/10"
                            disabled={isPending}
                        >
                            {isPending ? "Procesando..." : (initialData ? "Guardar Cambios" : "Crear Acudiente")}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
