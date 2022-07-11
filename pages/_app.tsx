/* eslint-disable react/no-unescaped-entities */
import '../styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import * as AWS from 'aws-sdk'
import { ConfigurationOptions } from 'aws-sdk'
import { ChakraProvider } from '@chakra-ui/react'

const configuration: ConfigurationOptions = {
  region: 'us-east-2',
  secretAccessKey: 'BuRTbL+KE0kio1YEyjARWgIYIRztO7fIGTXLqvwA',
  accessKeyId: 'AKIAXTNTJLMNHRCW7IE7'
}

AWS.config.update(configuration)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Head>
        <title>Mel's Diner Reservation</title>
        <meta name="Restaurant reservation system" content="For CS490 project" />
        <link rel="icon" href="image/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
