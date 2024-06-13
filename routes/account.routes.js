import { Router } from "express";
import protectRoute from "../middlewares/authRoutes.middleware.js";
import { balance , transfer} from "../controllers/account.controller.js";
const router = Router();


router.get("/balance",protectRoute, balance);

router.post("/transfer", protectRoute ,transfer);

export default router