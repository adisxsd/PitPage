const userService = require("../services/user.service.js");

async function register(req, res) {
    const { name, username, email, password } = req.body;
    try {
        const user = await userService.register(name, username, email, password);
        res.status(201).json(user);
    } catch(error){
    return res.status(400).json({
        success:false,
        message:error.message,
    });
}
};
async function login(req, res) {
    const { username, password } = req.body;
    try {
        const result = await userService.login(username, password);
        if (!result) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }   
};

module.exports = {
    register,
    login
};