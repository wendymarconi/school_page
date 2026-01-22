import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, GraduationCap, UserPlus, BookOpen, Contact, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        redirect("/dashboard/parent");
    }

    const [studentCount, teacherCount, subjectCount] = await Promise.all([
        prisma.student.count(),
        prisma.teacherProfile.count({ where: { active: true } }),
        prisma.class.count({ where: { active: true } })
    ]);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Panel de Control</h1>
                    <p className="text-lg text-slate-500 font-medium">Gestiona el ecosistema educativo del COEM.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {[
                    { label: "Alumnos", count: studentCount, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Docentes Activos", count: teacherCount, icon: Contact, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Materias Activas", count: subjectCount, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-xl rounded-3xl overflow-hidden group hover:scale-[1.02] transition-transform">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <span className="text-4xl font-black text-slate-900">{stat.count}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <ManagementCard
                    title="Alumnos"
                    desc="Ver lista completa de estudiantes y sus inscripciones."
                    href="/dashboard/admin/students"
                    icon={Users}
                />
                <ManagementCard
                    title="Profesores"
                    desc="Gestionar nómina docente y asignación de materias."
                    href="/dashboard/admin/teachers"
                    icon={Contact}
                />
                <ManagementCard
                    title="Materias"
                    desc="Organizar asignaturas, horarios y ubicaciones."
                    href="/dashboard/admin/subjects"
                    icon={BookOpen}
                />
                <Link href="/dashboard/admin/students/new" className="lg:col-span-1">
                    <Card className="h-full border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-primary/5 hover:border-primary/20 transition-all rounded-[2rem] flex flex-col items-center justify-center p-8 group">
                        <div className="p-4 rounded-full bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <UserPlus className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Inscribir Alumno</h3>
                        <p className="text-sm text-slate-500 text-center mt-2">Registra un nuevo estudiante rápidamente.</p>
                    </Card>
                </Link>
            </div>
        </div>
    );
}

function ManagementCard({ title, desc, href, icon: Icon }: any) {
    return (
        <Link href={href}>
            <Card className="h-full border-none shadow-2xl rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                            <Icon className="h-6 w-6" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    <p className="text-slate-500 font-medium">{desc}</p>
                </CardContent>
            </Card>
        </Link>
    );
}
