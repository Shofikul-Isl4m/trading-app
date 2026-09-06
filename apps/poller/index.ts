import { WebSocket } from "ws";
import redis from "@repo/redis";

const url = "wss://ws.backpack.exchange";
const ws = new WebSocket(url);

console.log("Starting Price Poller service on port 3003");

redis.on("connect", () => {
    console.log("connected to redis");
});

redis.on("error", (err) => {
    console.log("error connecting to redis", err);
});

ws.on("open", () => {
    const subscribeMessage = {
        method: "SUBSCRIBE",
        params: ["bookTicker.BTC_USDC_PERP",
            "bookTicker.ETH_USDC_PERP",
            "bookTicker.SOL_USDC_PERP",],
        id: 1,
    };
    ws.send(JSON.stringify(subscribeMessage));
    // console.log("sent", subscribeMessage);
});

ws.on("message", async (message) => {
    try {
        const data = JSON.parse(message.toString());
        await redis.xAdd(
            "engine-stream",
            "*",
            { "data": JSON.stringify({ kind: "price-update", payload: data }) }
        );
        // console.log(data);
    } catch (e) {
        console.log(e);
    }
});
