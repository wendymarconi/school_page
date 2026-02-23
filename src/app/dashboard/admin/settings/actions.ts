"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAcademicPeriods() {
    return await prisma.academicPeriod.findMany({
        orderBy: { number: 'asc' }
    });
}

export async function togglePeriodStatus(id: string, currentStatus: boolean) {
    try {
        // Si vamos a activar un periodo, desactivamos los demás para que solo haya uno activo a la vez
        if (!currentStatus) {
            await prisma.academicPeriod.updateMany({
                where: { active: true },
                data: { active: false }
            });
        }

        await prisma.academicPeriod.update({
            where: { id },
            data: { active: !currentStatus }
        });

        revalidatePath("/dashboard/admin/settings");
        return { success: true };
    } catch (error) {
        return { success: false, message: "Error al cambiar el estado del periodo." };
    }
}

export async function updatePeriodDates(id: string, startDate: Date, endDate: Date) {
    try {
        await prisma.academicPeriod.update({
            where: { id },
            data: { startDate, endDate }
        });
        revalidatePath("/dashboard/admin/settings");
        return { success: true };
    } catch (error) {
        return { success: false, message: "Error al actualizar las fechas del periodo." };
    }
}
