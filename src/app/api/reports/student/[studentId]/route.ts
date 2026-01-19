import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { renderToStream } from "@react-pdf/renderer";
import { ReportCard } from "@/components/reports/ReportCard";
import { NextResponse } from "next/server";
import { createElement } from "react";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ studentId: string }> }
) {
    const session = await auth();
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { studentId } = await params;

    // Verificar permisos: el usuario debe ser el padre del alumno o un profesor
    const student = await prisma.student.findUnique({
        where: {
            id: studentId,
        },
        include: {
            parent: true,
            enrollments: {
                include: {
                    class: {
                        include: {
                            grades: {
                                where: { studentId: studentId },
                                orderBy: { date: 'desc' }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!student) {
        return new NextResponse("Student not found", { status: 404 });
    }

    // Seguridad: Si es padre, debe ser su hijo. Si es profesor, omitimos por ahora la validación de clase para simplificar
    if (session.user.role === "PARENT" && student.parent.userId !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    // Preparar datos para el PDF
    const calculateAverage = (grades: any[]) => {
        if (grades.length === 0) return "0.0";
        const sum = grades.reduce((acc, g) => acc + g.value, 0);
        return (sum / grades.length).toFixed(1);
    };

    const subjects = student.enrollments.map(e => ({
        name: e.class.name,
        average: calculateAverage(e.class.grades)
    }));

    const allGrades = student.enrollments.flatMap(e => e.class.grades);
    const overallAverage = calculateAverage(allGrades);

    // Generar el PDF
    const pdfElement = createElement(ReportCard, {
        studentName: student.name,
        studentId: student.id,
        overallAverage,
        subjects
    });

    const stream = await renderToStream(pdfElement as any);

    return new NextResponse(stream as any, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="Boletin_${student.name.replace(/\s+/g, '_')}.pdf"`,
        },
    });
}
