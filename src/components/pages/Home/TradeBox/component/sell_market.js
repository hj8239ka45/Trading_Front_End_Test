import { useState, useEffect } from 'react';
import { fetchPrices } from '../../../../../util/network'
import { store } from '../../../../../redux/store'

const Sellmarket=()=>{
    const [BTC,setBTC] = useState('')
    const [USDT, setUSDT] = useState('')
    function BTCChange(e) {
        setBTC(e.target.value)
    }

    useEffect(() => {
        refreshPriceData();
        const timer = setInterval(refreshPriceData, 2000);
        return () => clearInterval(timer);
    },[])

    const refreshPriceData = () => {
        fetchPrices(store.getState().product).then(response => {
            if (response) setUSDT(response);
        });
    }
    
    return(
        <div>
            <div>
                <input className="input-trade" value = {BTC} onChange={BTCChange}></input>
                <label className="label-trade">BTC</label>
            </div>
            <div>
                <div className='marketprice'>{USDT}</div>
                USDT
            </div>
            <button onClick = {async() => {
                    await fetch("/sell",{
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(BTC)
                })
            }}>下單</button>
            
        </div>
    );
}
export default Sellmarket;