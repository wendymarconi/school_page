
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const parentEmail = 'padre.pedro@email.com'
    const parentUser = await prisma.user.findUnique({
        where: { email: parentEmail },
        include: { parentProfile: { include: { students: { include: { student: true } } } } }
    })

    if (!parentUser || !parentUser.parentProfile || parentUser.parentProfile.students.length === 0) {
        console.log('No parent or student found.')
        return
    }

    const studentId = parentUser.parentProfile.students[0].studentId
    console.log(`Checking grades for student: ${parentUser.parentProfile.students[0].student.name} (${studentId})`)

    const grades = await prisma.grade.findMany({
        where: { studentId }
    })

    console.log(`Found ${grades.length} grades.`)
    console.log(grades)
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
