// Script de prueba para crear un profesor y verificar que no hay conflictos
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testCreateTeacher() {
    console.log('🧪 Probando creación de profesor...\n')

    const testEmail = 'test.profesor@coem.edu.co'
    const testName = 'Profesor de Prueba'
    const testPassword = 'Test1234'

    try {
        // Primero, eliminar el profesor de prueba si existe
        const existing = await prisma.user.findUnique({
            where: { email: testEmail },
            include: { teacherProfile: true }
        })

        if (existing) {
            console.log('🗑️  Eliminando profesor de prueba existente...')
            if (existing.teacherProfile) {
                await prisma.teacherProfile.delete({
                    where: { id: existing.teacherProfile.id }
                })
            }
            await prisma.user.delete({
                where: { id: existing.id }
            })
            console.log('✅ Profesor de prueba eliminado\n')
        }

        // Crear nuevo profesor
        console.log('📝 Creando nuevo profesor...')
        console.log(`   Nombre: ${testName}`)
        console.log(`   Email: ${testEmail}`)
        console.log(`   Contraseña: ${testPassword}`)

        const hashedPassword = await bcrypt.hash(testPassword, 10)

        const newTeacher = await prisma.user.create({
            data: {
                name: testName,
                email: testEmail,
                password: hashedPassword,
                role: 'TEACHER',
                teacherProfile: {
                    create: {
                        active: true
                    }
                }
            },
            include: {
                teacherProfile: true
            }
        })

        console.log('\n✅ Profesor creado exitosamente!')
        console.log(`   ID: ${newTeacher.id}`)
        console.log(`   Nombre: ${newTeacher.name}`)
        console.log(`   Email: ${newTeacher.email}`)
        console.log(`   Rol: ${newTeacher.role}`)
        console.log(`   Perfil ID: ${newTeacher.teacherProfile?.id}`)
        console.log(`   Activo: ${newTeacher.teacherProfile?.active}`)

        // Verificar que el admin sigue existiendo
        console.log('\n🔍 Verificando que el admin sigue existiendo...')
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@coem.edu.co' }
        })

        if (admin) {
            console.log('✅ Admin encontrado:')
            console.log(`   ID: ${admin.id}`)
            console.log(`   Email: ${admin.email}`)
            console.log(`   Rol: ${admin.role}`)
        } else {
            console.log('❌ ERROR: Admin no encontrado!')
        }

        console.log('\n✅ Prueba completada exitosamente!')

    } catch (error: any) {
        console.error('❌ Error durante la prueba:', error.message)
        if (error.code) {
            console.error('   Código de error:', error.code)
        }
    }
}

testCreateTeacher()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
