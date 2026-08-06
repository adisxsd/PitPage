const userService = require("../services/user.service.js");

async function register(req, res) {
    const { name, username, email, password } = req.body;
    try {
        const user = await userService.register(name, username, email, password);
        return res.status(201).json({
            success: true,
            message: "Register successful",
            data: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch(error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function login(req, res) {
    const { username, password } = req.body;
    try {
        const result = await userService.login(username, password);
        if (!result) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid username or password' 
            });
        }
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token: result.token,
                user: result.user
            }
        });

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal Server Error' 
        });
    }   
}

module.exports = {
    register,
    login
};