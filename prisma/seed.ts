import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('Escuela@2026', 10)

    // 0. Crear Administrador
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@coem.edu.co' },
        update: {
            password: await bcrypt.hash('admin123', 10),
        },
        create: {
            email: 'admin@coem.edu.co',
            password: await bcrypt.hash('admin123', 10),
            name: 'Administrador COEM',
            role: 'ADMIN',
        }
    })
    console.log('Admin creado:', adminUser.email)

    // 1. Crear o Actualizar Profesor
    const teacherUser = await prisma.user.upsert({
        where: { email: 'profe.juan@coem.edu.co' },
        update: {
            name: 'Prof. Juan Rodriguez',
            password: await bcrypt.hash('123456', 10),
        },
        create: {
            email: 'profe.juan@coem.edu.co',
            password: await bcrypt.hash('123456', 10),
            name: 'Prof. Juan Rodriguez',
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

        for (const [i, name] of studentNames.entries()) {
            const parentEmail = i === 0 ? 'padre.pedro@email.com' : `parent_${name.toLowerCase()}@test.com`
            const parentPass = await bcrypt.hash('123456', 10)

            const parentUser = await prisma.user.upsert({
                where: { email: parentEmail },
                update: {
                    name: i === 0 ? 'Padre Pedro' : `Acudiente de ${name}`,
                    password: parentPass
                },
                create: {
                    email: parentEmail,
                    password: parentPass,
                    name: i === 0 ? 'Padre Pedro' : `Acudiente de ${name}`,
                    role: 'PARENT',
                    parentProfile: {
                        create: {}
                    }
                },
                include: { parentProfile: true }
            })

            // Vincular estudiante
            let student = await prisma.student.findFirst({
                where: {
                    name,
                    parents: {
                        some: {
                            parent: {
                                userId: parentUser.id
                            }
                        }
                    }
                }
            })

            if (!student) {
                student = await prisma.student.create({
                    data: {
                        name,
                        birthDate: new Date('2012-05-15'),
                        parents: {
                            create: {
                                parentId: parentUser.parentProfile!.id
                            }
                        },
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
