import { getTeachers, getSubjectById } from "../../actions";
import { SubjectForm } from "@/components/admin/SubjectForm";
import { notFound } from "next/navigation";

export default async function EditSubjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [teachers, subject] = await Promise.all([
        getTeachers(),
        getSubjectById(id)
    ]);

    if (!subject) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Editar Materia</h1>
                <p className="text-muted-foreground text-lg">Modifica los detalles de la asignatura seleccionada.</p>
            </div>

            <SubjectForm teachers={teachers} initialData={subject} />
        </div>
    );
}
