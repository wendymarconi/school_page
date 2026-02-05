
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const parentEmail = 'padre.pedro@email.com'
    const parent = await prisma.user.findUnique({
        where: { email: parentEmail },
        include: { parentProfile: true }
    })

    console.log('Parent Profile Data:', parent?.parentProfile)
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
