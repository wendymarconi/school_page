import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { redirect } from "next/navigation";

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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
                    <p className="text-muted-foreground">Bienvenido de nuevo, {session.user.name}</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teacherProfile.classes.map((cls: any) => (
                    <Link key={cls.id} href={`/dashboard/teacher/classes/${cls.id}`}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                            <CardHeader>
                                <CardTitle>{cls.name}</CardTitle>
                                <CardDescription>{cls.location || 'Sin curso'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{cls._count.students} Estudiantes</p>
                                <p className="text-sm text-muted-foreground">{cls.schedule || 'Sin horario'}</p>
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
