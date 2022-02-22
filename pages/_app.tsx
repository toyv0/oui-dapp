import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { css } from '@emotion/css';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { AccountContext } from '../context';
import 'easymde/dist/easymde.min.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      getUserAccount();
    }, 500);
  }, []);

  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              80001: 'https://rpc-mumbai.matic.today',
            },
          },
        },
      },
    });
    return web3Modal;
  }

  async function connect() {
    try {
      const web3Modal = await getWeb3Modal();
      web3Modal.clearCachedProvider();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      console.log('~ accounts', accounts);
      setAccount(accounts[0]);
    } catch (error) {
      console.log('error', error);
    }
  }

  async function getUserAccount() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length) setAccount(accounts[0]);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }

  return (
    <div>
      <nav className={nav}>
        <div className={header}>
          {!account && (
            <div className={buttonContainer}>
              <button className={buttonStyle} onClick={connect}>
                Connect
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className={container}>
        <AccountContext.Provider value={account}>
          <Component {...pageProps} connect={connect} />
        </AccountContext.Provider>
      </div>
    </div>
  );
}

const accountInfo = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-size: 12px;
  color: #8296b5;
`;

const container = css`
  padding: 40px;
`;

const nav = css`
  background-color: #27344a;
`;

const header = css`
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.075);
  padding: 20px 30px;
`;

const buttonContainer = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const buttonStyle = css`
  background-color: #8296b5;
  outline: none;
  border: none;
  font-size: 18px;
  padding: 16px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

export default MyApp;
