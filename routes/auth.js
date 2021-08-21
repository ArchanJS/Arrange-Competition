const express=require('express');
const User=require('../models/User');
const Competition=require('../models/Competition');
const Submission=require('../models/Submission');
const Like=require('../models/Like');

const router=express.Router();

router.get('/',(req,res)=>{
    res.status(200).json({message:"Welcomt ot home."});
})

//User's registration

router.post('/register',async(req,res)=>{
    try {
        const {name,email}=req.body;
        if(name.trim()=="" || email.trim()=="") res.status(400).json({error:"Don't leave any field empty!"});
        const user=new User({name,email});
        await user.save();
        res.status(201).json({message:"User created successfully!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
})

//Create competition

router.post('/createcompetition',async(req,res)=>{
    try {
        const {name,description,author}=req.body;
        const competition=new Competition({name,description,author});
        await competition.save();
        res.status(201).json({message:"Competition created!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
})

//Image submission

router.post('/submit',async(req,res)=>{
    try {
        const {image,author,competition}=req.body;
        const submission=new Submission({image,author,competition});
        await submission.save();
        res.status(201).json({message:"Image submitted successfully!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
})

//Like image

router.post('/like',async(req,res)=>{
    try {
        const {submission,author}=req.body;
        const checkLike=await Like.findOne({submission,author});
        if(checkLike) res.status(400).json({error:"Author has already liked that submission!"});
        else{
            const like=new Like({submission,author});
            await like.save();
            res.status(200).json({message:"Submission liked!"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
})

//Get competitions

router.get('/competitions',async(req,res)=>{
    try {
        const competitions=await Competition.aggregate([
            {
              $lookup: {
                from: "submissions",
                let: { id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$$id", "$competition"] }
                            }
                        },
                        { $count: "count" }
                    ],
                    as: "submissions"
                }
            },
            {
                $addFields: {
                    "submissions": { $sum: "$submissions.count" }
                }
            }
            ]);
        await User.populate(competitions,{path:"author"});
        res.status(200).send(competitions);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
})

//Get submissions for a particular competition

router.get('/competition/:id/submissions',async(req,res)=>{
    try {
        let submissions=await Submission.aggregate([
            {
              $lookup: {
                from: "likes",
                let: { id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$$id", "$submission"] },
                            }
                        },
                        { $count: "count" }
                    ],
                    as: "likes"
                }
            },
            {
                $addFields: {
                    "likes": { $sum: "$likes.count" }
                }
            }
            ]);
            submissions=await submissions.filter(val=>val.competition==req.params.id);
        await User.populate(submissions,{path:"author"});
        res.status(200).send(submissions);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
})

module.exports=router;