import { ethers } from 'hardhat';
import fs from 'fs';

async function main() {
  const Oui = await ethers.getContractFactory('Oui');
  const oui = await Oui.deploy();

  await oui.deployed();
  const owner = await oui.signer.getAddress();

  console.log('contract deployed to:', oui.address);

  fs.writeFileSync(
    './config.ts',
    `
  export const contractAddress = "${oui.address}"
  export const ownerAddress = "${owner}"`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
