"use client"

import { useState, useRef } from "react";
import { createParent, updateParent } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, UserPlus, Save, Check, X } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
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

interface ParentFormProps {
    initialData?: any;
    onSuccess?: () => void;
}

export default function ParentForm({ initialData, onSuccess }: ParentFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, setState] = useState<{ errors?: any, message?: string } | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [phone, setPhone] = useState(initialData?.phone || "");
    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: "" });
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    // Formatear número de teléfono mientras se escribe
    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, "");
        if (cleaned.length <= 3) return cleaned;
        if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
    };

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
                <form ref={formRef} action={handleSubmit} className="space-y-4">
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
                                value={phone}
                                onChange={handlePhoneChange}
                                maxLength={12}
                                className="h-11 border-slate-200"
                            />
                            <p className="text-[10px] text-slate-500 italic">Formato: XXX XXX XXXX</p>
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
                                placeholder="Mínimo 8 caracteres"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                className="h-11 border-slate-200"
                            />
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
                            {state?.errors?.password && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3 w-3" /> {state.errors.password}
                                </p>
                            )}
                            <div className="text-[10px] text-slate-500 space-y-0.5">
                                <p className="flex items-center gap-1">
                                    {password.length >= 8 ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-slate-400" />}
                                    Mínimo 8 caracteres
                                </p>
                                <p className="flex items-center gap-1">
                                    {/[A-Z]/.test(password) ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-slate-400" />}
                                    Una letra mayúscula
                                </p>
                                <p className="flex items-center gap-1">
                                    {/[0-9]/.test(password) ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-slate-400" />}
                                    Un número
                                </p>
                            </div>
                        </div>
                    )}

                    {state?.message && !state.errors && (
                        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2 border border-destructive/20">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            {state.message}
                        </div>
                    )}

                    <div className="pt-2 flex gap-3">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button" variant="outline" className="flex-1 h-11 font-bold border-slate-200 text-slate-500 hover:bg-slate-50">
                                    Cancelar
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Está seguro que desea cancelar?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Si cancela ahora, perderá todos los datos ingresados.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Volver al formulario</AlertDialogCancel>
                                    <DialogClose asChild>
                                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                                            Sí, cancelar operación
                                        </AlertDialogAction>
                                    </DialogClose>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    type="button"
                                    className="flex-[2] h-11 font-bold shadow-md shadow-primary/10"
                                    disabled={isPending}
                                >
                                    {isPending ? "Procesando..." : (initialData ? "Guardar Cambios" : "Crear Acudiente")}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Desea {initialData ? "guardar los cambios" : "registrar este acudiente"}?</AlertDialogTitle>
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
                                        className="bg-primary hover:bg-primary/90"
                                    >
                                        Sí, {initialData ? "guardar cambios" : "registrar"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
