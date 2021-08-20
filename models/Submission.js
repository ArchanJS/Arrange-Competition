const mongoose=require('mongoose');

const submissionSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    competition:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Competition'
    }
})

const Submission=new mongoose.model("submissions",submissionSchema);

module.exports=Submission;