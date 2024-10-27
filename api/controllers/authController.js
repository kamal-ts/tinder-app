import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from "express-validator";

const signToken = (id) => {
    // jwt token
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
}

const signup = async (req, res) => {

    try {
        const {name, email, password, age, gender, genderPreference} = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
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
            sameSite: 'strick', // prefents CSRF attacks
            secure: process.env.NODE_ENV === "production", 
        });

        res.status(200).json({
            success: true,
            user: newUser
        });

    } catch (error) {
        console.log('Error in signup controller', error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
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