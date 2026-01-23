'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateGrade(
    studentId: string,
    classId: string,
    value: number,
    description?: string,
    period: number = 1,
    type?: string,
    gradeId?: string
) {
    const session = await auth();
    if (session?.user?.role !== "TEACHER") {
        throw new Error("Unauthorized");
    }

    // Verify the class belongs to the teacher
    const classCheck = await prisma.class.findUnique({
        where: {
            id: classId,
            teacher: { userId: session.user.id }
        }
    });

    if (!classCheck) {
        throw new Error("Unauthorized class access");
    }

    if (gradeId) {
        // Update existing grade
        await prisma.grade.update({
            where: { id: gradeId },
            data: {
                value,
                description,
                period,
                type,
                date: new Date() // Update date to show last modification? Or keep original? Usually keep original but let's update for now.
            }
        });
    } else {
        // Create new grade
        await prisma.grade.create({
            data: {
                value,
                description,
                period,
                type,
                studentId,
                classId,
                date: new Date()
            }
        });
    }

    revalidatePath(`/dashboard/teacher/classes/${classId}`);
}

export async function deleteGrade(gradeId: string, classId: string) {
    const session = await auth();
    if (session?.user?.role !== "TEACHER") {
        throw new Error("Unauthorized");
    }

    // Verify class ownership before deleting any grade
    const classCheck = await prisma.class.findUnique({
        where: {
            id: classId,
            teacher: { userId: session.user.id }
        }
    });

    if (!classCheck) {
        throw new Error("Unauthorized");
    }

    await prisma.grade.delete({
        where: { id: gradeId }
    });

    revalidatePath(`/dashboard/teacher/classes/${classId}`);
}
