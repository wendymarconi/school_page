const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const users = await prisma.user.findMany();
    console.log('Usuarios en la DB:', users.map(u => ({ email: u.email, name: u.name, role: u.role })));
    process.exit(0);
}

check();
