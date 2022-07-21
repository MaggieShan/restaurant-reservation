import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Restaurant from './Restaurant'
import User from './User'

export default function UserTabs() {
  return (
    <Tabs>
      <TabList>
        <Tab>Customer</Tab>
        <Tab>Restaurant</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <User />
        </TabPanel>
        <TabPanel>
          <Restaurant />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
