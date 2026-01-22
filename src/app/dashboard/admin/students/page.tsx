import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, User, Calendar, MapPin, Power, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toggleStudentStatus } from "./status-actions";
import { Badge } from "@/components/ui/badge";

export default async function StudentsListPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status } = await searchParams;
    const isActiveFilter = status === "inactive" ? false : true; // Default to true (active)

    const students = await prisma.student.findMany({
        where: { active: isActiveFilter },
        include: {
            parents: {
                include: {
                    parent: {
                        include: {
                            user: {
                                select: { name: true }
                            }
                        }
                    }
                }
            },
            enrollments: {
                include: {
                    class: {
                        select: { name: true, location: true }
                    }
                }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Alumnos</h1>
                    <p className="text-muted-foreground text-lg">Administra la base de datos de estudiantes registrados.</p>
                </div>
                <Link href="/dashboard/admin/students/new">
                    <Button className="gap-2 h-12 px-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <Plus className="h-5 w-5" /> Inscribir Alumno
                    </Button>
                </Link>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    <Link href="/dashboard/admin/students?status=active">
                        <Button
                            variant={status === "active" || !status ? "default" : "ghost"}
                            size="sm"
                            className="rounded-lg px-6 font-bold"
                        >
                            Activos
                        </Button>
                    </Link>
                    <Link href="/dashboard/admin/students?status=inactive">
                        <Button
                            variant={status === "inactive" ? "default" : "ghost"}
                            size="sm"
                            className="rounded-lg px-6 font-bold"
                        >
                            Inactivos
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-2 max-w-sm flex-1">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Buscar alumno..." className="pl-10 h-10 border-slate-200" />
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                    <Card key={student.id} className="group hover:shadow-xl transition-all border-slate-100 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${student.active ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-500'}`}>
                                    {student.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{student.name}</h3>
                                    <Badge variant={student.active ? "default" : "secondary"} className="text-[10px] uppercase font-bold px-2 py-0">
                                        {student.active ? "Activo" : "Inactivo"}
                                    </Badge>
                                </div>
                                <div className="flex gap-1">
                                    <Link href={`/dashboard/admin/students/${student.id}/edit`}>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <form action={async () => {
                                        "use server"
                                        await toggleStudentStatus(student.id, student.active)
                                    }}>
                                        <Button type="submit" size="icon" variant="ghost" className={`h-8 w-8 ${student.active ? 'text-green-500 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100'}`}>
                                            <Power className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="h-4 w-4 text-slate-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="text-slate-400 font-medium leading-none mb-1">Acudiente(s)</p>
                                        <p className="text-slate-700 font-semibold">
                                            {student.parents.map((p: any) => p.parent.user.name).join(", ") || "Sin asignar"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="text-slate-400 font-medium leading-none mb-1">Nacimiento</p>
                                        <p className="text-slate-700 font-semibold">{new Date(student.birthDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="text-slate-400 font-medium leading-none mb-1">Curso / Clase</p>
                                        <p className="text-slate-700 font-semibold">
                                            {student.enrollments[0]?.class.name || student.enrollments[0]?.class.location || 'Sin asignar'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {students.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900">No hay alumnos registrados</h3>
                        <p className="text-slate-500 mb-6">Comienza inscribiendo al primer estudiante del colegio.</p>
                        <Link href="/dashboard/admin/students/new">
                            <Button variant="outline">Inscribir Alumno</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
