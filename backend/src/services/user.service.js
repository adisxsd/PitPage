const userRepository = require("../repositories/user.repository.js");

async function register(name, username, email, password) {
    const user = await userRepository.register(name, username, email, password);
    return user;
};

async function login(username, password) {
    const user = await userRepository.login(username, password);
    if (!user) {
        return null;
    };

    if (user.password !== password) {
        return null;
    };
    return user;
};

module.exports = {
    register,
    login,
};