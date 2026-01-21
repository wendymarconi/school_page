import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, Book, User, MapPin, Clock, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function SubjectsListPage() {
    const subjects = await prisma.class.findMany({
        include: {
            teacher: {
                include: {
                    user: {
                        select: { name: true }
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
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Materias</h1>
                    <p className="text-muted-foreground text-lg">Administra las asignaturas, profesores y horarios.</p>
                </div>
                <Link href="/dashboard/admin/subjects/new">
                    <Button className="gap-2 h-12 px-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <Plus className="h-5 w-5" /> Nueva Materia
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Buscar materia..." className="pl-10 h-10 border-slate-200" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => (
                    <Card key={subject.id} className="group hover:shadow-xl transition-all border-slate-100 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    <Book className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{subject.name}</h3>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Materia / Clase</p>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/dashboard/admin/subjects/${subject.id}/edit`}>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-primary">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="h-4 w-4 text-slate-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="text-slate-400 font-medium leading-none mb-1">Profesor Responsable</p>
                                        <p className="text-slate-700 font-semibold">{subject.teacher.user.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="text-slate-400 font-medium leading-none mb-1">Curso / Ubicación</p>
                                        <p className="text-slate-700 font-semibold">{subject.location || 'No asignada'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="h-4 w-4 text-slate-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="text-slate-400 font-medium leading-none mb-1">Horario</p>
                                        <p className="text-slate-700 font-semibold">{subject.schedule || 'No definido'}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {subjects.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <Book className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900">No hay materias registradas</h3>
                        <p className="text-slate-500 mb-6">Comienza creando la primera asignatura del colegio.</p>
                        <Link href="/dashboard/admin/subjects/new">
                            <Button variant="outline">Nueva Materia</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
