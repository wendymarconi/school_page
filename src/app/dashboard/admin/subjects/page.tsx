import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, Book, User, MapPin, Clock, Pencil, Power } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toggleSubjectStatus, getSubjects } from "./actions";

export default async function SubjectsListPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; q?: string }>;
}) {
    const { status, q: query } = await searchParams;
    const isActiveFilter = status === "inactive" ? false : true;

    const subjects = await getSubjects(isActiveFilter, query);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Materias</h1>
                    <p className="text-muted-foreground text-lg">Administra las asignaturas, profesores y horarios.</p>
                </div>
                <Link href="/dashboard/admin/subjects/new">
                    <Button className="gap-2 h-12 px-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <Plus className="h-5 w-5" /> Nueva Materia
                    </Button>
                </Link>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    <Link href="/dashboard/admin/subjects?status=active">
                        <Button
                            variant={status === "active" || !status ? "default" : "ghost"}
                            size="sm"
                            className="rounded-lg px-6 font-bold"
                        >
                            Activos
                        </Button>
                    </Link>
                    <Link href="/dashboard/admin/subjects?status=inactive">
                        <Button
                            variant={status === "inactive" ? "default" : "ghost"}
                            size="sm"
                            className="rounded-lg px-6 font-bold"
                        >
                            Inactivas
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-2 max-w-sm flex-1">
                    <form className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="Buscar por materia, profesor o curso..."
                            className="pl-10 h-10 border-slate-200"
                        />
                        {status && <input type="hidden" name="status" value={status} />}
                    </form>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => (
                    <Card key={subject.id} className="group hover:shadow-xl transition-all border-slate-100 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${subject.active ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-500'}`}>
                                    <Book className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{subject.name}</h3>
                                    <Badge variant={subject.active ? "default" : "secondary"} className="text-[10px] uppercase font-bold px-2 py-0">
                                        {subject.active ? "Activa" : "Inactiva"}
                                    </Badge>
                                </div>
                                <div className="flex gap-1">
                                    <Link href={`/dashboard/admin/subjects/${subject.id}/edit`}>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-primary">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <form action={async () => {
                                        "use server"
                                        await toggleSubjectStatus(subject.id, subject.active)
                                    }}>
                                        <Button type="submit" size="icon" variant="ghost" className={`h-8 w-8 ${subject.active ? 'text-green-500 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100'}`}>
                                            <Power className="h-4 w-4" />
                                        </Button>
                                    </form>
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
