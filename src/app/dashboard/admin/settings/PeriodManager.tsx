"use client"

import { useState } from "react";
import { AcademicPeriod } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { togglePeriodStatus } from "./actions";
import { toast } from "sonner";
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface PeriodManagerProps {
    initialPeriods: AcademicPeriod[];
}

export default function PeriodManager({ initialPeriods }: PeriodManagerProps) {
    const [periods, setPeriods] = useState(initialPeriods);
    const [loading, setLoading] = useState<string | null>(null);

    const handleToggle = async (id: string, currentStatus: boolean) => {
        setLoading(id);
        const result = await togglePeriodStatus(id, currentStatus);

        if (result.success) {
            // Actualizar estado local (solo uno puede estar activo)
            setPeriods(prev => prev.map(p => ({
                ...p,
                active: p.id === id ? !currentStatus : false
            })));
            toast.success("Periodo actualizado correctamente");
        } else {
            toast.error(result.message || "Error al actualizar");
        }
        setLoading(null);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                {periods.map((period) => (
                    <div
                        key={period.id}
                        className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 ${period.active
                                ? "bg-primary/5 border-primary/20 shadow-md"
                                : "bg-white border-slate-100 hover:border-slate-200"
                            }`}
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl ${period.active ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                                    }`}>
                                    <span className="text-xl font-black">{period.number}</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900">{period.name}</h4>
                                    <div className="flex items-center gap-4 mt-1 text-sm font-bold text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="h-3 w-3" />
                                            <span>{formatDate(period.startDate)}</span>
                                        </div>
                                        <span>—</span>
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="h-3 w-3" />
                                            <span>{formatDate(period.endDate)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 bg-white/50 p-2 rounded-2xl border border-slate-100/50">
                                <div className="text-right flex flex-col items-end">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado de Carga</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-black ${period.active ? "text-emerald-600" : "text-slate-400"}`}>
                                            {period.active ? "ABIERTO" : "CERRADO"}
                                        </span>
                                        {period.active ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-slate-300" />
                                        )}
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-slate-100" />
                                <div className="flex items-center gap-3">
                                    {loading === period.id ? (
                                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                                    ) : (
                                        <Switch
                                            checked={period.active}
                                            onCheckedChange={() => handleToggle(period.id, period.active)}
                                            className="data-[state=checked]:bg-primary"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {period.active && (
                            <div className="absolute top-4 right-4 animate-pulse">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                <p className="text-sm text-blue-700 font-semibold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    Consejo: Abre el periodo académico actual para permitir que los docentes ingresen calificaciones. Solo un periodo puede estar abierto.
                </p>
            </div>
        </div>
    );
}
