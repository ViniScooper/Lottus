import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log('--- Procutos no Banco ---');
  products.forEach(p => {
    console.log(`ID: ${p.id} | Nome: ${p.name} | bgColor: ${p.bgColor}`);
  });
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
