import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { GraduationCap, ChevronRight, BookOpen, Clock, MapPin } from "lucide-react";

export default async function TeacherClassesPage() {
    const session = await auth();

    if (!session?.user) redirect("/login");
    if (session.user.role !== "TEACHER") redirect("/dashboard");

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
                    <p className="text-muted-foreground">Contacta al administrador.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    Mis <span className="text-primary">Clases</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium">
                    Gestiona tus grupos y califica el desempeño de tus estudiantes.
                </p>
            </div>

            <div className="grid gap-6">
                {teacherProfile.classes.map((cls) => (
                    <Link key={cls.id} href={`/dashboard/teacher/classes/${cls.id}`}>
                        <Card className="group glass border-none hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden rounded-[2rem]">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    <div className="p-8 flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <GraduationCap className="h-5 w-5" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                                {cls.location || 'Grado'}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors mb-4">
                                            {cls.name}
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Clock className="h-4 w-4" />
                                                <span className="text-sm font-medium">{cls.schedule || 'Sin horario'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <MapPin className="h-4 w-4" />
                                                <span className="text-sm font-medium">{cls.location || 'Salón por definir'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 md:w-48 p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 group-hover:bg-primary/5 transition-colors">
                                        <p className="text-4xl font-black text-slate-900">{cls._count.students}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Alumni</p>
                                        <div className="mt-4 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all">
                                            <ChevronRight className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {teacherProfile.classes.length === 0 && (
                    <Card className="border-dashed border-2 py-12 text-center">
                        <CardContent>
                            <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No tienes clases asignadas actualmente.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
