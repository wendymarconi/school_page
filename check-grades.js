const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const count = await prisma.grade.count();
        const grades = await prisma.grade.findMany({
            include: {
                student: { select: { id: true, name: true } },
                class: { select: { id: true, name: true } }
            }
        });
        console.log('Total Grades:', count);
        console.log('Detailed Grades:', JSON.stringify(grades, null, 2));
    } catch (error) {
        console.error('Error checking DB:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
