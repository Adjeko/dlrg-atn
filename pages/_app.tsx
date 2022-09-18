import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Client, Account } from 'appwrite';
import { useDLRGStore } from '../src/useDLRGStore'

function MyApp({ Component, pageProps }: AppProps) {

  //global init

  //init appwrite
  const client = new Client();
  client
    .setEndpoint('https://dlrgbase.adjeko.de/v1') // Your API Endpoint
    .setProject('631647caed6fad5f68cb'); // Your project ID
  const account = new Account(client);

  const setAppwriteClient = useDLRGStore((state) => state.setAppwriteClient);
  setAppwriteClient(client);
  const setAppwriteAccount = useDLRGStore((state) => state.setAppwriteAccount);
  setAppwriteAccount(account);

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
export default MyApp
