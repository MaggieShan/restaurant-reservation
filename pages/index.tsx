/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import UserTabs from './UserTabs'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Mel's Diner Reservation</title>
        <meta name="Restaurant reservation system" content="For CS490 project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Welcome to Mel's Diner Reservation
        </h1>
        <UserTabs />
      </main>
    </div>
  )
}

export default Home
