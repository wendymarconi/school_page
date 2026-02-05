"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hash } from "bcryptjs";

// Regex para validar números de teléfono colombianos
// Acepta formatos: 300 123 4567, 3001234567, (300) 123-4567, +57 300 123 4567
const phoneRegex = /^(\+?57\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;

const ParentSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .optional(),
    phone: z.string()
        .regex(phoneRegex, "Formato de teléfono inválido. Ej: 300 123 4567")
        .optional()
        .or(z.literal("")),
    relationship: z.string().optional(),
});

export async function createParent(formData: FormData) {
    const validatedFields = ParentSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone"),
        relationship: formData.get("relationship"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Faltan campos. No se pudo crear el acudiente.",
        };
    }

    const { name, email, password, phone, relationship } = validatedFields.data;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return {
                message: "Ya existe un usuario con este correo electrónico.",
            };
        }

        const hashedPassword = await hash(password || "123456", 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "PARENT",
                parentProfile: {
                    create: {
                        phone,
                        relationship
                    }
                }
            }
        });

        revalidatePath("/dashboard/admin/parents");
    } catch (error) {
        console.error("Error creating parent:", error);
        return {
            message: "Error de base de datos: No se pudo crear el acudiente.",
        };
    }

    redirect("/dashboard/admin/parents");
}

export async function updateParent(id: string, formData: FormData) {
    const validatedFields = ParentSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        relationship: formData.get("relationship"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Faltan campos o son inválidos.",
        };
    }

    const { name, email, phone, relationship } = validatedFields.data;

    try {
        await prisma.parentProfile.update({
            where: { id },
            data: {
                user: {
                    update: {
                        name,
                        email,
                    }
                },
                phone,
                relationship
            }
        });

        revalidatePath("/dashboard/admin/parents");
    } catch (error) {
        console.error("Error updating parent:", error);
        return {
            message: "Error de base de datos: No se pudo actualizar el acudiente.",
        };
    }

    redirect("/dashboard/admin/parents");
}

export async function deleteParent(id: string) {
    try {
        // En un sistema real, podríamos querer desactivarlo en lugar de borrarlo
        // por integridad referencial, pero por ahora permitimos borrar el perfil.
        // Nota: Esto fallará si el padre está vinculado a alumnos debido a ParentStudent FK.
        await prisma.parentProfile.delete({
            where: { id }
        });
        revalidatePath("/dashboard/admin/parents");
        return { success: true };
    } catch (error) {
        return { success: false, message: "No se puede eliminar el acudiente porque tiene alumnos vinculados." };
    }
}

export async function toggleParentStatus(profileId: string, currentStatus: boolean) {
    try {
        await prisma.parentProfile.update({
            where: { id: profileId },
            data: { active: !currentStatus },
        });
        revalidatePath("/dashboard/admin/parents");
        return { success: true };
    } catch (error) {
        return { success: false, message: "Error al cambiar el estado del acudiente." };
    }
}
