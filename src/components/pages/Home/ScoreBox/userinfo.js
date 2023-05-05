import { useState,useEffect } from 'react';

const Userinfo=()=>{
    
    async function fetchData() {
        return await fetch("/array",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
    .then((inputdata) => {
        //console.log(inputdata);
        return inputdata})
    .catch((err) => console.info(err));
};

    const [info,setInfo]=useState([]);


    useEffect(()=>{
        fetchData().then(response => {
            //console.log(response);
            if (response) setInfo(response);
            //console.log(info); 
          });
      }, []);

    return(
        <div className='userinfo'>
            <div>使用者帳戶</div>
            <div>USDT: {info.USDT}</div>
            <div>BTC: {info.BTC}</div>
        </div>
    );
}

export default Userinfo;