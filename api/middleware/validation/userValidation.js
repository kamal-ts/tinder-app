import { validationResult, body } from 'express-validator';
import { ValidationError } from '../../error/response-error.js';

export const user = [
    body('name')
        .isString()
        .notEmpty(),
    body('email')
        .isString()
        .notEmpty()
        .isEmail(),
    body('password')
        .isString()
        .notEmpty()
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body('age')
        .isNumeric()
        .notEmpty()
        .isInt({ min: 18 })
        .withMessage("Age must be at least 18 years"),
    body('gender')
        .isString()
        .notEmpty()
        .isIn(['male', 'female']),
    body('genderPreference')
        .isString()
        .notEmpty()
        .isIn(['male', 'female', 'both']),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError(400, errors.array());
            
        }
        next();
    }
]