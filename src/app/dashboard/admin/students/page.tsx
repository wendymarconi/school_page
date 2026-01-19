import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, User, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function StudentsListPage() {
    const students = await prisma.student.findMany({
        include: {
            parent: {
                include: {
                    user: {
                        select: { name: true }
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
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Listado de Alumnos</h1>
                    <p className="text-muted-foreground text-lg">Administra la base de datos de estudiantes registrados.</p>
                </div>
                <Link href="/dashboard/admin/students/new">
                    <Button className="gap-2 h-12 px-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <Plus className="h-5 w-5" /> Inscribir Alumno
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Buscar alumno..." className="pl-10 h-10 border-slate-200" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                    <Card key={student.id} className="group hover:shadow-xl transition-all border-slate-100 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{student.name}</h3>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Estudiante</p>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="h-4 w-4 text-slate-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="text-slate-400 font-medium leading-none mb-1">Acudiente</p>
                                        <p className="text-slate-700 font-semibold">{student.parent.user.name}</p>
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
