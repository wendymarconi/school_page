import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ChildDetailsPage({ params }: { params: Promise<{ studentId: string }> }) {
    const session = await auth();
    if (session?.user?.role !== "PARENT") redirect("/login");

    const { studentId } = await params;

    // Verify parent owns student
    const student = await prisma.student.findUnique({
        where: {
            id: studentId,
            parent: { userId: session.user.id }
        },
        include: {
            enrollments: {
                include: {
                    class: true
                }
            },
            grades: {
                orderBy: { date: 'desc' },
                include: {
                    class: true
                }
            }
        }
    });

    if (!student) notFound();

    // Group grades by class
    const gradesByClass = student.grades.reduce((acc: any, grade: any) => {
        const className = grade.class.name;
        if (!acc[className]) {
            acc[className] = [];
        }
        acc[className].push(grade);
        return acc;
    }, {} as Record<string, typeof student.grades>);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/parent">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
                    <p className="text-muted-foreground">Boletín de Calificaciones</p>
                </div>
            </div>

            <div className="grid gap-6">
                {Object.keys(gradesByClass).map((className) => (
                    <Card key={className}>
                        <CardHeader>
                            <CardTitle>{className}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Descripción</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nota</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {gradesByClass[className].map((grade: any) => (
                                            <tr key={grade.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle">
                                                    {grade.date.toLocaleDateString()}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {grade.description || '-'}
                                                </td>
                                                <td className="p-4 align-middle font-bold">
                                                    {grade.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {Object.keys(gradesByClass).length === 0 && (
                    <div className="text-center py-10 border rounded-lg border-dashed">
                        <p className="text-muted-foreground">Aún no hay calificaciones registradas.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
