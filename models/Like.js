const mongoose=require('mongoose');

const likeSchema=new mongoose.Schema({
    submission:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Submission'
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const Like=new mongoose.model("likes",likeSchema);

module.exports=Like;