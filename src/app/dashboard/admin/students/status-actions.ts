"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleStudentStatus(studentId: string, currentStatus: boolean) {
    try {
        await prisma.student.update({
            where: { id: studentId },
            data: { active: !currentStatus },
        });
        revalidatePath("/dashboard/admin/students");
        return { success: true };
    } catch (error) {
        console.error("Error al cambiar estado del alumno:", error);
        return { success: false, error: "No se pudo cambiar el estado del alumno." };
    }
}
