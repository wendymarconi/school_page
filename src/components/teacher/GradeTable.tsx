'use client';

import { useState } from 'react';
import { updateGrade, deleteGrade } from '@/app/dashboard/teacher/actions';
import { BookOpen, Plus, Calendar, Star, ChevronRight, GraduationCap, ClipboardList, Zap, FileText, Edit2, Trash2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Grade {
    id: string;
    value: number;
    description: string | null;
    type: string | null;
    period: number;
    date: string; // Serialized date
}

interface Student {
    id: string;
    name: string;
    grades: Grade[];
}

interface Enrollment {
    studentId: string;
    student: Student;
}

const GRADE_TYPES = [
    { id: 'EVALUACION', label: 'Evaluación', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'QUIZ', label: 'Quiz', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'TRABAJO', label: 'Trabajo', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export default function GradeTable({ students, classId }: { students: Enrollment[], classId: string }) {
    const [loading, setLoading] = useState(false);
    const [activePeriod, setActivePeriod] = useState(1);
    const [selectedType, setSelectedType] = useState('EVALUACION');
    const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
    const [editValue, setEditValue] = useState("");
    const [editDesc, setEditDesc] = useState("");

    async function handleAddGrade(studentId: string, formData: FormData) {
        setLoading(true);
        const value = parseFloat(formData.get('grade') as string);
        const description = formData.get('description') as string;

        try {
            await updateGrade(studentId, classId, value, description, activePeriod, selectedType);
            const form = document.getElementById(`form-${studentId}`) as HTMLFormElement;
            if (form) form.reset();
        } catch (e) {
            alert('Error al actualizar la calificación');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateGrade(studentId: string) {
        if (!editingGrade) return;
        setLoading(true);
        try {
            await updateGrade(
                studentId,
                classId,
                parseFloat(editValue),
                editDesc,
                editingGrade.period,
                editingGrade.type || undefined,
                editingGrade.id
            );
            setEditingGrade(null);
        } catch (e) {
            alert('Error al editar la nota');
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteGrade(gradeId: string) {
        if (!confirm('¿Estás seguro de eliminar esta nota?')) return;
        setLoading(true);
        try {
            await deleteGrade(gradeId, classId);
        } catch (e) {
            alert('Error al eliminar la nota');
        } finally {
            setLoading(false);
        }
    }

    const startEditing = (grade: Grade) => {
        setEditingGrade(grade);
        setEditValue(grade.value.toString());
        setEditDesc(grade.description || "");
    };

    const periods = [1, 2, 3, 4];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                {/* Period Selector */}
                <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-2xl w-full max-w-md border border-slate-200/50 shadow-inner">
                    {periods.map((p) => (
                        <button
                            key={p}
                            onClick={() => setActivePeriod(p)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activePeriod === p
                                ? "bg-white text-primary shadow-sm scale-105"
                                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                }`}
                        >
                            Periodo {p}
                        </button>
                    ))}
                </div>

                {/* Global Category Selector */}
                <div className="flex gap-2 bg-white/50 p-1 rounded-2xl border border-slate-100 shadow-sm">
                    {GRADE_TYPES.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all flex items-center gap-2 ${selectedType === type.id
                                ? "bg-slate-900 text-white shadow-lg"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            <type.icon className="h-3 w-3" />
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-8">
                {students.map((enrollment) => {
                    const studentGrades = enrollment.student.grades.filter(g => g.period === activePeriod);
                    const average = studentGrades.length > 0
                        ? (studentGrades.reduce((acc, g) => acc + g.value, 0) / studentGrades.length).toFixed(1)
                        : "0.0";

                    return (
                        <Card key={enrollment.studentId} className="group glass border-none hover:shadow-2xl transition-all duration-500 rounded-[3rem] overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Student Profile & Period Average */}
                                    <div className="p-10 lg:w-1/4 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between bg-slate-50/50">
                                        <div className="space-y-4">
                                            <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform duration-500">
                                                <GraduationCap className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{enrollment.student.name}</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {enrollment.studentId.substring(0, 8)}</p>
                                            </div>
                                        </div>

                                        <div className="mt-8 space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Promedio P{activePeriod}</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className={`text-4xl font-black tracking-tighter ${Number(average) >= 60 ? 'text-primary' : 'text-destructive'}`}>
                                                        {average}
                                                    </span>
                                                    <span className="text-slate-300 font-bold text-xs">/100</span>
                                                </div>
                                            </div>

                                            {/* Annual Average */}
                                            {enrollment.student.grades.length > 0 && (
                                                <div className="pt-4 border-t border-slate-100 space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Promedio Final Anual</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className={`text-2xl font-black tracking-tighter ${(enrollment.student.grades.reduce((a, b) => a + b.value, 0) / enrollment.student.grades.length) >= 60 ? 'text-slate-900' : 'text-destructive'}`}>
                                                            {(enrollment.student.grades.reduce((acc, g) => acc + g.value, 0) / enrollment.student.grades.length).toFixed(1)}
                                                        </span>
                                                        <span className="text-slate-300 font-bold text-[10px]">CUMULATIVO</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Categorized Grades */}
                                    <div className="p-10 flex-1 grid md:grid-cols-3 gap-8">
                                        {GRADE_TYPES.map((cat) => {
                                            const catGrades = studentGrades.filter(g => g.type === cat.id);
                                            const catAvg = catGrades.length > 0
                                                ? (catGrades.reduce((acc, g) => acc + g.value, 0) / catGrades.length).toFixed(1)
                                                : null;

                                            return (
                                                <div key={cat.id} className="flex flex-col">
                                                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`p-2 rounded-xl ${cat.bg} ${cat.color}`}>
                                                                <cat.icon className="h-3.5 w-3.5" />
                                                            </div>
                                                            <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{cat.label}</span>
                                                        </div>
                                                        {catAvg && <span className="text-xs font-black text-primary/60">{catAvg}</span>}
                                                    </div>

                                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {catGrades.map((g) => (
                                                            <div key={g.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all group/note relative overflow-hidden">
                                                                {editingGrade?.id === g.id ? (
                                                                    <div className="space-y-3">
                                                                        <input
                                                                            type="number"
                                                                            value={editValue}
                                                                            onChange={(e) => setEditValue(e.target.value)}
                                                                            className="w-full text-lg font-black p-1 border-b-2 border-primary outline-none"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={editDesc}
                                                                            onChange={(e) => setEditDesc(e.target.value)}
                                                                            placeholder="Descripción"
                                                                            className="w-full text-[10px] p-1 border-b border-slate-200 outline-none"
                                                                        />
                                                                        <div className="flex gap-2">
                                                                            <Button
                                                                                size="sm"
                                                                                className="flex-1 h-8 rounded-lg"
                                                                                onClick={() => handleUpdateGrade(enrollment.studentId)}
                                                                            >
                                                                                <Check className="h-3 w-3 mr-1" /> Guardar
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="h-8 rounded-lg"
                                                                                onClick={() => setEditingGrade(null)}
                                                                            >
                                                                                <X className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="flex justify-between items-center mb-1">
                                                                            <span className="text-md font-black text-slate-900">{g.value}</span>
                                                                            <div className="flex gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity">
                                                                                <button
                                                                                    onClick={() => startEditing(g)}
                                                                                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
                                                                                >
                                                                                    <Edit2 className="h-3 w-3" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteGrade(g.id)}
                                                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-destructive transition-colors"
                                                                                >
                                                                                    <Trash2 className="h-3 w-3" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-[10px] text-slate-400 font-medium line-clamp-2 leading-relaxed italic">
                                                                            {g.description || 'Sin comentarios'}
                                                                        </p>
                                                                        <p className="text-[8px] text-slate-300 font-black uppercase mt-1">
                                                                            {new Date(g.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                                                                        </p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {catGrades.length === 0 && (
                                                            <div className="py-4 text-center border-2 border-dashed border-slate-50 rounded-2xl">
                                                                <p className="text-[10px] font-bold text-slate-300 uppercase italic">Sin registros</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Action Panel */}
                                    <div className="p-10 lg:w-1/4 border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50/30 flex items-center">
                                        <form
                                            id={`form-${enrollment.studentId}`}
                                            action={(fd) => handleAddGrade(enrollment.studentId, fd)}
                                            className="w-full space-y-6"
                                        >
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1 mb-2 block">
                                                        Nuevo(a) {GRADE_TYPES.find(t => t.id === selectedType)?.label}
                                                    </label>
                                                    <input
                                                        name="grade"
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="100"
                                                        placeholder="0 - 100"
                                                        className="w-full h-14 rounded-[1.25rem] border-2 border-slate-100 bg-white px-5 text-xl font-black shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-200"
                                                        required
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1 mb-2 block">Descripción</label>
                                                    <textarea
                                                        name="description"
                                                        placeholder="Ej: Quiz de geometría..."
                                                        className="w-full h-24 rounded-[1.25rem] border-2 border-slate-100 bg-white px-5 py-4 text-sm shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-200 resize-none"
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full rounded-[1.25rem] h-14 font-black text-md shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all duration-300 group/btn overflow-hidden"
                                            >
                                                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                                Ingresar Nota
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Annexes / Summary Footer */}
            <Card className="rounded-[2.5rem] border-none glass overflow-hidden shadow-xl mt-12 bg-slate-900 text-white">
                <CardContent className="p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-white/10 text-white">
                            <ClipboardList className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">Resumen de Evaluación (Anexos)</h2>
                            <p className="text-slate-400 text-sm font-medium">Consolidado por categorías del Periodo {activePeriod}</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {GRADE_TYPES.map((cat) => {
                            const allGrades = students.flatMap(s => s.student.grades).filter(g => g.period === activePeriod && g.type === cat.id);
                            const avg = allGrades.length > 0
                                ? (allGrades.reduce((acc, g) => acc + g.value, 0) / allGrades.length).toFixed(1)
                                : "0.0";
                            return (
                                <div key={cat.id} className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <cat.icon className={`h-5 w-5 ${cat.color}`} />
                                        <span className="font-bold text-slate-300">{cat.label}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-3xl font-black">{avg}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Promedio Grupal</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-slate-400">{allGrades.length}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Notas</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
