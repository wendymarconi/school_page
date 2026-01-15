import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
})

async function main() {
    const password = await bcrypt.hash('password123', 10)
    const user = await prisma.user.upsert({
        where: { email: 'admin@school.com' },
        update: {},
        create: {
            email: 'admin@school.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
        },
    })
    console.log({ user })
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
