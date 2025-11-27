import { Router,Request,Response } from "express";
import prisma from "../prisma/prisma";
import { hashPassword, comparePassword, generateToken } from '../utils/authUtils';
import logger from "../utils/logging";

const router = Router();

/**
* @route   POST /api/auth/signup
* @desc    Register a new user with email, username and hashed password
* @access  Public
*/
router.post("/signup", async (req : Request,res : Response) => {
    const {email,password,username} = req.body;
    try {
        logger.info(`Signup request received for: ${email}`);
        const user = await prisma.user.findFirst({
            where : {
                email : email
            }
        });

        if(user){
            logger.warn(`Signup failed: User already exists - ${email}`);
            res.status(400).json({ error: 'User already exists' });
        }

        const passwordHash = await hashPassword(password);
        
        const newUser = await prisma.user.create({
            data : {
                email : email,
                hashedPassword : passwordHash,
                username : username
            }
        });
        logger.success(`User registered successfully: ${email}`);
        res.status(201).json({ message: 'User created'});
    }
    catch(err : any){
        logger.error(`Signup failed: ${err.message}`);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
})


/**
 * @route POST /api/login
 * @access PUBLIC
 * @desc login user 
 */
router.post("/login", async (req : Request,res : Response) => {
    try{
        const {email,password} = req.body;
        logger.info(`Signin request received for: ${email}`);
        const user = await prisma.user.findFirst({
            where : {
                email : email
            }
        });

        if (!user) {
            logger.warn(`Signin failed: User not found - ${email}`);
            res.status(400).json({ error: 'User not found' });
            return;
        }

        const isMatch = await comparePassword(password, user.hashedPassword);
        if(!isMatch){
            logger.warn(`Signin failed: Incorrect password - ${email}`);
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user.id);
        logger.success(`User signed in successfully: ${email}`);
        res.status(200).json({"message" : "loggin successfull",token,userId : user.id,email : user.email});
    }
    catch(error : any){
        logger.error(`Signin failed: ${error}`);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
})

export default router;