import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Developer from './Developer'
import Restaurant from './Restaurant'
import User from './User'

export default function UserTabs() {
  return (
    <Tabs>
      <TabList>
        <Tab>Customer</Tab>
        <Tab>Restaurant</Tab>
        <Tab>Developer</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <User />
        </TabPanel>
        <TabPanel>
          <Restaurant />
        </TabPanel>
        <TabPanel>
          <Developer />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
