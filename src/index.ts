import express from 'express'
import { globalErrorHandler } from './middleware/globalErrorHandler.js';
import { userRouter } from './user/userRoute.js';
import { connectToDatabase } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRouter);
await connectToDatabase();

app.get('/', (_req:any, res:any) => {
  res.send('Hello ADDED CHANGES from TypeScript + Node.js on Render!');
});
 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//Global error handler
app.use(globalErrorHandler);
