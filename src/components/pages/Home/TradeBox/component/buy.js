import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Buylimit from './buy_limit';
import Buymarket from './buy_market'

const  Buy=()=>{
    return(
      <div>
        <Tabs defaultIndex={1} onSelect={index=>console.log(index)}>
            <TabList className='tablist'>
                <Tab className='tabcurrent' selectedClassName='tabcurrent--selected' disableclassname='tabcurrent--disable'>現價</Tab>
                <Tab className='tabmarket' selectedClassName='tabmarket--selected' disableclassname='tabmarket--disable'>市價</Tab>
            </TabList>
            <TabPanel>
                <Buylimit/>
            </TabPanel>
            <TabPanel>
                <Buymarket/>
            </TabPanel>
        </Tabs>
      </div>
    );
  }
  export default Buy;