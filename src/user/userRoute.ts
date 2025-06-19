import  express  from 'express';
import { createUser, loginUser } from './userController.js';



export const userRouter = express.Router();
 
userRouter.post('/register', createUser);
userRouter.post('/login', loginUser);

userRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'User route is working' });
});