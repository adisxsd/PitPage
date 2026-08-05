const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding database...");
    await prisma.category.createMany({
        data: [
            { name: "News",
                slug: "news",
             },
            { name: "Race Report",
                slug: "race-report",
            },
            { name: "Technical",
                slug: "technical",
            },
            { name: "Opinion",
                slug: "opinion",
            },
        ],
        skipDuplicates: true,
    });

    console.log("Categories seeded");

    await prisma.driver.createMany({
        data: [
            {
                name: "Lewis Hamilton",
                team: "Scuderia Ferrari",
                number:"44",
            },
            {
                name: "Charles Leclerc",
                team: "Scuderia Ferrari",
                number: "16",
            },
            {
                name: "Max Verstappen",
                team: "Red Bull Racing",
                number: "1",
            },
        ],
        skipDuplicates: true,
    });

    console.log("Drivers seeded");
    await prisma.user.createMany({
        data: [
            {
                name: "Admin User",
                username: "admin",
                email: "admin@pitpage.com",
                password: "password",
                role: "ADMIN",
            },
            {
                name: "Regular User",
                username: "author",
                email: "author@pitpage.com",
                password: "password",
                role: "AUTHOR",
            },
        ],
        skipDuplicates: true,
    });

    console.log("Users seeded");

    await prisma.article.createMany({
        data: [
            {
                title: "Ferrari Ready for the New Season",
                slug: "ferrari-ready-for-the-new-season",
                content:
                    "Ferrari has shown impressive pace during pre-season testing and is expected to challenge for victories.",
                thumbnail: "ferrari.jpg",
                status: "PUBLISHED",

                authorId: 2,
                categoryId: 1,
                driverId: 2,
            },
        ],
        skipDuplicates: true,
    });

    console.log("Articles seeded");
    console.log("Database seeded successfully!");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });