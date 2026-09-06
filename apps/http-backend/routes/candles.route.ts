import { Router } from "express";
import { getCandles } from "../controllers/candles.controller.js";


const router: Router = Router();

router.get("/", getCandles);

export default router;
