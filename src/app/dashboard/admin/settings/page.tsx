import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAcademicPeriods } from "./actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Calendar, ShieldCheck, Clock } from "lucide-react";
import PeriodManager from "./PeriodManager";

export default async function AdminSettingsPage() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") redirect("/login");

    const periods = await getAcademicPeriods();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Configuración del Sistema</h1>
                    <p className="text-lg text-slate-500 font-medium italic">Gestiona los parámetros globales de la institución</p>
                </div>
                <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10">
                    <Settings className="h-8 w-8 text-primary animate-spin-slow" />
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Period Management Section */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="glass border-none overflow-hidden rounded-[2.5rem] shadow-xl">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black text-slate-900">Periodos Académicos</CardTitle>
                                    <CardDescription className="font-semibold text-slate-500">
                                        Controla la apertura y cierre de fechas para registro de calificaciones
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-2">
                            <PeriodManager initialPeriods={periods} />
                        </CardContent>
                    </Card>

                    {/* Other Settings Placeholder */}
                    <Card className="glass border-none overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-8">
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-[2rem] bg-white/10 text-white">
                                <ShieldCheck className="h-10 w-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Seguridad y Auditoría</h3>
                                <p className="text-slate-400 font-medium">Todos los cambios en los periodos quedan registrados para control administrativo.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10">
                        <h4 className="font-black text-primary text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Ayuda Rápida
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                <p className="text-sm text-slate-600 font-medium">
                                    <span className="font-bold text-slate-900">Periodo Activo:</span> Solo puede haber un periodo abierto a la vez. Al abrir uno nuevo, el anterior se cerrará automáticamente.
                                </p>
                            </li>
                            <li className="flex gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                <p className="text-sm text-slate-600 font-medium">
                                    <span className="font-bold text-slate-900">Fechas:</span> Las fechas de inicio y fin regulan el acceso de los docentes al sistema de notas.
                                </p>
                            </li>
                            <li className="flex gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                <p className="text-sm text-slate-600 font-medium">
                                    <span className="font-bold text-slate-900">Reportes:</span> Los boletines se generan basados en las calificaciones del periodo actualmente activo.
                                </p>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
}
