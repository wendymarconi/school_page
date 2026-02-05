"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

const TeacherSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .optional()
        .or(z.literal("")),
});

export async function createTeacher(formData: FormData) {
    const validatedFields = TeacherSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Faltan campos. No se pudo crear el profesor.",
        };
    }

    const { name, email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "TEACHER",
                teacherProfile: {
                    create: {
                        active: true
                    }
                }
            },
        });

        revalidatePath("/dashboard/admin/teachers");
        return { success: true };
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { message: "El correo electrónico ya está registrado." };
        }
        return { message: "Error de base de datos: No se pudo crear el profesor." };
    }
}

export async function updateTeacher(id: string, formData: FormData) {
    const validatedFields = TeacherSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Faltan campos o son inválidos.",
        };
    }

    const { name, email, password } = validatedFields.data;

    try {
        const updateData: any = { name, email };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await prisma.user.update({
            where: { id },
            data: updateData,
        });

        revalidatePath("/dashboard/admin/teachers");
        return { success: true };
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, message: "El correo electrónico ya está en uso por otro usuario." };
        }
        return { success: false, message: "Error al actualizar el profesor." };
    }
}

export async function toggleTeacherStatus(profileId: string, currentStatus: boolean) {
    try {
        await prisma.teacherProfile.update({
            where: { id: profileId },
            data: { active: !currentStatus },
        });
        revalidatePath("/dashboard/admin/teachers");
        return { success: true };
    } catch (error) {
        return { message: "Error al cambiar el estado del profesor." };
    }
}

export async function getTeachers(active?: boolean) {
    const where: any = {};
    if (active !== undefined) {
        where.active = active;
    }

    return await prisma.teacherProfile.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            classes: {
                where: {
                    active: true
                }
            }
        },
        orderBy: {
            user: {
                name: 'asc'
            }
        }
    });
}
