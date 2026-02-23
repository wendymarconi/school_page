const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const periods = [
        { number: 1, name: 'Primer Periodo', startDate: new Date('2024-01-20'), endDate: new Date('2024-03-31'), active: true },
        { number: 2, name: 'Segundo Periodo', startDate: new Date('2024-04-01'), endDate: new Date('2024-06-15'), active: false },
        { number: 3, name: 'Tercer Periodo', startDate: new Date('2024-07-10'), endDate: new Date('2024-09-20'), active: false },
        { number: 4, name: 'Cuarto Periodo', startDate: new Date('2024-10-01'), endDate: new Date('2024-12-05'), active: false },
    ];

    console.log('Seeding academic periods...');

    for (const period of periods) {
        await prisma.academicPeriod.upsert({
            where: { number: period.number },
            update: {},
            create: period,
        });
    }

    console.log('Academic periods seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
