import { query } from 'express-validator';

export const user = [
    query('name').isString().notEmpty(),
    query('email').isString().notEmpty().isEmail(),
    query('password').isString().notEmpty().isLength({ min: 6 }),
    query('age').isNumeric().notEmpty().isInt({ min: 18 }),
    query('gender').isString().notEmpty().isIn(['male', 'female']),
    query('genderPreference').isString().notEmpty().isIn(['male', 'female', 'both'])
]