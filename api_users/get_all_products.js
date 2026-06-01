import { PrismaClient } from './generated/prisma/index.js';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      collection: true
    }
  });
  console.log(JSON.stringify(products, null, 2));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
