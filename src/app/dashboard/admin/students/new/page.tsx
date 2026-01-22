import { getParents, getClasses } from "@/app/dashboard/admin/actions";
import StudentForm from "@/components/admin/StudentForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function NewStudentPage() {
    const parents = await getParents();
    const classes = await getClasses();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/students">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Volver</span>
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nuevo Estudiante</h1>
                    <p className="text-muted-foreground">Registra un alumno y vinculalo con su acudiente responsable.</p>
                </div>
            </div>

            <div className="mt-8">
                <StudentForm parents={parents} classes={classes} />
            </div>
        </div>
    );
}
