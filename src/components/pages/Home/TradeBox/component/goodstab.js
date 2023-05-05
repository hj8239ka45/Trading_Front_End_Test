import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Buy from './buy';
import Sell from './sell';


const  GoodsTab=()=>{
    return(
      <div>
        <Tabs defaultIndex={0}>
            <TabList className='tablist'>
                <Tab className='tabbuy' selectedClassName='tabbuy--selected' disableclassname='tabbuy--disable'>買入</Tab>
                <Tab className='tabsell' selectedClassName='tabsell--selected' disableclassname='tabsell--disable'>賣出</Tab>
            </TabList>
            <TabPanel>
                <Buy/>
            </TabPanel>
            <TabPanel>
                <Sell/>
            </TabPanel>
        </Tabs>
      </div>
    );
  }
export default GoodsTab;