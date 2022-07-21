/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from 'next';
import { Box } from "@chakra-ui/react";
import styles from '../styles/Home.module.css';
import UserTabs from './UserTabs';

const Home: NextPage = () => {
  return (
    <Box>
      <main>
        <h1 className={styles.title}>
          Welcome to Mel's Diner Reservation
        </h1>
        <UserTabs />
      </main>
    </Box>
  );
}

export default Home;
