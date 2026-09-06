import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { depositBalance, getBalance, getBalanceByAsset } from "../controllers/balance.controller.js";


const router: Router = Router();

router.use(authenticate);

router.get("/", getBalance);
router.get("/:symbol", getBalanceByAsset);
router.post("/deposit", depositBalance);

export default router;
