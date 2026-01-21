"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSubject(formData: FormData) {
    const name = formData.get("name") as string;
    const teacherId = formData.get("teacherId") as string;
    const location = (formData.get("location") as string) || "";
    const schedule = (formData.get("schedule") as string) || "";

    if (!name || !teacherId) {
        return { success: false, error: "El nombre y el profesor son obligatorios." };
    }

    try {
        await prisma.class.create({
            data: {
                name,
                teacherId,
                location,
                schedule
            }
        });

        revalidatePath("/dashboard/admin/subjects");
        return { success: true };
    } catch (error) {
        console.error("Error al crear materia:", error);
        return { success: false, error: "Error al guardar la materia en la base de datos." };
    }
}

export async function updateSubject(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const teacherId = formData.get("teacherId") as string;
    const location = (formData.get("location") as string) || "";
    const schedule = (formData.get("schedule") as string) || "";

    if (!name || !teacherId) {
        return { success: false, error: "El nombre y el profesor son obligatorios." };
    }

    try {
        await prisma.class.update({
            where: { id },
            data: {
                name,
                teacherId,
                location,
                schedule
            }
        });

        revalidatePath("/dashboard/admin/subjects");
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar materia:", error);
        return { success: false, error: "Error al actualizar la materia." };
    }
}

export async function getSubjectById(id: string) {
    try {
        return await prisma.class.findUnique({
            where: { id },
            include: {
                teacher: true
            }
        });
    } catch (error) {
        console.error("Error al obtener materia por ID:", error);
        return null;
    }
}

export async function getTeachers() {
    try {
        const teachers = await prisma.user.findMany({
            where: { role: "TEACHER" },
            select: {
                id: true,
                name: true,
                email: true,
                teacherProfile: {
                    select: { id: true }
                }
            }
        });

        // Retornamos el ID del TeacherProfile que es lo que espera el modelo Class
        return teachers.map(t => ({
            id: t.teacherProfile?.id || "",
            name: t.name,
            email: t.email
        })).filter(t => t.id !== "");

    } catch (error) {
        console.error("Error al obtener profesores:", error);
        return [];
    }
}
