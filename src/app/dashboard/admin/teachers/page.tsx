import { Plus, Search, User, Mail, Power, Pencil, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getTeachers, toggleTeacherStatus } from "./actions";
import { Badge } from "@/components/ui/badge";

export default async function TeachersPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status } = await searchParams;
    const isActiveFilter = status === "inactive" ? false : true;

    const teachers = await getTeachers(isActiveFilter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profesores</h1>
                    <p className="text-muted-foreground text-lg">Administra la nómina de docentes del colegio.</p>
                </div>
                <Link href="/dashboard/admin/teachers/new">
                    <Button className="gap-2 h-12 px-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <Plus className="h-5 w-5" /> Nuevo Profesor
                    </Button>
                </Link>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    <Link href="/dashboard/admin/teachers?status=active">
                        <Button
                            variant={status === "active" || !status ? "default" : "ghost"}
                            size="sm"
                            className="rounded-lg px-6 font-bold"
                        >
                            Activos
                        </Button>
                    </Link>
                    <Link href="/dashboard/admin/teachers?status=inactive">
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
                        <Input placeholder="Buscar profesor..." className="pl-10 h-10 border-slate-200" />
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teachers.map((teacher) => (
                    <Card key={teacher.id} className="group hover:shadow-xl transition-all border-slate-100 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${teacher.active ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-500'}`}>
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{teacher.user.name}</h3>
                                    <Badge variant={teacher.active ? "default" : "secondary"} className="text-[10px] uppercase font-bold px-2 py-0">
                                        {teacher.active ? "Activo" : "Inactivo"}
                                    </Badge>
                                </div>
                                <div className="flex gap-1">
                                    <Link href={`/dashboard/admin/teachers/${teacher.user.id}/edit`}>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-primary">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <form action={async () => {
                                        "use server"
                                        await toggleTeacherStatus(teacher.id, teacher.active)
                                    }}>
                                        <Button type="submit" size="icon" variant="ghost" className={`h-8 w-8 ${teacher.active ? 'text-green-500 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100'}`}>
                                            <Power className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600 truncate">{teacher.user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <GraduationCap className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">
                                        {teacher.classes.length} {teacher.classes.length === 1 ? "Materia asignada" : "Materias asignadas"}
                                    </span>
                                </div>
                                {teacher.classes.length > 0 && (
                                    <div className="flex flex-wrap gap-1 pt-2">
                                        {teacher.classes.slice(0, 3).map(cls => (
                                            <Badge key={cls.id} variant="outline" className="text-[10px] bg-slate-50 border-slate-200">
                                                {cls.name}
                                            </Badge>
                                        ))}
                                        {teacher.classes.length > 3 && (
                                            <span className="text-[10px] text-slate-400 font-medium px-2">+{teacher.classes.length - 3} más</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {teachers.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900">No hay profesores registrados</h3>
                        <p className="text-slate-500 mb-6">Comienza registrando al primer docente del colegio.</p>
                        <Link href="/dashboard/admin/teachers/new">
                            <Button variant="outline">Nuevo Profesor</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
