import { useState, useRef, useEffect } from 'react'; // new
import { css } from '@emotion/css';
import { ethers } from 'ethers';

import { contractAddress } from '../config';

import Oui from '../public/abi/Oui.json';

function Transactions() {
  const [amount, setAmount] = useState('');
  const [contractBalance, setContractBalance] = useState('loading...');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
      getContractAmount();
    }, 500);
  }, []);

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

  async function deposit(amount: string) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Oui.abi, signer);
      console.log('contract: ', contract);
      try {
        const deposit = await signer.sendTransaction({
          to: contract.address,
          value: ethers.utils.parseEther(`${amount}`),
        });
        console.log('deposit: ', deposit);
      } catch (error) {
        console.log('Error: ', error);
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
        console.log('withdrawal: ', withdrawal);
      } catch (error) {
        console.log('Error: ', error);
      }
    }
  }

  return (
    <div className={container}>
      {loaded && (
        <>
          <h1 className={balance}>💰 {contractBalance} 💰</h1>
          <div>
            <input
              className={input}
              type="text"
              placeholder="enter amount"
              onChange={(e) => setAmount(e.target.value)}
            ></input>
          </div>
          <button
            className={button}
            type="button"
            onClick={() => deposit(amount)}
          >
            Deposit
          </button>
          <button
            className={button}
            type="button"
            onClick={() => withdrawal(amount)}
          >
            Withdrawal
          </button>
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
