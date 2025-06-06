import {v2 as cloudinary} from "cloudinary"
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import adminModel from '../models/admin.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import userModel from '../models/user.js';
import taskModel from '../models/task.js'

const createtoken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await adminModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createtoken(user._id)
            return res.json({ success: true, token })
        }
        else {
            return res.json({ success: false, message: "Inavalid username or password" });
        }

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
};
const signupAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exist = await adminModel.findOne({ email })

        if (exist) {
            return res.json({ success: false, message: 'User already exist' })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter valid email ' })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: 'Please enter a strong password' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await adminModel.create({
            name,
            email,
            password: hashedPassword
        })

        const user = await newAdmin.save();
        const token = createtoken(user._id);

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.json({ success: true, users })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const addTask = async (req, res) => {
    try {
        const { taskName, taskDescription, endDate, adminId } = req.body;
        const csvFile = req.file;
        console.log(adminId)
        const admin = await adminModel.findById(adminId);
        const assignedUsers = admin.agents.map(agent => agent.toString());

        
        const csvText = await fs.readFile(csvFile.path, 'utf-8');
        const lines = csvText.trim().split('\n');
        const header = lines[0];
        const dataRows = lines.slice(1);

        const totalRows = dataRows.length;
        const numUsers = assignedUsers.length;
        const rowsPerUser = Math.floor(totalRows / numUsers);
        const remainder = totalRows % numUsers;

        const distributedUsers = assignedUsers.map((userId, index) => {
            const startIdx = index * rowsPerUser + Math.min(index, remainder);
            const endIdx = startIdx + rowsPerUser + (index < remainder ? 1 : 0);
            const userRows = dataRows.slice(startIdx, endIdx);
            return {
                userId,
                csv_data: [header, ...userRows].join('\n')
            };
        });


        // let csvUrl = null;
        // if (csvFile) {
        //     const cloudinaryResponse = await cloudinary.uploader.upload(csvFile.path, {resource_type: 'raw'});
        //     csvUrl = cloudinaryResponse.secure_url;
        // }

        const newtask = await taskModel.create({
            name: taskName,
            description: taskDescription,
            admin_id: adminId,
            start_date: new Date(),
            end_date: endDate,
            status: 'pending',
            csv_file: csvText,
            user_ids: distributedUsers 
        });

        
        admin.tasks.push({
            taskId: newtask._id,
            csv_file: csvText
        });
        await admin.save();


        for (const user of distributedUsers) {
            const userDoc = await userModel.findById(user.userId);
            userDoc.tasks.push({
                taskId: newtask._id,
                csvPart: user.csv_data
            });
            await userDoc.save();
        }

        return res.json({ success: true, message: "Task Saved" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

const getAllTasks = async (req, res) => {
    const adminId = req.body.adminId;
    try {
        const allTasks = await taskModel.find({admin_id:adminId});
        return res.json({success:true, allTasks})
    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message})
    }
}

const csvDownloader = async (req, res) => {
    try {
        const { taskId } = req.body;

        const task = await taskModel.findById(taskId);
        if (!task || !task.csv_file) {
            return res.status(404).json({ success: false, message: "Task or CSV data not found" });
        }

        // Set headers for CSV download
        res.setHeader('Content-Disposition', `attachment; filename=task_${taskId}_admin.csv`);
        res.setHeader('Content-Type', 'text/csv');

        // Send CSV content
        res.status(200).send(task.csv_file);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error downloading CSV" });
    }
};

const getAllMembersForTask = async (req, res) => {
  const { taskId } = req.body;
  
  try {
    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.json({ success: false, message: 'Task not found' });
    }


    const allMemberIds = task.user_ids.map(user => user._id);

    const users = await Promise.all(
      allMemberIds.map(userId => userModel.findById(userId))
    );


    const namesOfMembers = users.map(user => user?.name || 'Unknown');


    return res.json({ success: true, namesOfMembers });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Server error' });
  }
};

const signupAgent = async (req, res) => {
    try {
        const { name, email, password, phone, adminId } = req.body;

        const exist = await userModel.findOne({ email });

        console.log("adminId:", adminId); // should log a string like "684282949d33d5c27a9a6d47"
        const admin = await adminModel.findById(adminId); 

        if (!admin) {
            return res.json({ success: false, message: 'Admin not found' });
        }

        if (exist) {
            return res.json({ success: false, message: 'User already exists' });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'Please enter a strong password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            name,
            email,
            phone,
            password: hashedPassword
        });

        admin.agents.push(newUser._id );
        await admin.save();

        const token = createtoken(newUser._id);

        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getAllAgents = async (req, res) => {
    try {
        const adminId = req.body.adminId;

        const admin = await adminModel
            .findById(adminId)
            .populate('agents');

        if (!admin) {
            return res.json({ success: false, message: 'Admin not found' });
        }

        const agents = admin.agents;

        return res.json({ success: true, agents });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};
const deleteAgent = async (req, res) => {
    try {
        const agentId = req.body.agentId;
        const adminId = req.body.adminId;

        const admin = await adminModel.findById(adminId);
        if (!admin) {
            return res.json({ success: false, message: 'Admin not found' });
        }
        const agentIndex = admin.agents.indexOf(agentId);
        if (agentIndex === -1) {
            return res.json({ success: false, message: 'Agent not found' });
        }
        admin.agents.splice(agentIndex, 1);
        await admin.save(); 
        await userModel.findByIdAndDelete(agentId);
        return res.json({ success: true, message: 'Agent deleted successfully' });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};


const updateAgent = async (req, res) => {
  const { agentId, name, email, phone } = req.body;

  try {
    const updated = await userModel.findByIdAndUpdate(agentId, { name, email, phone }, { new: true });
    if (!updated) return res.json({ success: false, message: "Agent not found" });

    res.json({ success: true, message: "Agent updated" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};


export { loginAdmin, signupAdmin, getAllUsers, addTask, getAllTasks, csvDownloader, getAllMembersForTask, signupAgent, getAllAgents, deleteAgent, updateAgent};