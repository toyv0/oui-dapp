import * as dotenv from 'dotenv';

import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'solidity-coverage';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.0',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    arbitrumRinkeby: {
      url: process.env.ARBITRUM_RINKEBY_ALCHEMY_API,
      accounts: [process.env.ARBITRUM_RINKEBY_ACCOUNT_KEY as string],
    },
    mumbai: {
      url: process.env.MUMBAI_ALCHEMY_API,
      accounts: [process.env.MUMBAI_ACCOUNT_KEY as string],
    },
  },
  etherscan: {
    apiKey: process.env.POLYSCAN_KEY,
  },
};

export default config;
