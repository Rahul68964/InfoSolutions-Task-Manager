import express from 'express';
import { csvDownloader, getAllTasks, loginUser, signupUser, createSubAgent, getAllSubAgents, deleteSubAgent, updateSubAgent, addTaskToSubAgent } from '../controllers/userController.js';
import authUser from '../middlewares/userAuth.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/signup', signupUser);
userRouter.post('/getAllTasks',authUser,  getAllTasks);
userRouter.post('/downloadcsv', csvDownloader);
userRouter.post('/createSubAgent',authUser, createSubAgent);
userRouter.post('/getAllSubAgents',authUser, getAllSubAgents);
userRouter.post('/deleteSubAgent',authUser, deleteSubAgent);
userRouter.post('/updateSubAgent',authUser, updateSubAgent);
userRouter.post('/addTaskToSubAgent', upload.single('file'), authUser, addTaskToSubAgent);

export default userRouter;