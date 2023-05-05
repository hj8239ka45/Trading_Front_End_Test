//https://api.binance.com/api/v3/ticker/price

export default { fetchData, fetchPrices, fetchTrades, fetchTradehist}
// current plot
export async function fetchData(url) {
  return await fetch(url)
    .then((res) => res.json())
    .then((data) => {
        const cdata = data.map((d) => {
            return {
                // time (time-zone +8:00)
                time: (d[0]) / 1000,
                open: parseFloat(d[1]),
                high: parseFloat(d[2]),
                low: parseFloat(d[3]),
                close: parseFloat(d[4])
            };
        });
        const vdata = data.map((d) => {
            return {
                // time (time-zone +8:00)
                time: (d[0]) / 1000,
                value: parseFloat(d[5])
            };
        });
        const adata = data.map((d) => {
            return {
                // time (time-zone +8:00)
                time: (d[0]) / 1000,
                value: parseFloat(d[5])
            };
        });
        return [cdata, vdata, adata];
    })
    .catch((err) => console.info(err));
};
// current price
export async function fetchPrices(product) {
    let url = "https://api.binance.com/api/v3/ticker/price";
    // 如果有限定產品，則獨取此產品資料並回傳
    if (product){
        url = url + `?symbol=${product}`;
        return await fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const pdata = data.price
                const tdata = parseFloat(pdata)
                return tdata;
            })
            .catch((err) => console.info(err));
    }
    return await fetch(url)
        .then((res) => res.json())
        .then((data) => {
            const pdata = data.map((value) => {
                return {
                    symbol: value.symbol,
                    price: parseFloat(value.price)
                };
            });
            return pdata;
        })
        .catch((err) => console.info(err));
};

// https://api.binance.com/api/v3/trades?symbol=BTCUSDT&limit=1
// recent history data(成交價量)
export async function fetchTrades(url) {
    return await fetch(url)
        .then((res) => res.json())
        .then((data) => {
            const tdata = data.map((value) => {
                return {
                    // time: unix timestamp, (time-zone +8:00)
                    time: new Date(value.time).toLocaleTimeString("ch-TW"),
                    price: parseFloat(value.price),
                    qty: parseFloat(value.qty)
                };
            });
            return tdata;
        })
        .catch((err) => console.info(err));
};
// get information of account from back end(python api)
export async function fetchTradehist() {
    return await fetch("/tradehist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then((data) => {
        const tdata = data.map((value) => {
            return {
                // time: unix timestamp, (time-zone +8:00)
                time: new Date(value.time).toLocaleString("ch-TW", { hourCycle: 'h23', }),
                price: parseFloat(value.price),
                qty: parseFloat(value.qty),
                id: value.id,
                isBuyer: (value.isBuyer)?"Buy":"Sell",
                symbol: value.symbol,
                quoteQty: parseFloat(value.quoteQty),
            };
        });
        //console.log(tdata);
        return tdata;
    })
    .catch((err) => console.info(err));
};