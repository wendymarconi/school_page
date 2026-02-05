
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const parentEmail = 'padre.pedro@email.com'

    await prisma.user.update({
        where: { email: parentEmail },
        data: {
            parentProfile: {
                update: {
                    phone: '300 123 4567',
                    relationship: 'Padre' // Updating relationship as well just in case
                }
            }
        }
    })

    console.log('Phone number updated successfully.')
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
