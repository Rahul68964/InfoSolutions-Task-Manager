import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import adminRouter from './routes/adminRoutes.js';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import connectCloudinary from './config/cloudinary.js';

const app = express();
const port = process.env.PORT || 5000;

connectDB();
app.use(express.json());
app.use(cors());
app.use('/admin', adminRouter)
app.use('/user', userRouter)



app.get('/', (req, res)=>{
    res.send('API Working!')
})

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})