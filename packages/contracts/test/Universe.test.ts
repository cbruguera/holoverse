import { expect } from 'chai';
import { ethers } from 'hardhat';
import { MockUSDC, Universe, NrgToken, HoloverseTreasury } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('Universe', () => {
  let usdc: MockUSDC;
  let nrg: NrgToken;
  let universe: Universe;
  let treasury: HoloverseTreasury;
  let owner: SignerWithAddress;
  let treasuryManager: SignerWithAddress;
  let player: SignerWithAddress;

  const USDC_FEE = 10n * 10n ** 6n;   // 10 USDC
  const NRG_COST = ethers.parseEther('100');
  const BASE_URI = 'https://metadata.holoverse.xyz/';

  beforeEach(async () => {
    [owner, treasuryManager, player] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory('MockUSDC');
    usdc = await MockUSDC.deploy(owner.address);

    const NrgToken = await ethers.getContractFactory('NrgToken');
    nrg = await NrgToken.deploy(owner.address, owner.address);

    const HoloverseTreasury = await ethers.getContractFactory('HoloverseTreasury');
    treasury = await HoloverseTreasury.deploy(treasuryManager.address);

    const UniverseFactory = await ethers.getContractFactory('Universe');
    universe = await UniverseFactory.deploy(
      await usdc.getAddress(),
      await nrg.getAddress(),
      await treasury.getAddress(),
      NRG_COST,
      USDC_FEE,
      BASE_URI,
      owner.address
    );

    // Fund player with USDC and NRG and approve
    await usdc.mint(player.address, USDC_FEE * 10n);
    await usdc.connect(player).approve(await universe.getAddress(), USDC_FEE * 10n);
    
    await nrg.mint(player.address, NRG_COST * 10n);
    await nrg.connect(player).approve(await universe.getAddress(), NRG_COST * 10n);
  });

  // ---------------------------------------------------------------------------
  // Happy path
  // ---------------------------------------------------------------------------

  it('mints a universe with 90/10 NRG split and USDC fee to treasury', async () => {
    const treasuryUsdcBefore = await usdc.balanceOf(await treasury.getAddress());
    const treasuryNrgBefore = await nrg.balanceOf(await treasury.getAddress());
    const nrgSupplyBefore = await nrg.totalSupply();

    const burnAmount = (NRG_COST * 90n) / 100n;
    const treasuryAmount = NRG_COST - burnAmount;

    await universe.connect(player).mintUniverse();

    expect(await usdc.balanceOf(await treasury.getAddress())).to.equal(treasuryUsdcBefore + USDC_FEE);
    expect(await nrg.balanceOf(await treasury.getAddress())).to.equal(treasuryNrgBefore + treasuryAmount);
    expect(await nrg.totalSupply()).to.equal(nrgSupplyBefore - burnAmount);
    expect(await universe.ownerOf(0)).to.equal(player.address);
    expect(await universe.universeStage(0)).to.equal(0); // Stage.Cosmic
  });

  it('emits UniverseMinted event with correct burn amount', async () => {
    const burnAmount = (NRG_COST * 90n) / 100n;
    await expect(universe.connect(player).mintUniverse())
      .to.emit(universe, 'UniverseMinted')
      .withArgs(0, player.address, burnAmount);
  });

  // ---------------------------------------------------------------------------
  // Evolution
  // ---------------------------------------------------------------------------

  it('advances universe stage sequentially', async () => {
    await universe.connect(player).mintUniverse();
    expect(await universe.universeStage(0)).to.equal(0); // Cosmic

    await universe.connect(player).advanceStage(0);
    expect(await universe.universeStage(0)).to.equal(1); // Biological

    await universe.connect(player).advanceStage(0);
    expect(await universe.universeStage(0)).to.equal(2); // Social

    await universe.connect(player).advanceStage(0);
    expect(await universe.universeStage(0)).to.equal(3); // Transcendent
  });

  it('reverts when advancing beyond Transcendent', async () => {
    await universe.connect(player).mintUniverse();
    await universe.connect(player).advanceStage(0);
    await universe.connect(player).advanceStage(0);
    await universe.connect(player).advanceStage(0);
    
    await expect(universe.connect(player).advanceStage(0))
      .to.be.revertedWith('Universe: already reached Transcendent stage');
  });

  it('reverts when non-owner tries to advance stage', async () => {
    await universe.connect(player).mintUniverse();
    const other = (await ethers.getSigners())[3];
    await expect(universe.connect(other).advanceStage(0))
      .to.be.revertedWith('Universe: not owner');
  });

  // ---------------------------------------------------------------------------
  // Insufficient balance / allowance
  // ---------------------------------------------------------------------------

  it('reverts if caller has insufficient NRG', async () => {
    const broke = (await ethers.getSigners())[4];
    await usdc.mint(broke.address, USDC_FEE);
    await usdc.connect(broke).approve(await universe.getAddress(), USDC_FEE);
    await nrg.connect(broke).approve(await universe.getAddress(), NRG_COST);
    
    await expect(universe.connect(broke).mintUniverse()).to.be.reverted;
  });

  // ---------------------------------------------------------------------------
  // Treasury Withdrawal
  // ---------------------------------------------------------------------------

  it('treasury manager can withdraw funds', async () => {
    await universe.connect(player).mintUniverse();
    const amount = USDC_FEE;
    const recipient = (await ethers.getSigners())[5];
    
    await treasury.connect(treasuryManager).withdraw(await usdc.getAddress(), recipient.address, amount);
    expect(await usdc.balanceOf(recipient.address)).to.equal(amount);
  });

  it('non-manager cannot withdraw from treasury', async () => {
    await expect(treasury.connect(player).withdraw(await usdc.getAddress(), player.address, 1n))
      .to.be.revertedWithCustomError(treasury, 'OwnableUnauthorizedAccount');
  });
});
