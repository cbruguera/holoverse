import { ethers, network } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying on network: ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);

  const isLocalOrTestnet = network.name === 'localhost' || network.name === 'arbitrumSepolia';

  // ---- USDC ----------------------------------------------------------------

  let usdcAddress: string;

  if (isLocalOrTestnet) {
    console.log('\nDeploying MockUSDC...');
    const MockUSDC = await ethers.getContractFactory('MockUSDC');
    const mockUsdc = await MockUSDC.deploy(deployer.address);
    await mockUsdc.waitForDeployment();
    usdcAddress = await mockUsdc.getAddress();
    console.log(`MockUSDC deployed: ${usdcAddress}`);
  } else {
    // Arbitrum One — native USDC
    usdcAddress = process.env.USDC_ADDRESS ?? '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
    console.log(`\nUsing native USDC: ${usdcAddress}`);
  }

  // ---- NRG ($NRG) -------------------------------------------------------

  console.log('\nDeploying NrgToken ($NRG)...');
  const NrgToken = await ethers.getContractFactory('NrgToken');
  const nrgToken = await NrgToken.deploy(deployer.address, deployer.address);
  await nrgToken.waitForDeployment();
  const nrgTokenAddress = await nrgToken.getAddress();
  console.log(`NrgToken deployed: ${nrgTokenAddress}`);

  // ---- HoloverseTreasury ----------------------------------------------------

  const treasuryManagerAddress = process.env.TREASURY_MANAGER_ADDRESS || deployer.address;
  console.log(`\nDeploying HoloverseTreasury (Manager: ${treasuryManagerAddress})...`);
  const HoloverseTreasury = await ethers.getContractFactory('HoloverseTreasury');
  const holoverseTreasury = await HoloverseTreasury.deploy(treasuryManagerAddress);
  await holoverseTreasury.waitForDeployment();
  const holoverseTreasuryAddress = await holoverseTreasury.getAddress();
  console.log(`HoloverseTreasury deployed: ${holoverseTreasuryAddress}`);

  // ---- Universe ---------------------------------------------------------

  const nrgCost = ethers.parseEther('100');
  const usdcFee = 10n * 10n ** 6n;               // 10 USDC
  const baseURI = 'https://metadata.holoverse.xyz/';

  console.log('\nDeploying Universe...');
  const Universe = await ethers.getContractFactory('Universe');
  const universe = await Universe.deploy(
    usdcAddress,
    nrgTokenAddress,
    holoverseTreasuryAddress,
    nrgCost,
    usdcFee,
    baseURI,
    deployer.address
  );
  await universe.waitForDeployment();
  const universeAddress = await universe.getAddress();
  console.log(`Universe deployed: ${universeAddress}`);

  // ---- Write deployment record ---------------------------------------------

  const deployments = {
    network: network.name,
    deployer: deployer.address,
    usdc: usdcAddress,
    nrg: nrgTokenAddress,
    treasury: holoverseTreasuryAddress,
    universe: universeAddress,
    timestamp: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, '../deployments');
  fs.mkdirSync(deploymentsDir, { recursive: true });
  fs.writeFileSync(
    path.join(deploymentsDir, `${network.name}.json`),
    JSON.stringify(deployments, null, 2)
  );

  console.log(`\nDeployment record written to deployments/${network.name}.json`);
  console.log(JSON.stringify(deployments, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
