# Holoverse 🌀

Web3 game where players mint and evolve unique universes as NFTs, providing a unique experience that keeps evolving forever.

Create new universes, witness the emergence of cosmic laws, the formation of galaxies, the evolution of species, the birth of economies and technological progress and the boundless expansion of an all-encompassing multi-player metaverse.

## Architecture

| Layer         | Role                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------- |
| **On-chain**  | Ownership, value movement, verifiable policy (ENERGY burns, treasury split, NFT identity) |
| **Off-chain** | Authoritative game simulation, universe state, emission weighting, anti-abuse             |
| **Client**    | Rendering, input, social surfaces — decoupled from a single renderer                      |

## Monorepo structure

```
packages/
  contracts/   — Hardhat project (Solidity, ERC-721/ERC-20)
  indexer/     — Ponder indexer (on-chain events → read API)
apps/
  web/         — Web client (wallet, mint, universe dashboard)
services/
  api/         — API gateway (universe reads, session coordination)
```

## Tech stack

- **Chain:** Arbitrum One (testnet: Arbitrum Sepolia)
- **Contracts:** Hardhat + TypeScript, OpenZeppelin v5
- **Indexer:** Ponder
- **Package manager:** pnpm workspaces

## Getting started

```bash
pnpm install
pnpm lint
pnpm -r build
pnpm -r test
```

## Documentation

- [`docs/Holoverse-MAIN_FEATURES-v0.1.MD`](docs/Holoverse-MAIN_FEATURES-v0.1.MD) — product and game design
- [`docs/Holoverse-ARCHITECTURE.md`](docs/Holoverse-ARCHITECTURE.md) — system components and phasing
- [`docs/Holoverse-TOKENOMICS.md`](docs/Holoverse-TOKENOMICS.md) — token economic model
- [`docs/Phase1-plan-v0.2.MD`](docs/Phase1-plan-v0.2.MD) — current execution plan
- [`docs/OPEN-DECISIONS.md`](docs/OPEN-DECISIONS.md) — decisions pending resolution
