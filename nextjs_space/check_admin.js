const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkAdmin() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })
    
    console.log('\n=== All Users in Database ===')
    if (users.length === 0) {
      console.log('No users found in the database.')
    } else {
      users.forEach(user => {
        console.log(`- Email: ${user.email}`)
        console.log(`  Name: ${user.name || 'N/A'}`)
        console.log(`  Role: ${user.role}`)
        console.log(`  Created: ${user.createdAt}`)
        console.log()
      })
    }
    
    const adminUsers = users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN')
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found. You need to create a super admin account.')
    } else {
      console.log(`✅ Found ${adminUsers.length} admin user(s)`)
    }
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkAdmin()
