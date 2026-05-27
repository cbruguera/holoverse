import { createConfig } from '@ponder/core';
import { http } from 'viem';

// ABI fragments for the events we index
const universeAbi = [
  {
    name: 'UniverseMinted',
    type: 'event',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'nrgBurned', type: 'uint256', indexed: false },
    ],
  },
] as const;

const nrgTokenAbi = [
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  },
] as const;

export default createConfig({
  networks: {
    arbitrumSepolia: {
      chainId: 421614,
      transport: http(process.env.ARBITRUM_SEPOLIA_RPC_URL),
    },
  },
  contracts: {
    Universe: {
      network: 'arbitrumSepolia',
      abi: universeAbi,
      // Address populated after deploy — set via env or deployments/<network>.json
      address: (process.env.UNIVERSE_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      startBlock: Number(process.env.UNIVERSE_START_BLOCK ?? 0),
    },
    NrgToken: {
      network: 'arbitrumSepolia',
      abi: nrgTokenAbi,
      // TODO: populate once NrgToken is deployed
      address: (process.env.NRG_TOKEN_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      startBlock: Number(process.env.NRG_TOKEN_START_BLOCK ?? 0),
    },
  },
});
