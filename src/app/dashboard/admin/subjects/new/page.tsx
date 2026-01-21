import { getTeachers } from "../actions";
import { SubjectForm } from "@/components/admin/SubjectForm";

export default async function NewSubjectPage() {
    const teachers = await getTeachers();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Nueva Materia</h1>
                <p className="text-muted-foreground text-lg">Completa los datos para registrar una nueva asignatura en el sistema.</p>
            </div>

            <SubjectForm teachers={teachers} />
        </div>
    );
}
