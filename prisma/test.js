const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash("1234", 10);

    await prisma.user.update({
        where: {
            username: "admin1",
        },
        data: {
            password: adminPassword
        },
    });



    console.log("Password admin dan author berhasil di-hash.");
}

main()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });