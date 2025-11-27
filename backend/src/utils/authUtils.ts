import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from './logging';

const SECRET_KEY = process.env.JWT_SECRET || ""; 

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
    return jwt.sign({ id : userId }, SECRET_KEY, { expiresIn: "1h" });
};
