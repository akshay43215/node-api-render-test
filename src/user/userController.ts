import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.js"; 
import { User } from "./userTypes.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { config } from "../config/config.js";

//create user -----------
export const createUser = async(req:Request, res:Response, next:NextFunction)=> {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        return next(createHttpError(400, "Name, email and password are required"));
        
    }
    try {
        const user = await userModel.findOne({ email });
        if(user) {
            const error = createHttpError(409, "User already exists");
            return next(error);
        }
    } catch (error) {
        console.error("Error creating user:", error);
        return next(createHttpError(500, "Internal Server Error"));
    }
    //hashing
    const hashPass = await bcrypt.hash(password, 10);
    let newUser:User;
    try {
        newUser = await userModel.create({ name, email, password: hashPass });
    } catch (error) {
        console.error("Error saving user:", error);
        return next(createHttpError(500, "Internal Server Error"));
    }
    //token-generation
    const token = jwt.sign({ sub: newUser._id }, config.jwtSecret as string, { expiresIn: '1h', algorithm: 'HS256' });
}

//login user -----------
export const loginUser = async(req:Request, res:Response, next:NextFunction)=> {
    const {email, password} = req.body;
    
    if(!email || !password) {
        return next(createHttpError(400, "Both fields are required"));
    }
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return next(createHttpError(404, "User not found"));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return next(createHttpError(401, "Invalid credentials"));
        }
        const token = jwt.sign({ sub: user._id }, config.jwtSecret as string, { expiresIn: '1h', algorithm: 'HS256' });
        
        res.cookie('access-Token', token, {
            httpOnly: true,
            secure: true, // Use only over HTTPS
            sameSite: 'strict', // Prevent cross-site requests
            // maxAge: 3600000, // Optional: Set expiration
        }).send('Cookie set');

    } catch (error) {
        console.error("Error logging in user:", error);
        return next(createHttpError(500, "Server Error while logIn user"));
    }
}