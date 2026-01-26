
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const parentEmail = 'padre.pedro@email.com'
    const parent = await prisma.user.findUnique({
        where: { email: parentEmail },
        include: { parentProfile: { include: { students: { include: { student: { include: { enrollments: true } } } } } } }
    })

    if (!parent?.parentProfile?.students[0]) {
        console.log('No se encontro el estudiante')
        return
    }

    const student = parent.parentProfile.students[0].student
    const classId = student.enrollments[0]?.classId

    if (!classId) {
        console.log('El estudiante no tiene materias inscritas')
        return
    }

    console.log(`Creando notas para ${student.name} en la clase ${classId}...`)

    const gradesToCheck = [
        { description: 'Examen Parcial', value: 8.5, type: 'Evaluación', date: new Date('2025-03-15') },
        { description: 'Quiz de Álgebra', value: 7.0, type: 'Quiz', date: new Date('2025-03-20') },
        { description: 'Trabajo Grupal', value: 9.2, type: 'Trabajo', date: new Date('2025-04-05') },
        { description: 'Examen Final', value: 6.5, type: 'Evaluación', date: new Date('2025-05-10') },
    ]

    for (const g of gradesToCheck) {
        await prisma.grade.create({
            data: {
                studentId: student.id,
                classId: classId,
                value: g.value,
                description: g.description,
                type: g.type,
                date: g.date,
                period: 1
            }
        })
    }

    console.log('Notas creadas con éxito!')
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
