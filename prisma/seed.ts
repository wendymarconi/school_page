import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('Escuela@2026', 10)

    // 1. Crear o Actualizar Profesor
    const teacherUser = await prisma.user.upsert({
        where: { email: 'teacher@school.com' },
        update: { password: hashedPassword },
        create: {
            email: 'teacher@school.com',
            password: hashedPassword,
            name: 'Mr. Smith',
            role: 'TEACHER',
            teacherProfile: {
                create: {
                    classes: {
                        create: {
                            name: 'Mathematics 101',
                            location: 'Curso 304',
                            schedule: 'Lun/Mie 10:00 AM'
                        }
                    }
                }
            }
        },
        include: { teacherProfile: { include: { classes: true } } }
    })

    console.log('Profesor actualizado:', teacherUser.email)

    // 2. Crear o Actualizar Estudiantes y Padres
    if (teacherUser.teacherProfile?.classes[0]) {
        const classId = teacherUser.teacherProfile.classes[0].id
        const studentNames = ['Alice', 'Bob', 'Charlie']

        for (const name of studentNames) {
            const parentEmail = `parent_${name.toLowerCase()}@test.com`

            // Primero aseguramos que el usuario padre existe con la password correcta
            const parentUser = await prisma.user.upsert({
                where: { email: parentEmail },
                update: { password: hashedPassword },
                create: {
                    email: parentEmail,
                    password: hashedPassword,
                    name: `Parent of ${name}`,
                    role: 'PARENT',
                    parentProfile: {
                        create: {}
                    }
                },
                include: { parentProfile: true }
            })

            // Luego aseguramos que el estudiante existe vinculado a ese padre
            let student = await prisma.student.findFirst({
                where: { name, parent: { userId: parentUser.id } }
            })

            if (!student) {
                student = await prisma.student.create({
                    data: {
                        name,
                        birthDate: new Date('2010-01-01'),
                        parentId: parentUser.parentProfile!.id,
                        enrollments: {
                            create: { classId }
                        }
                    }
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
