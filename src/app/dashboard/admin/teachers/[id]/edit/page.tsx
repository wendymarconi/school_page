import { prisma } from "@/lib/prisma";
import { TeacherForm } from "@/components/admin/TeacherForm";
import { notFound } from "next/navigation";

export default async function EditTeacherPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const teacher = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }
    });

    if (!teacher || teacher.role !== "TEACHER") {
        notFound();
    }

    return (
        <div className="py-8">
            <TeacherForm teacher={teacher} isEdit={true} />
        </div>
    );
}
