const userRepository = require("../repositories/user.repository.js");
const bcrypt = require("bcrypt");

async function register(name, username, email, password) {

    const usernameExist = await userRepository.findByUsername(username);

    if (usernameExist) {
        throw new Error("Username already exists");
    }

    const emailExist = await userRepository.findByEmail(email);

    if (emailExist) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await userRepository.register(
        name,
        username,
        email,
        hashedPassword
    );
};

async function login(username, password) {

    const user = await userRepository.login(username);

    if (!user) {
        return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return null;
    }

    return user;
};

module.exports = {
    register,
    login,
};