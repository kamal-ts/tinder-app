import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ResponseError } from "../error/response-error.js";

const signToken = (id) => {
    // jwt token
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
}

const signup = async (req, res, next) => {

    try {
        const {name, email, password, age, gender, genderPreference} = req.body;

        const user = await User.findOne({email: email});
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

        const token = signToken(newUser.id);
        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in millisecons
            httpOnly: true, // prevents XXS attacks
            sameSite: "strict", // prefents CSRF attacks
            secure: process.env.NODE_ENV === "production", 
        });

        res.status(200).json({
            success: true,
            user: newUser
        });

    } catch (error) {
        next(error);
    }
}
const login = async (req, res) => { res.status(200).json({
    success: true
}) }
const logout = async (req, res) => { return "logout" }

export default {
    signup,
    login,
    logout
}