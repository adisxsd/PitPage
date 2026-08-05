const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.create({
        data: {
            name: "Adis",
            username: "adis12",
            email: "adis12@example.com",
            password: "adis1234",
            role: "AUTHOR",
        },
    });

    console.log(user);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });