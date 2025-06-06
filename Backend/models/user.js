import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {type:String, required:true},
    email : {type:String, required:true, unique:true},
    password : {type:String, required:true}, 
    phone : {type:String},
    subAgents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subAgent'
        }
        ],
    tasks : [
        {
            taskId : {          
                type: mongoose.Schema.Types.ObjectId,
                ref: 'task'
            },
            csvPart : {type:String},
            
        }

    ]
}, {minimize: false})

const userModel = mongoose.model.user || mongoose.model('user', userSchema);
export default userModel