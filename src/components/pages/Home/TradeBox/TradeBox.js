import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import'./TradeBox.css';
import GoodsTab from'./component/goodstab';

const  TradeBox=()=>{
  return(
    <div className='TradeBox'>
      <Tabs defaultIndex={0} onSelect={index=>console.log(index)}>
          <TabList>
              <Tab>現貨買賣</Tab>
              <Tab>合約買賣</Tab>
          </TabList>
          <TabPanel>
              <GoodsTab/>
          </TabPanel>
          <TabPanel>
              <h2>any content2</h2>
          </TabPanel>
      </Tabs>
    </div>
  );
}
export default TradeBox;