import React, { useEffect } from 'react';
import {store} from '../../../../redux/store'
import { DisplayExchangeAction} from '../../../../redux/action/action'

const Property = () => {
  let total = "15000";
  let profit = "150";//%
  const flag = 1;
  if (total > 100000000)
    total = (parseInt(total) / 10000 / 10000).toFixed(2) + "億"
  else if (total >= 10000)
    total = (parseInt(total) / 10000).toFixed(2) + "萬";

  if (parseInt(profit) >= 100000)
    profit = (parseInt(profit) / 1000000).toFixed(1) + "萬倍";
  else if (profit >= 1000)
    profit = (parseInt(profit) / 100).toFixed(1) + "倍";
  else if (profit < 1000)
    profit = `${profit} %`;
  // 設定買賣點於圖上位置

  // 重啟必先關閉
  useEffect(() => store.dispatch(DisplayExchangeAction(false)), [])
  const onhandleChange = (event) => {
    store.dispatch(DisplayExchangeAction(event.target.checked));
  }

  return (
    <div className='property'>
        <div className='InnerProperty'>總資產：</div>
        <div className='InnerProperty'>{total}</div>
        <div className='InnerPropertyProfit'>今日盈虧:</div>
        <div className='InnerProperty'>{profit}</div>
        <div className="switch-font">顯示買賣點</div>
        <div className="switch">
          <input id="switch-1" type="checkbox" className="switch-input" onChange={onhandleChange}
            />
          <label htmlFor="switch-1" className="switch-label"></label>
        </div>
    </div>
  );
  }
  
  export default Property;
  