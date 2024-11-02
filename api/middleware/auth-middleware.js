import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {

        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                errors: "Unauthorized"
            }).end();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                errors: "Unauthorized"
            }).end();
        }

        const currentUser = await User.findById(decoded.id);

        req.user = currentUser;
        next();
}