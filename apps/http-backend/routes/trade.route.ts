import { Router } from "express";
import { closeOrder, createOrder, getOrderById, getOrders } from "../controllers/trade.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router: Router = Router();

router.use(authenticate);

router.post("/open", createOrder);
router.post("/close/:orderId", closeOrder);
router.get("/orders", getOrders);
router.get("/orders/:orderId", getOrderById);

export default router;
