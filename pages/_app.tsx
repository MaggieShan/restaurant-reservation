import '../styles/globals.css'
import type { AppProps } from 'next/app'
import * as AWS from 'aws-sdk'
import { ConfigurationOptions } from 'aws-sdk'
import { ChakraProvider } from '@chakra-ui/react'

const configuration: ConfigurationOptions = {
  region: 'YOUR_REGION',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  accessKeyId: 'YOUR_ACCESS_KEY_ID'
}

AWS.config.update(configuration)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
