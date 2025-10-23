const { PrismaClient } = require('/home/ubuntu/easymeals_ie/nextjs_space/node_modules/.prisma/client');
const prisma = new PrismaClient();

async function checkPages() {
  try {
    const pages = await prisma.pageContent.findMany();
    console.log('Pages in database:', JSON.stringify(pages, null, 2));
    
    const count = await prisma.pageContent.count();
    console.log('\nTotal pages:', count);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPages();
