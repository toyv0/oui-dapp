import { useState, useRef, useEffect } from 'react'; // new
import { css } from '@emotion/css';
import { ethers } from 'ethers';

import { contractAddress } from '../config';

import Oui from '../public/abi/Oui.json';
import { getShortAddress } from '../public/helpers/helpers';

function Transactions() {
  const [amount, setAmount] = useState('');
  const [userAccount, setUserAccount] = useState(null);
  const [contractBalance, setContractBalance] = useState('loading...');
  const [userBalance, setUserBalance] = useState('loading...');
  const [loaded, setLoaded] = useState(false);
  let [isDepositing, setDepositing] = useState(false);
  let [isWithdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      setLoaded(true);
      await getUserAccount();
      await getContractAmount();
      await getUserBalance();
    }, 500);
  }, []);

  console.log(userBalance);

  async function getContractAmount() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Oui.abi, signer);
      try {
        const contractBalance = await contract.getContractBalance();
        setContractBalance(ethers.utils.formatEther(contractBalance));
      } catch (error) {
        console.log('error: ', error);
      }
    }
  }

  async function getUserAccount() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length) setUserAccount(getShortAddress(accounts[0]));
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }

  async function getUserBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Oui.abi, signer);
      try {
        const signerAddress = await signer.getAddress();
        setUserAccount(getShortAddress(signerAddress));
        const userBalance = await contract.getAccountBalance(signerAddress);
        setUserBalance(ethers.utils.formatEther(userBalance));
      } catch (error) {
        console.log('error: ', error);
      }
    }
  }

  async function deposit(amount: string) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Oui.abi, signer);
      try {
        const deposit = await signer.sendTransaction({
          to: contract.address,
          value: ethers.utils.parseEther(`${amount}`),
        });

        setDepositing(true);

        await deposit.wait();

        alert(`successful deposit of ${amount}`);
        setDepositing(false);
      } catch (error) {
        console.log('error: ', error);
        alert(`error: ${error?.data?.message ?? error}`);
      }
    }
  }

  async function withdrawal(amount: string) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Oui.abi, signer);
      console.log('contract: ', contract);
      try {
        const withdrawal = await contract.withdrawal(
          ethers.utils.parseEther(`${amount}`),
        );

        setWithdrawing(true);

        await withdrawal.wait();

        alert(`successful withdrawal of ${amount}`);
        setWithdrawing(false);
      } catch (error) {
        console.log('error: ', error);
        alert(`error: ${error?.data?.message ?? error}`);
      }
    }
  }

  return (
    <div className={container}>
      {loaded && (
        <>
          <h1 className={balance}>Vault: 💰 {contractBalance} 💰</h1>
          <div>
            {isDepositing || isWithdrawing ? (
              <div className={pending}>⏳ transaction pending ⌛️</div>
            ) : (
              <input
                className={input}
                type="text"
                placeholder="enter amount"
                onChange={(e) => setAmount(e.target.value)}
              ></input>
            )}
          </div>
          <button
            className={button}
            type="button"
            onClick={async () => await deposit(amount)}
          >
            Deposit
          </button>
          <button
            className={button}
            type="button"
            onClick={async () => await withdrawal(amount)}
          >
            Withdrawal
          </button>
          {userAccount ? (
            <h1 className={balance}>
              {userAccount}: 💰 {userBalance} 💰
            </h1>
          ) : (
            <div>
              <button className={button} type="button" onClick={getUserBalance}>
                get balance
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const container = css`
  width: 800px;
  margin: 25px auto;
  text-align: center;
`;

const pending = css`
  font-weight: 100;
  font-size: 48px;
  text-align: center;
  margin: 25px 0 0 0;
  color: #ba5700;
`;

const button = css`
  background-color: #8296b5;
  outline: none;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  margin-left: 20px;
  margin-top: 50px;
  font-size: 18px;
  padding: 20px 70px;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

const balance = css`
  font-weight: 100;
  font-size: 48px;
  text-align: center;
  margin: 25px 0 0 0;
  color: #8296b5;
`;

const input = css`
  display: block;
  margin: auto;
  margin-top: 75px;
  width: 22%;
  min-width: 150px;
  padding: 10px;
  text-align: center;
  background: rgba(223, 235, 228, 0.8);
  font-size: 20px;
  caret-color: #bf7950;
  border-radius: 15px;
  border: 3px solid #8296b5;
`;

export default Transactions;
