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

  // ---- Treasury ------------------------------------------------------------

  const treasuryAddress = process.env.TREASURY_ADDRESS;
  if (!treasuryAddress) throw new Error('TREASURY_ADDRESS env var is required');

  // ---- UniverseNFT ---------------------------------------------------------

  const energyCost = ethers.parseEther('100');   // TODO: update once ENERGY model is decided
  const usdcFee = 10n * 10n ** 6n;               // 10 USDC
  const baseURI = 'https://metadata.holoverse.xyz/';

  console.log('\nDeploying UniverseNFT...');
  const UniverseNFT = await ethers.getContractFactory('UniverseNFT');
  const universeNFT = await UniverseNFT.deploy(
    usdcAddress,
    treasuryAddress,
    energyCost,
    usdcFee,
    baseURI,
    deployer.address
  );
  await universeNFT.waitForDeployment();
  const universeNFTAddress = await universeNFT.getAddress();
  console.log(`UniverseNFT deployed: ${universeNFTAddress}`);

  // ---- Write deployment record ---------------------------------------------

  const deployments = {
    network: network.name,
    deployer: deployer.address,
    usdc: usdcAddress,
    universeNFT: universeNFTAddress,
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
