import Account from "../models/account.model.js"
import mongoose, { startSession} from "mongoose";
import {z} from "zod";

export const balance = async (req,res) => {

    try {
        const account = await Account.findOne({
            userid : req.userId,
        })

        res.status(200).json({
            balance : account.balance
        })

    } catch (error) {
        
        res.status(411).json({
            error : error.message,
            message : "Error at balance controller",
        })
    }

}

const transferSchema = z.object({
    to : z.string(),
    amount : z.string()
})

export const transfer = async(req,res) => {

    const validation = transferSchema.safeParse(req.body);

    if(!validation.success){
        res.status(411).json({
            msg : "Invalid Input",
            error : validation.error.errors 
        })
    }

    const session = await startSession();
    try {
        
        session.startTransaction();
        const {amount,to} = req.body;
        // fetching account involved in the transaction.
        const account = await Account.findOne({
            userid : req.userId,
        }).session(session);

       
        

        if(!account || account.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({
                message : "Insufficient Balance",
            })
        }

        const toAccount = await Account.findOne({
            userid : to
        }).session(session);


        if(!toAccount){
            await session.abortTransaction();
            return res.status(400).json({
                message : "Invalid Account",
            })
        }

        // performing the transfer;
        await Account.updateOne(
            {
            userid : req.userId
            },
            {
                $inc : {balance : -amount}
            }
        ).session(session);

        await Account.updateOne(
            {
                userid : to
            },
            {
                $inc : {balance : amount}
            }
        ).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message : "Transfer successful"
        })

    } catch (error) {
        
        await session.abortTransaction();
        session.endSession();
        res.status(411).json({
            message: "Error at transfer controller",
            error : error.message,
        })
    }
    

}