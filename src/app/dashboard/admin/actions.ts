"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const StudentSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    birthDate: z.string().transform((str) => new Date(str)),
    parentId: z.string().min(1, "Debe seleccionar un acudiente"),
    classId: z.string().optional(),
});

export async function createStudent(formData: FormData) {
    const validatedFields = StudentSchema.safeParse({
        name: formData.get("name"),
        birthDate: formData.get("birthDate"),
        parentId: formData.get("parentId"),
        classId: formData.get("classId"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Faltan campos. No se pudo crear el alumno.",
        };
    }

    const { name, birthDate, parentId, classId } = validatedFields.data;

    try {
        const student = await prisma.student.create({
            data: {
                name,
                birthDate,
                parentId,
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
        return {
            message: "Error de base de datos: No se pudo crear el alumno.",
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
