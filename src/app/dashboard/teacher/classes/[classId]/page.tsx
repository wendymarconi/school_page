import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import GradeTable from "@/components/teacher/GradeTable";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ClassDetailsPage({ params }: { params: Promise<{ classId: string }> }) {
    const session = await auth();
    if (session?.user?.role !== "TEACHER") redirect("/login");

    const { classId } = await params;

    const classData = await prisma.class.findUnique({
        where: {
            id: classId,
            teacher: { userId: session.user.id }
        },
        include: {
            students: {
                include: {
                    student: {
                        include: {
                            grades: {
                                where: { classId: classId },
                                orderBy: { date: 'desc' }
                            }
                        }
                    }
                },
                orderBy: { student: { name: 'asc' } }
            }
        }
    });

    if (!classData) notFound();

    // Serialize dates for Client Component
    const students = classData.students.map((enrollment: any) => ({
        ...enrollment,
        student: {
            ...enrollment.student,
            grades: enrollment.student.grades.map((g: any) => ({
                ...g,
                date: g.date.toISOString(),
            }))
        }
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/teacher">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Volver</span>
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{classData.name}</h1>
                    <p className="text-muted-foreground">{classData.location || 'Sin curso'} • {classData.schedule || 'Sin horario'}</p>
                </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow p-1 sm:p-6">
                <div className="mb-4 px-2 sm:px-0">
                    <h2 className="text-xl font-semibold">Calificaciones</h2>
                    <p className="text-sm text-muted-foreground">Ver y añadir notas para los estudiantes de esta clase.</p>
                </div>
                <div className="overflow-x-auto">
                    <GradeTable students={students} classId={classId} />
                </div>
            </div>
        </div>
    )
}
