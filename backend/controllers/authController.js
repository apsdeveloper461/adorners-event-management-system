const { UserModel } = require('../models/User');
const { createToken, verifyToken } = require('../handlers/jwt'); // Import verifyToken

const signup = async (req, res) => {
    try {
        const { username, email, password, userType } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists with this email');
        }
        const user = new UserModel({ username, email, password, userType });
        await user.save();
        res.status(201).send(`${userType} signup successful`);
    } catch (err) {
        res.status(500).send('Error signing up');
    }
};

const login = async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        const user = await UserModel.findOne({ email, userType });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send('Invalid credentials');
        }
        const token = createToken({ userId: user._id, userType: user.userType });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Error logging in');
    }
};

const authenticate = async (req, res) => {
    try {
        const { token,userType } = req.body; // Get token from request body
        const decoded = verifyToken(token);
        // console.log(decoded);
        
        const user = await UserModel.findById(decoded.userId);
        // console.log(user);
        if (user &&  user.userType === decoded.userType && userType === decoded.userType) {
            return res.status(200).json({success: true, message: 'Authorized'});
        }
      
        return res.status(401).json({success: false, message: 'Unauthorized'});
    } catch (err) {
        res.status(500).json({success: false, message: 'Error authenticating'});
    }
};

module.exports = { signup, login, authenticate };
