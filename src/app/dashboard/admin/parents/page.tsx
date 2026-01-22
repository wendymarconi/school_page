import { prisma } from "@/lib/prisma";
import {
    Plus,
    Search,
    User,
    Mail,
    Users,
    Pencil,
    Trash2,
    UserPlus,
    ShieldCheck,
    GraduationCap,
    Phone,
    UserCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import ParentForm from "./ParentForm";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function ParentsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;

    const parents = await prisma.parentProfile.findMany({
        where: q ? {
            user: {
                OR: [
                    { name: { contains: q } },
                    { email: { contains: q } },
                ]
            }
        } : {},
        include: {
            user: true,
            students: {
                include: {
                    student: true
                }
            }
        },
        orderBy: {
            user: {
                name: 'asc'
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Acudientes</h1>
                    <p className="text-slate-500 text-lg">Gestiona las cuentas de los padres de familia y responsables.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 px-6">
                            <UserPlus className="h-5 w-5 mr-2" />
                            Nuevo Acudiente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <ParentForm />
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <form method="get">
                            <Input
                                name="q"
                                placeholder="Buscar por nombre o email..."
                                className="pl-10 h-10 border-slate-200 bg-white"
                                defaultValue={q}
                            />
                        </form>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {parents.length === 0 ? (
                            <div className="col-span-full py-20 text-center space-y-4">
                                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                                    <Users className="h-10 w-10" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-bold text-slate-900">No se encontraron acudientes</p>
                                    <p className="text-slate-500">Prueba con otro término de búsqueda o registra uno nuevo.</p>
                                </div>
                            </div>
                        ) : (
                            parents.map((parent) => (
                                <Card key={parent.id} className="group overflow-hidden border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all">
                                    <div className="bg-slate-50/50 p-4 border-b border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {parent.user.name?.charAt(0) || <User className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{parent.user.name}</h3>
                                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                                    <UserCircle2 className="h-3 w-3" />
                                                    {parent.relationship?.toUpperCase() || "ACUDIENTE"} ACTIVO
                                                </div>
                                            </div>
                                        </div>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <ParentForm initialData={parent} />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                                <span className="text-sm text-slate-600 truncate">{parent.user.email}</span>
                                            </div>
                                            {parent.phone && (
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-4 w-4 text-slate-400" />
                                                    <span className="text-sm text-slate-600">{parent.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                <GraduationCap className="h-4 w-4 text-primary" />
                                                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Alumnos Vinculados ({parent.students.length})</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {parent.students.length > 0 ? (
                                                    parent.students.map((ps) => (
                                                        <Badge key={ps.studentId} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none px-2 py-0 h-6">
                                                            {ps.student.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Sin alumnos asignados</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
