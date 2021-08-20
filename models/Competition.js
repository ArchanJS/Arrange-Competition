const mongoose=require('mongoose');

const competitionSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const Competition=new mongoose.model("competitions",competitionSchema);

module.exports=Competition;