"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const StudentSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    birthDate: z.string().transform((str) => new Date(str)),
    parentIds: z.array(z.string()).min(1, "Debe seleccionar al menos un acudiente"),
    classId: z.string().optional(),
});

export async function createStudent(formData: FormData) {
    const parentIds = formData.getAll("parentIds") as string[];
    const validatedFields = StudentSchema.safeParse({
        name: formData.get("name"),
        birthDate: formData.get("birthDate"),
        parentIds: parentIds,
        classId: formData.get("classId"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Faltan campos. No se pudo crear el alumno.",
        };
    }

    const { name, birthDate, parentIds: validatedParentIds, classId } = validatedFields.data;

    try {
        await prisma.student.create({
            data: {
                name,
                birthDate,
                parents: {
                    create: validatedParentIds.map(parentId => ({
                        parentId
                    }))
                },
                ...(classId ? {
                    enrollments: {
                        create: {
                            classId: classId
                        }
                    }
                } : {})
            },
        });

        revalidatePath("/dashboard/admin/students");
    } catch (error) {
        console.error("Error creating student:", error);
        return {
            message: "Error de base de datos: No se pudo crear el alumno.",
        };
    }

    redirect("/dashboard/admin/students");
}

export async function updateStudent(id: string, formData: FormData) {
    const parentIds = formData.getAll("parentIds") as string[];
    const rawBirthDate = formData.get("birthDate") as string;
    const validatedFields = StudentSchema.safeParse({
        name: formData.get("name"),
        birthDate: rawBirthDate,
        parentIds: parentIds,
        classId: formData.get("classId"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Faltan campos o son inválidos. No se pudo actualizar el alumno.",
        };
    }

    const { name, birthDate, parentIds: validatedParentIds, classId } = validatedFields.data;

    try {
        await prisma.student.update({
            where: { id },
            data: {
                name,
                birthDate,
                parents: {
                    deleteMany: {},
                    create: validatedParentIds.map(parentId => ({
                        parentId
                    }))
                },
            },
        });

        // Manejar inscripción a clase
        if (classId) {
            await prisma.classEnrollment.deleteMany({
                where: { studentId: id }
            });

            await prisma.classEnrollment.create({
                data: {
                    studentId: id,
                    classId: classId
                }
            });
        }

        revalidatePath("/dashboard/admin/students");
    } catch (error) {
        console.error("Error updating student:", error);
        return {
            message: "Error de base de datos: No se pudo actualizar el alumno.",
        };
    }

    redirect("/dashboard/admin/students");
}

export async function getParents() {
    return await prisma.parentProfile.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });
}

export async function getClasses() {
    return await prisma.class.findMany();
}
