const express=require('express');
const User=require('../models/User');
const Competition=require('../models/Competition');
const Submission=require('../models/Submission');

const router=express.Router();

router.get('/',(req,res)=>{
    res.status(200).json({message:"Welcomt ot home."});
})

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

router.get('/competition',async(req,res)=>{
    try {
        const competitions=await Competition.aggregate([
            {
              $lookup: {
                from: "submissions",
                localField: "_id",
                foreignField: "competition",
                as: "submission",
              },
            }
            ]);
        await User.populate(competitions,{path:"author"});
        res.status(200).send(competitions);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
})

router.post('/submission',async(req,res)=>{
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

module.exports=router;