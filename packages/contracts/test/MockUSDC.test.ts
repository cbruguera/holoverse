import { expect } from 'chai';
import { ethers } from 'hardhat';
import { MockUSDC } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('MockUSDC', () => {
  let usdc: MockUSDC;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const MockUSDC = await ethers.getContractFactory('MockUSDC');
    usdc = await MockUSDC.deploy(owner.address);
  });

  it('has correct name and symbol', async () => {
    expect(await usdc.name()).to.equal('USD Coin');
    expect(await usdc.symbol()).to.equal('USDC');
  });

  it('has 6 decimals', async () => {
    expect(await usdc.decimals()).to.equal(6);
  });

  it('owner can mint', async () => {
    const amount = 1000n * 10n ** 6n;
    await usdc.mint(user.address, amount);
    expect(await usdc.balanceOf(user.address)).to.equal(amount);
  });

  it('non-owner cannot mint', async () => {
    await expect(usdc.connect(user).mint(user.address, 1000n))
      .to.be.revertedWithCustomError(usdc, 'OwnableUnauthorizedAccount');
  });
});
