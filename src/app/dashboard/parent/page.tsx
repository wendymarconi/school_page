import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { User as UserIcon } from "lucide-react";

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
                    enrollments: {
                        include: { class: true }
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mis Hijos</h1>
                    <p className="text-muted-foreground">Selecciona un hijo para ver su progreso académico.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {parentProfile.students.map((student: any) => (
                    <Link key={student.id} href={`/dashboard/parent/children/${student.id}`}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <UserIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>{student.name}</CardTitle>
                                    <CardDescription>ID: {student.id.slice(0, 8)}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    <p>Clases Inscritas: {student.enrollments.length}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {parentProfile.students.length === 0 && (
                    <div className="col-span-full text-center py-10 border rounded-lg border-dashed">
                        <p className="text-muted-foreground">No hay hijos vinculados a tu cuenta.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
