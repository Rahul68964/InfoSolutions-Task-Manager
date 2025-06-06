import mongoose from "mongoose";

const subAgentSchema = new mongoose.Schema({
    name : {type:String, required:true},
    email : {type:String, required:true, unique:true},
    password : {type:String, required:true}, 
    phone : {type:String},
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

const subAgentModel = mongoose.model.subAgent || mongoose.model('subAgent', subAgentSchema);
export default subAgentModel