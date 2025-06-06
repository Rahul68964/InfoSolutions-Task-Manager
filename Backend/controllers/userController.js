import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import adminModel from '../models/admin.js';
import userModel from '../models/user.js';
import taskModel from '../models/task.js'
import subAgentModel from '../models/subagent.js';
import fs from 'fs/promises';
import path from 'path';

const createtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

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
const signupUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exist = await userModel.findOne({ email })

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

    const newUser = await userModel.create({
      name,
      email,
      phone,
      password: hashedPassword
    })

    const user = await newUser.save();

    const token = createtoken(user._id);

    res.json({ success: true, token })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
};

const getAllTasks = async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const tasks = user.tasks;

    // Fetch all task details in parallel
    const taskArray = await Promise.all(
      tasks.map(async ({ taskId, csvPart }) => {
        const task = await taskModel.findById(taskId);
        if (!task) return null; // or handle missing task gracefully
        return {
          taskDetails: task,
          csvPart: csvPart,
        };
      })
    );

    const filteredTasks = taskArray.filter(t => t !== null);

    return res.json({ success: true, taskArray: filteredTasks });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const csvDownloader = async (req, res) => {
  try {
    const { csvPart } = req.body;

    if (!csvPart) {
      return res.status(400).json({ success: false, message: "CSV content is required" });
    }


    res.setHeader('Content-Disposition', `attachment; filename=your_data.csv`);
    res.setHeader('Content-Type', 'text/csv');

    res.status(200).send(csvPart);

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error downloading CSV" });
  }
};

const createSubAgent = async (req, res) => {
  try {
    const { name, email, password, phone, userId } = req.body;

    const exist = await subAgentModel.findOne({ email });

    const user = await userModel.findById(userId);

   
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

    const newSubAgent = await subAgentModel.create({
      name,
      email,
      phone,
      password: hashedPassword
    });

    user.subAgents.push(newSubAgent._id);
    await user.save();

    const token = createtoken(newSubAgent._id);

    res.json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

const getAllSubAgents = async (req, res) => {
    try {
        const userId = req.body.userId;

        const user = await userModel
            .findById(userId)
            .populate('subAgents');

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const SubAgents = user.subAgents;

        return res.json({ success: true, SubAgents });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

const deleteSubAgent = async (req, res) => {
  try {
    const { agentId, userId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const subAgent = await subAgentModel.findById(agentId);
    if (!subAgent) {
      return res.json({ success: false, message: 'Sub Agent not found' });
    }

    
    user.subAgents = user.subAgents.filter(id => id.toString() !== agentId);
    await user.save();

   
    await subAgentModel.findByIdAndDelete(agentId);

    res.json({ success: true, message: 'Sub Agent deleted successfully' });

  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

const updateSubAgent = async (req, res) => {
  try {
    const { agentId, name, email, phone } = req.body;

    const subAgent = await subAgentModel.findById(agentId);
    if (!subAgent) {
      return res.json({ success: false, message: 'Sub Agent not found' });
    }

    subAgent.name = name || subAgent.name;
    subAgent.email = email || subAgent.email;
    subAgent.phone = phone || subAgent.phone;

    await subAgent.save();

    res.json({ success: true, message: 'Sub Agent updated successfully', subAgent });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  } 
}


const addTaskToSubAgent = async (req, res) => {
  try {
        const { taskName, taskDescription, endDate, userId } = req.body;
        const csvFile = req.file;
        const user = await userModel.findById(userId);
        const assignedUsers = user.subAgents.map(agent => agent.toString());

        
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

        const newtask = await taskModel.create({
            name: taskName,
            description: taskDescription,
            agentId: userId,
            start_date: new Date(),
            end_date: endDate,
            status: 'pending',
            csv_file: csvText,
            subAgentIds: distributedUsers 
        });

        
        user.tasks.push({
            taskId: newtask._id,
            csv_file: csvText
        });
        await user.save();


        for (const user of distributedUsers) {
            const userDoc = await subAgentModel.findById(user.userId);
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
}


export { loginUser, signupUser, csvDownloader, getAllTasks, createSubAgent, getAllSubAgents, deleteSubAgent, updateSubAgent, addTaskToSubAgent};