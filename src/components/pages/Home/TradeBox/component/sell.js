import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Selllimit from './sell_limit';
import Sellmarket from './sell_market'

const  Sell=()=>{
    return(
      <div>
        <Tabs defaultIndex={1} onSelect={index=>console.log(index)}>
            <TabList className='tablist'>
                <Tab className='tabcurrent' selectedClassName='tabcurrent--selected' disableclassname='tabcurrent--disable'>現價</Tab>
                <Tab className='tabmarket' selectedClassName='tabmarket--selected' disableclassname='tabmarket--disable'>市價</Tab>
            </TabList>
            <TabPanel>
                <Selllimit/>
            </TabPanel>
            <TabPanel>
                <Sellmarket/>
            </TabPanel>
        </Tabs>
      </div>
    );
  }
  export default Sell;