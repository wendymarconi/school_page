import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StudentForm from "@/components/admin/StudentForm";
import { getParents, getClasses } from "../../../actions";

export default async function EditStudentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const student = await prisma.student.findUnique({
        where: { id },
        include: {
            parents: true,
            enrollments: {
                take: 1
            }
        }
    });

    if (!student) {
        notFound();
    }

    const parents = await getParents();
    const classes = await getClasses();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Editar Alumno</h1>
                <p className="text-muted-foreground text-lg">Actualiza la información personal y académica del estudiante.</p>
            </div>

            <StudentForm
                parents={parents}
                classes={classes}
                initialData={student}
            />
        </div>
    );
}
