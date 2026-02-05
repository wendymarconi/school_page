import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { User as UserIcon, ChevronRight, BookOpen } from "lucide-react";

export default async function ParentDashboard() {
    const session = await auth();

    if (!session?.user) redirect("/login");
    if (session.user.role !== "PARENT") {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-destructive">Acceso Denegado</h1>
                    <p className="text-muted-foreground">No tienes autorización para ver esta página.</p>
                </div>
            </div>
        )
    }

    const parentProfile = await prisma.parentProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            students: {
                include: {
                    student: {
                        include: {
                            enrollments: {
                                include: { class: true }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!parentProfile) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-semibold">Perfil no encontrado</h1>
                    <p className="text-muted-foreground">Por favor, contacta al administrador para configurar tu cuenta.</p>
                </div>
            </div>
        )
    }

    // Mapear para facilitar el uso en el componente
    const children = parentProfile.students.map(ps => ps.student);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Bienvenido, <span className="text-primary">{session.user.name?.split(' ')[0]}</span> 👋
                    </h1>
                    <p className="text-lg text-slate-500 font-medium">
                        Monitorea el progreso académico de tus hijos aquí.
                    </p>
                </div>
                <div className="glass px-6 py-4 rounded-2xl border-primary/10">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hijos Vinculados</p>
                    <p className="text-2xl font-black text-primary">{children.length}</p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {children.map((student: any) => (
                    <Link key={student.id} href={`/dashboard/parent/children/${student.id}`}>
                        <Card className="group glass border-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden rounded-[2rem]">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <UserIcon className="h-6 w-6" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        Estado: Activo
                                    </span>
                                </div>
                                <CardTitle className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">
                                    {student.name}
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium pt-1">
                                    Hijo/a vinculado
                                    {student.enrollments[0]?.class?.location && (
                                        <span className="block text-xs font-bold text-primary mt-1">
                                            {student.enrollments[0].class.location}
                                        </span>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-primary transition-colors">
                                            <BookOpen className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 leading-none">
                                                {student.enrollments.length} Materias
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                                        <ChevronRight className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {children.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <UserIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">Sin hijos vinculados</h3>
                        <p className="text-slate-500">No hay estudiantes registrados bajo este perfil.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
