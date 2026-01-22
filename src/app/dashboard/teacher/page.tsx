import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { GraduationCap, ChevronRight } from "lucide-react";

export default async function TeacherDashboard() {
    const session = await auth();

    if (!session?.user) redirect("/login");
    if (session.user.role !== "TEACHER") {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-destructive">Acceso Denegado</h1>
                    <p className="text-muted-foreground">No tienes autorización para ver esta página.</p>
                </div>
            </div>
        )
    }

    const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            classes: {
                where: { active: true },
                include: {
                    _count: {
                        select: { students: true }
                    }
                }
            }
        }
    });

    if (!teacherProfile) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-semibold">Perfil no encontrado</h1>
                    <p className="text-muted-foreground">Por favor, contacta al administrador para configurar tu cuenta.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        ¡Hola, <span className="text-primary">{session.user.name?.split(' ')[0]}</span>! 👋
                    </h1>
                    <p className="text-lg text-slate-500 font-medium">
                        Hoy es un gran día para inspirar a tus estudiantes.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="glass px-6 py-3 rounded-2xl border-primary/10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estudiantes</p>
                        <p className="text-2xl font-black text-primary">
                            {teacherProfile.classes.reduce((acc: number, clsValue: any) => acc + clsValue._count.students, 0)}
                        </p>
                    </div>
                    <div className="glass px-6 py-3 rounded-2xl border-primary/10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mis Clases</p>
                        <p className="text-2xl font-black text-primary">{teacherProfile.classes.length}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {teacherProfile.classes.map((cls: any) => (
                    <Link key={cls.id} href={`/dashboard/teacher/classes/${cls.id}`}>
                        <Card className="group glass border-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden rounded-[2rem]">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <GraduationCap className="h-6 w-6" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        {cls.location || 'Grado'}
                                    </span>
                                </div>
                                <CardTitle className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">
                                    {cls.name}
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium pt-1">
                                    Horario: {cls.schedule || 'Por definir'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                                    <div>
                                        <p className="text-3xl font-black text-slate-900 leading-none">
                                            {cls._count.students}
                                        </p>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Alumnos</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                                        <ChevronRight className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {teacherProfile.classes.length === 0 && (
                    <div className="col-span-full text-center py-10 border rounded-lg border-dashed">
                        <p className="text-muted-foreground">No tienes clases asignadas todavía.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
