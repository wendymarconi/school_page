import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('Escuela@2026', 10)

    // 0. Crear Administrador
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@school.com' },
        update: {},
        create: {
            email: 'admin@school.com',
            password: hashedPassword,
            name: 'Administrador COEM',
            role: 'ADMIN',
        }
    })
    console.log('Admin creado:', adminUser.email)

    // 1. Crear o Actualizar Profesor
    const teacherUser = await prisma.user.upsert({
        where: { email: 'teacher@school.com' },
        update: {
            name: 'Prof. Rodriguez',
            password: hashedPassword,
        },
        create: {
            email: 'teacher@school.com',
            password: hashedPassword,
            name: 'Prof. Rodriguez',
            role: 'TEACHER',
            teacherProfile: {
                create: {
                    classes: {
                        create: {
                            name: 'Matemáticas Avanzadas',
                            location: 'Curso 304',
                            schedule: 'Lun / Mié 10:00 AM'
                        }
                    }
                }
            }
        },
        include: { teacherProfile: { include: { classes: true } } }
    });

    // Asegurar que las clases tengan nombres en español si ya existen
    if (teacherUser.teacherProfile) {
        await prisma.class.updateMany({
            where: { teacherId: teacherUser.teacherProfile.id },
            data: {
                name: 'Matemáticas Avanzadas',
                location: 'Curso 304',
                schedule: 'Lun / Mié 10:00 AM'
            }
        });
    }

    console.log('Profesor actualizado:', teacherUser.email)

    // 2. Crear o Actualizar Estudiantes y Padres
    if (teacherUser.teacherProfile?.classes[0]) {
        const classId = teacherUser.teacherProfile.classes[0].id
        const studentNames = ['Alejandra', 'Bernardo', 'Camilo']

        for (const name of studentNames) {
            const parentEmail = `parent_${name.toLowerCase()}@test.com`

            const parentUser = await prisma.user.upsert({
                where: { email: parentEmail },
                update: {
                    name: `Acudiente de ${name}`,
                    password: hashedPassword
                },
                create: {
                    email: parentEmail,
                    password: hashedPassword,
                    name: `Acudiente de ${name}`,
                    role: 'PARENT',
                    parentProfile: {
                        create: {}
                    }
                },
                include: { parentProfile: true }
            })

            // Vincular estudiante
            let student = await prisma.student.findFirst({
                where: { name, parent: { userId: parentUser.id } }
            })

            if (!student) {
                student = await prisma.student.create({
                    data: {
                        name,
                        birthDate: new Date('2012-05-15'),
                        parentId: parentUser.parentProfile!.id,
                        enrollments: {
                            create: { classId }
                        }
                    }
                })
            } else {
                // Actualizar nombre si ya existe
                await prisma.student.update({
                    where: { id: student.id },
                    data: { name }
                })
            }

            console.log('Estudiante/Padre procesado:', name)
        }
    }

    console.log('Seed terminado con éxito.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
