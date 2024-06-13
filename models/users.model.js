import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        minLength : 3,
        maxLength : 30,
        trim : true,
    },
    password  : {
        type : String,
        required : true,
        minLength : 6
    },
    firstName : {
        type  : String,
        required : true,
        trim : true,
        maxLength : 50
    } ,
    lastName : {
        type: String,
        required : true,
        trim : true,
        maxLength : 50
    }

}, );


const User = model("User", userSchema);

export default User;