import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { User, Mail, Shield, Calendar, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            teacherProfile: true,
            parentProfile: true
        }
    });

    if (!user) {
        return <div>Usuario no encontrado</div>;
    }

    const dashboardLink = user.role === "ADMIN"
        ? "/dashboard/admin"
        : user.role === "TEACHER"
            ? "/dashboard/teacher"
            : "/dashboard/parent";

    return (
        <div className="container max-w-4xl mx-auto py-12 px-6">
            <Link
                href={dashboardLink}
                className="inline-flex items-center text-slate-500 hover:text-primary mb-8 transition-colors font-semibold"
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Volver al panel
            </Link>

            <div className="space-y-8 animate-in mt-fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border-4 border-white shadow-xl">
                        <User className="h-16 w-16" />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                        <p className="text-lg text-slate-500 font-medium">{user.email}</p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/10">
                                {user.role === "ADMIN" ? "Administrador" : user.role === "TEACHER" ? "Docente" : "Acudiente"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden group">
                        <CardHeader className="bg-slate-50 p-8 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-primary" />
                                <CardTitle className="text-xl font-bold">Información de Cuenta</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <Mail className="h-5 w-5 text-slate-400 mt-1" />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Correo Electrónico</p>
                                    <p className="text-slate-900 font-semibold">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Calendar className="h-5 w-5 text-slate-400 mt-1" />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Miembro desde</p>
                                    <p className="text-slate-900 font-semibold">
                                        {new Date(user.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden group">
                        <CardHeader className="bg-slate-50 p-8 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-primary" />
                                <CardTitle className="text-xl font-bold">Detalles del Perfil</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            {user.role === "TEACHER" && (
                                <div className="space-y-4">
                                    <p className="text-slate-600 font-medium">Eres parte del equipo docente. Puedes gestionar tus clases y calificar estudiantes desde tu panel principal.</p>
                                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                        <p className="text-sm font-bold text-primary">Estado de Docente</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">
                                            {user.teacherProfile?.active ? "ACTIVO" : "INACTIVO"}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {user.role === "PARENT" && (
                                <div className="space-y-4">
                                    <p className="text-slate-600 font-medium">Como acudiente, puedes supervisar las notas y reportes de tus hijos vinculados.</p>
                                </div>
                            )}
                            {user.role === "ADMIN" && (
                                <div className="space-y-4">
                                    <p className="text-slate-600 font-medium">Tienes permisos totales para administrar el sistema COEM.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-center pt-8">
                    <p className="text-slate-400 text-sm font-medium">Diseño por COEM Dev Team</p>
                </div>
            </div>
        </div>
    );
}
