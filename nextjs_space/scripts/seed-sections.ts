
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding product sections...')

  // Create product sections
  const sections = [
    {
      name: 'Easy Meals Anytime',
      slug: 'easy-meals-anytime',
      title: 'Easy Meals Anytime',
      description: 'Quick and delicious meals ready in minutes',
      displayOrder: 1,
      maxProducts: 10
    },
    {
      name: 'Halal Meals',
      slug: 'halal-meals',
      title: 'Halal Meals',
      description: 'Certified halal meals for your dietary requirements',
      displayOrder: 2,
      maxProducts: 10
    },
    {
      name: 'PASTA Meals',
      slug: 'pasta-meals',
      title: 'PASTA Meals',
      description: 'Authentic pasta dishes from Italy to Cork',
      displayOrder: 3,
      maxProducts: 10
    },
    {
      name: 'Best Offers',
      slug: 'best-offers',
      title: 'Best Offers This Week',
      description: 'Don\'t miss out on these incredible deals',
      displayOrder: 4,
      maxProducts: 10
    },
    {
      name: 'Top Savers',
      slug: 'top-savers',
      title: 'Top Savers Today',
      description: 'Save big on your favorite meals',
      displayOrder: 5,
      maxProducts: 10
    }
  ]

  for (const section of sections) {
    const existing = await prisma.productSection.findUnique({
      where: { slug: section.slug }
    })

    if (!existing) {
      await prisma.productSection.create({
        data: section
      })
      console.log(`Created section: ${section.name}`)
    } else {
      console.log(`Section already exists: ${section.name}`)
    }
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
