import { css } from '@emotion/css';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { AccountContext } from '../context';
import Oui from '../artifacts/contracts/Oui.sol/Oui.json';

import { contractAddress, ownerAddress } from '../config';
import Transactions from './transactions';

export default function Home(props) {
  // const { posts } = props;
  const account = useContext(AccountContext);

  const router = useRouter();
  async function navigate() {
    router.push('/');
  }

  return (
    <div>
      <Transactions />
    </div>
  );
}

// export async function getServerSideProps() {
//   let provider;
//   if (process.env.ENVIRONMENT === 'local') {
//     provider = ethers.providers.getDefaultProvider();
//   } else if (process.env.ENVIRONMENT === 'testnet') {
//     provider = new ethers.providers.JsonRpcProvider(
//       'https://rpc-mumbai.matic.today',
//     );
//   } else {
//     provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/');
//   }

//   const contract = new ethers.Contract(contractAddress, Oui.abi, provider);
//   //const data = await contract.getContractBalance();
//   return {
//     props: {
//       posts: JSON.parse(JSON.stringify(data)),
//     },
//   };
// }
