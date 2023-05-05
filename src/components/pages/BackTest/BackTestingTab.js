import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Funds from './components/Funds';
import Exchange from './components/Exchange';


const TestTab = () => {
    return (
        <div>
            <Tabs defaultIndex={0}>
                <TabList>
                    <Tab>回測資金曲線</Tab>
                    <Tab>回測交易列表</Tab>
                </TabList>
                <TabPanel>
                    <Funds />
                </TabPanel>
                <TabPanel>
                    <Exchange />
                </TabPanel>
            </Tabs>
        </div>
    );
}
export default TestTab;