import { expect } from 'chai';
import { ethers } from 'hardhat';
import { MockUSDC, UniverseNFT } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('UniverseNFT', () => {
  let usdc: MockUSDC;
  let nft: UniverseNFT;
  let owner: SignerWithAddress;
  let treasury: SignerWithAddress;
  let minter: SignerWithAddress;

  const USDC_FEE = 10n * 10n ** 6n;   // 10 USDC
  const ENERGY_COST = ethers.parseEther('100'); // stub — not yet enforced
  const BASE_URI = 'https://metadata.holoverse.xyz/';

  beforeEach(async () => {
    [owner, treasury, minter] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory('MockUSDC');
    usdc = await MockUSDC.deploy(owner.address);

    const UniverseNFT = await ethers.getContractFactory('UniverseNFT');
    nft = await UniverseNFT.deploy(
      await usdc.getAddress(),
      treasury.address,
      ENERGY_COST,
      USDC_FEE,
      BASE_URI,
      owner.address
    );

    // Fund minter with USDC and approve
    await usdc.mint(minter.address, USDC_FEE * 10n);
    await usdc.connect(minter).approve(await nft.getAddress(), USDC_FEE * 10n);
  });

  // ---------------------------------------------------------------------------
  // Happy path
  // ---------------------------------------------------------------------------

  it('mints an NFT and transfers USDC fee to treasury', async () => {
    const treasuryBefore = await usdc.balanceOf(treasury.address);
    await nft.connect(minter).mintUniverse();
    expect(await usdc.balanceOf(treasury.address)).to.equal(treasuryBefore + USDC_FEE);
    expect(await nft.ownerOf(0)).to.equal(minter.address);
  });

  it('increments token IDs sequentially', async () => {
    await nft.connect(minter).mintUniverse();
    await nft.connect(minter).mintUniverse();
    expect(await nft.ownerOf(0)).to.equal(minter.address);
    expect(await nft.ownerOf(1)).to.equal(minter.address);
  });

  it('emits UniverseMinted event', async () => {
    await expect(nft.connect(minter).mintUniverse())
      .to.emit(nft, 'UniverseMinted')
      .withArgs(0, minter.address, 0);
  });

  // ---------------------------------------------------------------------------
  // Insufficient balance / allowance
  // ---------------------------------------------------------------------------

  it('reverts if caller has insufficient USDC', async () => {
    const broke = (await ethers.getSigners())[3];
    await usdc.connect(broke).approve(await nft.getAddress(), USDC_FEE);
    await expect(nft.connect(broke).mintUniverse()).to.be.reverted;
  });

  it('reverts if caller has not approved USDC', async () => {
    const noApproval = (await ethers.getSigners())[4];
    await usdc.mint(noApproval.address, USDC_FEE);
    await expect(nft.connect(noApproval).mintUniverse()).to.be.reverted;
  });

  // ---------------------------------------------------------------------------
  // Config
  // ---------------------------------------------------------------------------

  it('owner can update USDC fee', async () => {
    const newFee = 20n * 10n ** 6n;
    await nft.setUsdcFee(newFee);
    expect(await nft.usdcFee()).to.equal(newFee);
  });

  it('owner can update energy cost', async () => {
    const newCost = ethers.parseEther('200');
    await nft.setEnergyCost(newCost);
    expect(await nft.energyCost()).to.equal(newCost);
  });

  it('owner can update treasury', async () => {
    const newTreasury = (await ethers.getSigners())[5];
    await nft.setTreasury(newTreasury.address);
    expect(await nft.treasury()).to.equal(newTreasury.address);
  });

  it('non-owner cannot update config', async () => {
    await expect(nft.connect(minter).setUsdcFee(1n))
      .to.be.revertedWithCustomError(nft, 'OwnableUnauthorizedAccount');
  });

  it('reverts setting treasury to zero address', async () => {
    await expect(nft.setTreasury(ethers.ZeroAddress))
      .to.be.revertedWith('UniverseNFT: zero treasury');
  });

  // ---------------------------------------------------------------------------
  // Metadata
  // ---------------------------------------------------------------------------

  it('returns correct token URI after mint', async () => {
    await nft.connect(minter).mintUniverse();
    expect(await nft.tokenURI(0)).to.equal(`${BASE_URI}0`);
  });
});
