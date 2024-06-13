import express from "express"
import cors from 'cors'

import authRoutes from './routes/auth.routes.js'
import accountRoutes from './routes/account.routes.js'

import connectToMongoDB from "./db/connectToMongoDB.js";


const app = express();
app.use(express.json());
app.use(cors());



app.use("/api/v1",authRoutes)
app.use("/api/v1", accountRoutes)

app.listen(3000,()=>{
    connectToMongoDB();
    console.log("Server is live");
})