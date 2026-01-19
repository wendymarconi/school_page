import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, GraduationCap, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        // En un entorno real, redirigiríamos, pero para desarrollo permitiremos el acceso si no hay sesión estricta
        // o si es un usuario que queremos que sea admin.
        // redirect("/login");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
                <p className="text-muted-foreground">Gestiona los alumnos, profesores y acudientes del colegio.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gestión de Alumnos</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Resumen</div>
                        <p className="text-xs text-muted-foreground">Crear, editar y asignar alumnos a clases.</p>
                        <div className="mt-4">
                            <Link href="/dashboard/admin/students">
                                <Button className="w-full gap-2">
                                    <Users className="h-4 w-4" /> Ver Alumnos
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nuevos Registros</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Acciones Rápidas</div>
                        <p className="text-xs text-muted-foreground">Inscribe un nuevo estudiante ahora mismo.</p>
                        <div className="mt-4">
                            <Link href="/dashboard/admin/students/new">
                                <Button variant="secondary" className="w-full gap-2">
                                    <UserPlus className="h-4 w-4" /> Crear Alumno
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
