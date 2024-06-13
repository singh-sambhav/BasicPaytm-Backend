import jwt  from "jsonwebtoken";
import JWT_SECRET from '../config.js';

const protectRoute = async (req,res,next) => {
    const token = req.headers.authorization;

    if(!token || !token.startsWith('Bearer ')){
        return res.status(411).json({
            message : "error not starting with Bearer"
        });

    }


    const myArray = token.split(" ");
    const newToken = myArray[1];

    try {
        const decoded = jwt.verify(newToken,JWT_SECRET)

        if(!decoded){
            return res.status(401).json({
                message : "User not authenticated",
            })
        }

        req.userId = decoded.userId;
        next();


    } catch (error) {
        return res.status(401).json({
            error: error.message,
            message : "Error at authMiddleware",
        })
    }

}

export default protectRoute