# Holoverse — Phase I Execution Plan

## Goal
Stand up the monorepo, core smart contracts, minimal indexer, and CI. Deliver a testnet deploy with a verified end-to-end mint flow.

---

## Step 1: Monorepo scaffold

- `pnpm` workspaces with packages:
  - `packages/contracts` — Hardhat project (Solidity)
  - `packages/indexer` — Ponder indexer (stub)
  - `apps/web` — web client (stub)
  - `services/api` — API gateway (stub)
- Root-level TypeScript, ESLint, Prettier config
- `.gitignore` for the entire project
- `.github/workflows/ci.yml`: compile + test + lint on every PR

---

## Step 2: Hardhat project (`packages/contracts`)

- TypeScript config
- Dependencies: `@openzeppelin/contracts` v5, `hardhat`, `ethers`, `dotenv`
- Network configs: localhost, Arbitrum Sepolia
- Folder layout: `contracts/`, `test/`, `scripts/`, `deployments/`

---

## Step 3: `EnergyToken.sol` (ERC-20)

- Burnable + mintable with a `MINTER_ROLE` (only the future emissions engine gets this)
- Unit tests: mint, burn, access control

---

## Step 4: `UniverseNFT.sol` (ERC-721)

- `mintUniverse()` accepts ENERGY + USDC (requires prior approval from caller):
  - ENERGY: 90% burned via `burn()`, 10% transferred to treasury address
  - USDC: fully transferred to treasury address
- Mint costs (ENERGY amount + USDC fee) are configurable — set as constructor arguments, updatable by owner
- Stub `baseURI` in constructor; art pipeline wires real URIs in Phase V
- Emits `UniverseMinted(tokenId, owner, energyBurned)` event
- Unit tests: happy path, insufficient balance, treasury split correctness, cost config, event emission

---

## Step 5: Deploy scripts + environment config

- `scripts/deploy.ts`: deploys `EnergyToken` and `UniverseNFT`, grants `MINTER_ROLE`, writes deployed addresses to `deployments/<network>.json`
- All config (RPC URL, deployer key, USDC address) driven by env vars — no hardcoded values
- Native USDC (`0xaf88d065e77c8cC2239327C5EDb3A432268e5831`) on Arbitrum One mainnet
- Mock USDC contract (`MockUSDC.sol`) for localhost and Arbitrum Sepolia

---

## Step 6: Minimal indexer (`packages/indexer`)

- **Ponder** (TypeScript, no hosted service required — faster iteration than The Graph)
- Index:
  - `UniverseMinted` events
  - ENERGY `Transfer` events where `to == address(0)` (burns)
  - Treasury inflow events
- Expose a simple read API (universe list, burn totals) for the web client to consume later

---

## Step 7: Testnet deploy + smoke test

- Deploy to Arbitrum Sepolia
- Verify contracts on Arbiscan
- Manual end-to-end smoke test: approve tokens → call `mintUniverse` → confirm 90/10 split on-chain → confirm indexer picks up events

---

## Key early decisions this phase forces

| Decision | Recommendation |
|---|---|
| Treasury address | Gnosis Safe multisig — establish the pattern on testnet, not just an EOA |
| USDC address | Native USDC on Arbitrum One; `MockUSDC.sol` for localhost and Arbitrum Sepolia |
| ENERGY token access control | `MINTER_ROLE` held by a deployer EOA in Phase I; transferred to emissions engine in Phase IV |

---

## Verification checklist

- [ ] `pnpm install` succeeds from repo root
- [ ] `pnpm --filter contracts compile` succeeds with no errors
- [ ] `pnpm --filter contracts test` passes all contract tests
- [ ] `pnpm --filter indexer dev` starts without errors against a local Hardhat node
- [ ] CI passes on a test PR (lint + compile + test)
- [ ] Arbitrum Sepolia deploy succeeds; contracts visible and verified on Arbiscan
- [ ] `mintUniverse` smoke test confirms 90/10 split and indexer event ingestion

