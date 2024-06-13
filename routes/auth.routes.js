import { Router } from "express";
import { signup , signin, update ,all} from "../controllers/auth.controller.js";
import protectRoute from "../middlewares/authRoutes.middleware.js"


const router = Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.put('/update', protectRoute ,update);

router.get('/all', all )


export default router;