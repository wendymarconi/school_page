'use client';

import { useState } from 'react';
import { updateGrade } from '@/app/dashboard/teacher/actions';

interface Grade {
    id: string;
    value: number;
    description: string | null;
    date: string; // Serialized date
}

interface Student {
    id: string;
    name: string;
    grades: Grade[];
}

interface Enrollment {
    studentId: string;
    student: Student;
}

export default function GradeTable({ students, classId }: { students: Enrollment[], classId: string }) {
    const [loading, setLoading] = useState(false);

    async function handleAddGrade(studentId: string, formData: FormData) {
        setLoading(true);
        const value = parseFloat(formData.get('grade') as string);
        const description = formData.get('description') as string;

        try {
            await updateGrade(studentId, classId, value, description);
            // In a real app we might want to reset the form or show specific success msg
            // The Server Action calls revalidatePath, so the list should update automatically.
            const form = document.getElementById(`form-${studentId}`) as HTMLFormElement;
            if (form) form.reset();
        } catch (e) {
            alert('Error al actualizar la calificación');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-md border">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estudiante</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Notas Actuales</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nueva Nota</th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {students.map((enrollment) => (
                        <tr key={enrollment.studentId} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle font-medium">
                                {enrollment.student.name}
                            </td>
                            <td className="p-4 align-middle">
                                <div className="flex flex-wrap gap-1">
                                    {enrollment.student.grades.map((g) => (
                                        <div
                                            key={g.id}
                                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                            title={`${g.description || 'Sin descripción'} - ${new Date(g.date).toLocaleDateString()}`}
                                        >
                                            {g.value}
                                        </div>
                                    ))}
                                    {enrollment.student.grades.length === 0 && <span className="text-muted-foreground text-xs italic">Sin notas registradas</span>}
                                </div>
                            </td>
                            <td className="p-4 align-middle">
                                <form
                                    id={`form-${enrollment.studentId}`}
                                    action={(fd) => handleAddGrade(enrollment.studentId, fd)}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        name="grade"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        placeholder="0-10"
                                        className="flex h-9 w-20 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    />
                                    <input
                                        name="description"
                                        type="text"
                                        placeholder="Examen/Tarea"
                                        className="flex h-9 w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        Ingresar
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    {students.length === 0 && (
                        <tr>
                            <td colSpan={3} className="p-4 text-center text-muted-foreground">
                                No hay estudiantes inscritos en esta clase.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
