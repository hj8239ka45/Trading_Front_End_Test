import './TradeList.css'
import  Property from './property';
import  MytradeTable from './myTrade_list';
import { useEffect ,useState} from 'react'
import { fetchTradehist } from '../../../../util/network'

function TradeList() {
  const [tradeData, setTradeData] = useState([]);
  useEffect(() => {
    fetchTradehist().then(response => {
      if (response) setTradeData(response);
    });
}, []);

  return (
    <div className="TradeList">
        <Property />
        <MytradeTable dataSource={tradeData}/>
    </div>
  );
}

export default TradeList;
