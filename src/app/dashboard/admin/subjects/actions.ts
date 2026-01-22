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
        // Verificar conflicto de horario para el profesor
        if (schedule) {
            const existingClass = await prisma.class.findFirst({
                where: {
                    teacherId,
                    schedule,
                    active: true
                }
            });

            if (existingClass) {
                return {
                    success: false,
                    error: `El profesor ya tiene asignada la materia "${existingClass.name}" en este mismo horario.`
                };
            }
        }

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
        // Verificar conflicto de horario para el profesor
        if (schedule) {
            const existingClass = await prisma.class.findFirst({
                where: {
                    teacherId,
                    schedule,
                    active: true,
                    NOT: { id } // Excluir la materia actual de la búsqueda
                }
            });

            if (existingClass) {
                return {
                    success: false,
                    error: `El profesor ya tiene asignada la materia "${existingClass.name}" en este mismo horario.`
                };
            }
        }

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

export async function toggleSubjectStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.class.update({
            where: { id },
            data: { active: !currentStatus },
        });
        revalidatePath("/dashboard/admin/subjects");
        return { success: true };
    } catch (error) {
        console.error("Error al cambiar estado de materia:", error);
        return { success: false, error: "Error al cambiar el estado." };
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

export async function getSubjects(active?: boolean, query?: string) {
    const where: any = {};
    if (active !== undefined) {
        where.active = active;
    }

    if (query) {
        where.OR = [
            { name: { contains: query } },
            { location: { contains: query } },
            {
                teacher: {
                    user: {
                        name: { contains: query }
                    }
                }
            }
        ];
    }

    try {
        return await prisma.class.findMany({
            where,
            include: {
                teacher: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: { name: 'asc' }
        });
    } catch (error) {
        console.error("Error al obtener materias:", error);
        return [];
    }
}

export async function getTeachers() {
    try {
        const teachers = await prisma.user.findMany({
            where: {
                role: "TEACHER",
                teacherProfile: {
                    active: true
                }
            },
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
