import express from 'express';
import { addTask, csvDownloader, deleteAgent, getAllAgents, getAllMembersForTask, getAllTasks, getAllUsers, loginAdmin, signupAdmin, signupAgent, updateAgent } from '../controllers/adminController.js';
import adminAuth from '../middlewares/adminAuth.js';
import upload from '../middlewares/multer.js';


const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.post('/signup', signupAdmin);
adminRouter.get('/getallusers', getAllUsers);
adminRouter.post('/addtask', upload.single('file'), adminAuth, addTask);
adminRouter.post('/getalltasks', adminAuth, getAllTasks);
adminRouter.post('/downloadcsv', csvDownloader);
adminRouter.post('/getAllMembers', getAllMembersForTask);
adminRouter.post('/signupAgent',adminAuth, signupAgent);
adminRouter.post('/getAllAgents',adminAuth, getAllAgents);
adminRouter.post('/deleteAgent',adminAuth, deleteAgent);
adminRouter.post('/updateAgent',adminAuth, updateAgent);

export default adminRouter;