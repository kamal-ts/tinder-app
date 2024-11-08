import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ResponseError } from "../error/response-error.js";

const signToken = (id) => {
    // jwt token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
}

const signup = async (req, res, next) => {

    try {
        const { name, email, password, age, gender, genderPreference } = req.body;

        const user = await User.findOne({ email: email });
        if (user) {
            throw new ResponseError(400, 'User already exist!');
        }

        const newUser = await User.create({
            name,
            email,
            password,
            age,
            gender,
            genderPreference
        });

        const token = signToken(newUser._id);
        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in millisecons
            httpOnly: true, // prevents XXS attacks
            sameSite: "strict", // prefents CSRF attacks
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({
            user: newUser
        });

    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ResponseError(400, "All fields are required");
        }
        // find user base on email and password in databse
        const user = await User.findOne({ email }).select("+password");
        // check in is there is user matching 
        if (!user || !(await user.matchPassword(password))) {
            throw new ResponseError(401, "Invalid email or password!")
        }

        const token = signToken(user._id);
        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in millisecons
            httpOnly: true, // prevents XXS attacks
            sameSite: "strict", // prefents CSRF attacks
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({
            user
        });

    } catch (error) {
        next(error);
    }
}

const logout = async (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: "Logged out successfully" });
}

const me = (req, res, next) => {
    try {
        res.status(200).json({
            data: req.user
        });
    } catch (error) {
        next(error);
    }
}   

export default {
    signup,
    login,
    logout,
    me
}