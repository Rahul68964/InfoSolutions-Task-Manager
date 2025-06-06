import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    user_ids: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            csv_data: { type: String }
        }
    ],
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },

    subAgentIds: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubAgent' },
        csv_data: String
    }],
    
    description: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: { type: String, required: true },
    csv_file: { type: String, required: true }

}, { minimize: false })

const taskModel = mongoose.model.task || mongoose.model('task', taskSchema);
export default taskModel