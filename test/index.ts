import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Oui', function () {
  it('Should make a deposit and update the user and contract balance', async function () {
    const Oui = await ethers.getContractFactory('Oui');
    const oui = await Oui.deploy();
    await oui.deployed();

    const [owner] = await ethers.getSigners();

    await owner.sendTransaction({
      to: oui.address,
      value: ethers.utils.parseEther('1.0'),
    });

    const ownerBalance = await oui.getAccountBalance(owner.address);
    const contractBalance = await oui.getContractBalance();

    expect(ownerBalance).to.equal('1000000000000000000');
    expect(contractBalance).to.equal('1000000000000000000');
  });

  it('Should make a withdrawal and update the user and contract balance', async function () {
    const Oui = await ethers.getContractFactory('Oui');
    const oui = await Oui.deploy();
    await oui.deployed();

    const [owner] = await ethers.getSigners();

    await owner.sendTransaction({
      to: oui.address,
      value: ethers.utils.parseEther('1.0'),
    });

    await oui.withdrawal('1000000000000000000');
    const ownerBalance = await oui.getAccountBalance(owner.address);
    const contractBalance = await oui.getContractBalance();

    expect(ownerBalance).to.equal('0');
    expect(contractBalance).to.equal('0');
  });

  // TODO add tests around modifiers
});
