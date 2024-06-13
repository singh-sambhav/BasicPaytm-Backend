import bcrypt from "bcryptjs"
import {z} from "zod";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js"
import Account from "../models/account.model.js"
import JWT_SECRET from "../config.js"


// ZOD OUTPUT
// { success: true; data: "tuna" }
// { success: false; error: ZodError }

const signUpSchema = z.object({
    username : z.string().email().max(30),
    firstName : z.string().max(50),
    lastName:   z.string().max(50),
    password : z.string().min(6)
})

export const signup = async(req,res)=>{
   
    const validation = signUpSchema.safeParse(req.body);

    if(!validation.success){
        return res.status(411).json({
            message : "Incorrect Inputs",
            errors : validation.error.errors,
        })
    }
    
    
    const{username,firstName,lastName,password} = validation.data;
   
    try {

        const existingUser = await User.findOne({username});

        if(existingUser){
            return res.status(411).json({
                message : "User Already Exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);


        const user = await User.create({
            username,
            password : hashedPassword,
            firstName,
            lastName
        })

        const userId =  user._id;

        
        await Account.create({
          userid : userId,
          balance : 1 + Math.random()*10000
        })
     
        
        const token = jwt.sign({
            userId
        },JWT_SECRET)



        res.status(200).json({
            message : "User Creates Successfully",
            token : token
        })
        
    } catch (error) {
        console.log("error at signup")
        return res.status(500).json({
            message : "Error At signup Controller",
            error : error.message,
        })
    }
}

const signInSchema = z.object({
    username : z.string().email().max(30),
    password : z.string(),
})

export const signin = async(req,res) => {
    const validation = signInSchema.safeParse(req.body);

    if(!validation.success){
        return res.status(411).json({
            message : "Incorrect Inputs",
            errors : validation.error.errors,
        })
    }

    const {username , password} = validation.data;

    try {
        const user = await User.findOne({
            username,
        })

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        
        if(!isPasswordCorrect){
            return res.status(400).json({
                errror : "Invalid Password"
            })
        }

        const userId = user?._id;
        if(user){
            const token = jwt.sign({
                userId
            },JWT_SECRET);

            return res.json({
                token,
            })
        }

        res.status(411).json({
            message : "Error while signing in"
        })

    } catch (error) {
        return res.status(500).json({
            message : "Error at signIn controller",
            error : error.message,
        })
    }
   
}

const updateSchema = z.object({
    password : z.string().min(6).optional(),
    firstName : z.string().optional(),
    lastName :  z.string().optional(),
})
export const update = async(req,res) => {

    const validation = updateSchema.safeParse(req.body);

    if(!validation.success){
        res.status(411).json({
            message : "Invalid Input",
            error  : validation.error.errors,
        })
    }
       
       const {password,firstName,lastName} = validation.data;

       const updateData = {};

       if(password){

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            updateData.password = hashedPassword;
       } 

       if(firstName){
            updateData.firstName = firstName
       }

       if(lastName){
        updateData.lastName = lastName
       }



       await User.updateOne({_id : req.userId}, updateData)

       return  res.json({
            message : "Details Updated"
        })

}

export const all = async(req,res) => {

    const filter = req.query.filter || "";
    
    try {
        const users = await User.find({
            $or : [{
                firstName : {
                    "$regex" : filter,
                    "$options": "i"
                }
            },
            {
                lastName : {
                    "$regex" : filter,
                    "$options": "i"
                }     
            }]
        })

        const newUser = users.map(user => ({
            username : user.username,
            firstName : user.firstName,
            lastName : user.lastName,
            _id : user._id,
        }))
        
        return res.status(200).json({newUser})

    } catch (error) {
        
        res.status(400).json({
            error : error.message,
            message : "error at fetch-all controller"
        })
    }
} 