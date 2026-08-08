const prisma = require("../config/prisma.js");

async function register(name, username, email, password) {
    const user = await prisma.user.create({
        data: {
            name,
            username,
            email,
            password,
        },
    });
    return user;
}

async function login(username) {
    return await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
};

async function findByUsername(username) {
    return await prisma.user.findUnique({
        where: {
            username,
        },
    });
};

async function findByEmail(email) {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
};


module.exports = {
    register,
    login,
    findByUsername,
    findByEmail,
};


