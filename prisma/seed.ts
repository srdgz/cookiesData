import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const cookieData: Prisma.CookieCreateInput[] = [
  {
    id: 1,
    name: "CHOCOLATE NEGRO",
    price: 3,
  },
  {
    id: 2,
    name: "CARAMELO Y NUECES",
    price: 4,
  },
  {
    id: 3,
    name: "DOBLE CHOCOLATE",
    price: 3,
  },
  {
    id: 4,
    name: "CACAHUETE Y CHOCO",
    price: 4,
  },
  {
    id: 5,
    name: "TOFFEE Y CHOCO",
    price: 4,
  },
  {
    id: 6,
    name: "CHOCO BLANCO Y NUECES",
    price: 3,
  },
  {
    id: 7,
    name: "COCO LOVERS",
    price: 4,
  },
  {
    id: 8,
    name: "NAVIDEÑAS",
    price: 5,
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const c of cookieData) {
    // create cookie if not exists
    const cookie = await prisma.Cookies.upsert({
      where: { id: c.id },
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
