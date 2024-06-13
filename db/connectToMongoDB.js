import mongoose from "mongoose";

const connectToMongoDB = async()=>{
    try {
        await mongoose.connect("mongodb+srv://sambhav962:J01LJ3w2TqOXVJDM@cluster0.rhcm0ud.mongodb.net/")
        console.log("connected to mongoDB")
    } catch (error) {
        console.log("Error connecting to DB", error.message)
    }
}

export default connectToMongoDB;