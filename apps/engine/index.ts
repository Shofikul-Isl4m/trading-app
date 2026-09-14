
import redis from "@repo/redis"

const client = redis.duplicate();
await client.connect()

function safeNum(n: any, def = 0) {
    const v = Number(n);
    return Number.isFinite(v) ? v : def;

}

let current_prices: Record<string, number> = {}
let bid_prices: Record<string, number> = {}
let ask_prices: Record<string, number> = {}

async function engine() {

    console.log("trading engine started");
    while (true) {
        const response = await client.xRead({ key: "engine-stream", id: "0" }, { BLOCK: 0 });
        console.log(JSON.stringify(response, null, 2));

        if (!response || !response.length) return;

        const stream = response[0];
        const messages = stream?.messages;
        if (!messages || !messages.length) return;
        for (const entry of messages) {
            const data = JSON.parse(entry.message.data);
            const { kind, payload } = data;
            console.log("kind", kind);
            console.log("payload", payload);

            switch (kind) {
                case "price-update": {
                    const data = payload.data;
                    if (data && data.s) {
                        const s = typeof data.s === "string" ? data.s : "";
                        const rawSymbol = s.endsWith("_USDC") ? s.replace("_USDC", "") : s;
                        const symbol = rawSymbol.toUpperCase();
                        const bid_price = safeNum(data.b, 0);
                        const ask_price = safeNum(data.a, 0);

                        if (bid_price > 0 && ask_price > 0) {
                            const current_price = (bid_price + ask_price) / 2;
                            current_prices[symbol] = current_price;
                            bid_prices[symbol] = bid_price;
                            ask_prices[symbol] = ask_price;
                            console.log(`Enigine price updated ${symbol} =  current price${current_price} (bid ${bid_price}) (ask ${ask_price})`)

                        }



                    }
                }
                case "create-order": {

                }
                case "close-order": {

                }

            }

        }


    }




}
engine().catch(console.error)