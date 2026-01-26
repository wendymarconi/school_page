import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, Calendar, TrendingUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function StudentDetailPage({ params }: { params: Promise<{ studentId: string }> }) {
    const session = await auth();
    if (session?.user?.role !== "PARENT") redirect("/login");

    const { studentId } = await params;

    const student = await prisma.student.findFirst({
        where: {
            id: studentId,
            parents: {
                some: {
                    parent: {
                        userId: session.user.id
                    }
                }
            }
        },
        include: {
            enrollments: {
                include: {
                    class: {
                        include: {
                            grades: {
                                where: { studentId: studentId },
                                orderBy: { date: 'desc' }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!student) notFound();

    const calculateAverage = (grades: any[]) => {
        if (grades.length === 0) return 0;
        const sum = grades.reduce((acc, g) => acc + g.value, 0);
        return (sum / grades.length).toFixed(1);
    };

    const allGrades = student.enrollments.flatMap(e => e.class.grades);
    const overallAverage = calculateAverage(allGrades);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/parent">
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                            <ArrowLeft className="h-6 w-6" />
                            <span className="sr-only">Volver</span>
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{student.name}</h1>
                        <p className="text-lg text-slate-500 font-medium italic">Expediente Académico - COEM</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    <a href={`/api/reports/student/${student.id}`} download>
                        <Button className="rounded-2xl h-12 px-8 font-bold bg-destructive hover:bg-red-700 text-white shadow-lg shadow-destructive/20 transition-all flex gap-2">
                            <FileText className="h-5 w-5" />
                            Descargar Boletín
                        </Button>
                    </a>
                    <div className="glass px-6 py-4 rounded-2xl border-primary/10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Promedio General</p>
                        <div className="flex items-center gap-2">
                            <p className="text-3xl font-black text-primary">{overallAverage}</p>
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Materias Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
                {student.enrollments.map((enrollment: any) => {
                    const classData = enrollment.class;
                    const avg = calculateAverage(classData.grades);

                    // Agrupar notas por periodo
                    const gradesByPeriod = classData.grades.reduce((acc: any, grade: any) => {
                        const period = grade.period || 1;
                        if (!acc[period]) acc[period] = [];
                        acc[period].push(grade);
                        return acc;
                    }, {});

                    const periods = Object.keys(gradesByPeriod).sort();
                    const defaultTab = periods.length > 0 ? `period-${periods[0]}` : undefined;

                    return (
                        <Card key={classData.id} className="group glass border-none overflow-hidden rounded-[2.5rem] hover:shadow-2xl transition-all duration-500">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-4 rounded-[1.5rem] bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <GraduationCap className="h-8 w-8" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cursos / Materia</p>
                                        <p className="text-sm font-bold text-primary italic">{classData.location || "General"}</p>
                                    </div>
                                </div>
                                <CardTitle className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors duration-300">
                                    {classData.name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-slate-500 font-semibold pt-2">
                                    <Calendar className="h-4 w-4" />
                                    {classData.schedule || "Horario por definir"}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-8 pt-6">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-sm font-black text-slate-500 uppercase tracking-wider">Promedio Materia</p>
                                        <p className="text-2xl font-black text-slate-900">{avg}</p>
                                    </div>

                                    {periods.length > 0 ? (
                                        <div className="space-y-3">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Detalle de Calificaciones</p>

                                            <Tabs defaultValue={defaultTab} className="w-full">
                                                <TabsList className="w-full justify-start overflow-x-auto rounded-xl h-auto p-1 bg-slate-100/50 mb-4 gap-2">
                                                    {periods.map((period: string) => (
                                                        <TabsTrigger
                                                            key={period}
                                                            value={`period-${period}`}
                                                            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-bold text-xs py-2 px-4"
                                                        >
                                                            Periodo {period}
                                                        </TabsTrigger>
                                                    ))}
                                                </TabsList>

                                                {periods.map((period: string) => (
                                                    <TabsContent key={period} value={`period-${period}`} className="space-y-2 focus-visible:ring-0">
                                                        {gradesByPeriod[period].map((grade: any) => (
                                                            <div key={grade.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-50 hover:border-primary/20 hover:shadow-md transition-all">
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${grade.type === 'Evaluación' ? 'bg-purple-100 text-purple-700' :
                                                                                grade.type === 'Quiz' ? 'bg-blue-100 text-blue-700' :
                                                                                    grade.type === 'Trabajo' ? 'bg-orange-100 text-orange-700' :
                                                                                        'bg-slate-100 text-slate-700'
                                                                            }`}>
                                                                            {grade.type || 'General'}
                                                                        </span>
                                                                    </div>
                                                                    <p className="font-bold text-slate-800">{grade.description || "Actividad General"}</p>
                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                                                        {new Date(grade.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                                    </p>
                                                                </div>
                                                                <div className={`px-4 py-2 rounded-xl text-lg font-black ${grade.value >= 7 ? 'bg-emerald-50 text-emerald-600' :
                                                                    grade.value >= 6 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                                                    }`}>
                                                                    {grade.value.toFixed(1)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </TabsContent>
                                                ))}
                                            </Tabs>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center bg-slate-50/30 rounded-2xl border-2 border-dashed border-slate-100">
                                            <p className="text-sm font-medium text-slate-400 italic">No hay notas registradas aún</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {student.enrollments.length === 0 && (
                <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <BookOpen className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-slate-900">Sin inscripciones</h2>
                    <p className="text-slate-500 font-medium">Este estudiante aún no está inscrito en ninguna materia.</p>
                </div>
            )}
        </div>
    );
}
