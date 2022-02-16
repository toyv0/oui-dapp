import { useState, useRef, useEffect } from 'react'; // new
import { useRouter } from 'next/router';
import { css } from '@emotion/css';
import { ethers } from 'ethers';

import { contractAddress } from '../config';

import Oui from '../artifacts/contracts/Oui.sol/Oui.json';

function Transactions() {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [loaded, setLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 500);
  }, []);

  function onChange(e) {
    setDepositAmount(e.target.value);
    setWithdrawalAmount(e.target.value);
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
          <button
            className={button}
            type="button"
            onClick={() => deposit(depositAmount)}
          >
            Deposit
          </button>
          <button
            className={button}
            type="button"
            onClick={() => withdrawal(withdrawalAmount)}
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
  margin: 0 auto;
`;

const button = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 18px;
  padding: 16px 70px;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

export default Transactions;
