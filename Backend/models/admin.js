import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    agents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }

    ],
    tasks: [
        {
            taskId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'task'
            },
            csv_file: { type: String, required: true },

        }
    ]
}, { minimize: false })

const adminModel = mongoose.model.admin || mongoose.model('admin', adminSchema);
export default adminModel