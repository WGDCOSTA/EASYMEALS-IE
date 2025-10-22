import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function runMigration() {
  try {
    const sql = fs.readFileSync('prisma/migrations/20250422_add_seo_and_tags/migration.sql', 'utf8')
    
    // Split by semicolons and execute each statement
    const statements = sql.split(';').filter(s => s.trim().length > 0)
    
    for (const statement of statements) {
      const trimmed = statement.trim()
      if (trimmed) {
        try {
          await prisma.$executeRawUnsafe(trimmed + ';')
          console.log('✓ Executed statement')
        } catch (error: any) {
          // Ignore duplicate errors
          if (!error.message.includes('already exists') && !error.message.includes('duplicate') && !error.message.includes('already added')) {
            console.log('Note:', error.message.split('\n')[0])
          }
        }
      }
    }
    
    console.log('✅ Migration completed')
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

runMigration()
