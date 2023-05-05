import { useState } from 'react';


const Selllimit=()=>{
    const [BTC,setBTC]=useState('')
    function BTCChange(e) {
        setBTC(e.target.value)
    }
    const [USDT,setUSDT]=useState('')
    function USDTChange(e) {
        setUSDT(e.target.value)
    }
    return(
        <div>

            
            <div>
                <input className="input-trade" value = {BTC} onChange={BTCChange}></input>
                <label className="label-trade">BTC</label>
            </div>
            <div>
                <input className="input-trade" value = {USDT} onChange={USDTChange}></input>
                <label className="label-trade">USDT</label>
            </div>
            <button onClick = {async() => {
                    await fetch("/selllim",{
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify([BTC,USDT])
                })
            }}>下單</button>
        </div>
    );
}
export default Selllimit;