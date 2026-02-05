// Script para verificar que el campo 'active' existe en ParentProfile
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Verificando campo "active" en ParentProfile...\n')

    // Obtener todos los acudientes
    const parents = await prisma.parentProfile.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })

    console.log(`📊 Total de acudientes: ${parents.length}\n`)

    parents.forEach((parent, index) => {
        const status = parent.active ? '✅ ACTIVO' : '❌ INACTIVO'
        console.log(`${index + 1}. ${parent.user.name} (${parent.user.email})`)
        console.log(`   Estado: ${status}`)
        console.log(`   Teléfono: ${parent.phone || 'No registrado'}`)
        console.log(`   Relación: ${parent.relationship || 'No especificada'}`)
        console.log('')
    })

    // Probar cambiar el estado del primer acudiente
    if (parents.length > 0) {
        const firstParent = parents[0]
        console.log(`\n🔄 Probando cambio de estado para: ${firstParent.user.name}`)
        console.log(`   Estado actual: ${firstParent.active ? 'ACTIVO' : 'INACTIVO'}`)

        const updated = await prisma.parentProfile.update({
            where: { id: firstParent.id },
            data: { active: !firstParent.active }
        })

        console.log(`   Nuevo estado: ${updated.active ? 'ACTIVO' : 'INACTIVO'}`)
        console.log('   ✅ Cambio exitoso!\n')

        // Revertir el cambio
        await prisma.parentProfile.update({
            where: { id: firstParent.id },
            data: { active: firstParent.active }
        })
        console.log('   ↩️  Estado revertido al original\n')
    }

    console.log('✅ Verificación completada!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Error:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
