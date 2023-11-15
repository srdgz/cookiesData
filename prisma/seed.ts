import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const cookieData: Prisma.CookiesCreateInput[] = [
  {
    name: "CHOCOLATE NEGRO",
    price: 3,
  },
  {
    name: "CARAMELO Y NUECES",
    price: 4,
  },
  {
    name: "DOBLE CHOCOLATE",
    price: 3,
  },
  {
    name: "CACAHUETE Y CHOCO",
    price: 4,
  },
  {
    name: "TOFFEE Y CHOCO",
    price: 4,
  },
  {
    name: "CHOCO BLANCO Y NUECES",
    price: 3,
  },
  {
    name: "COCO LOVERS",
    price: 4,
  },
  {
    name: "NAVIDEÑAS",
    price: 5,
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const c of cookieData) {
    const cookie = await prisma.cookies.upsert({
      where: { name: c.name },
      create: c,
      update: {},
    });
    console.log(`Upserted cookie with id: ${cookie.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
