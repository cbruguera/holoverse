# Current Work

_Update this file at the start and end of every session. Commit it with the work._

---

## Phase

Phase I — chain + skeleton (see `docs/Phase1-plan-v0.2.MD`)

## Status

Steps 1–6 complete and committed. All 12 contract tests passing.

## In progress

Nothing — clean state.

## Blocked on

Nothing currently.

## Up next

**Step 7: testnet deploy + smoke test** (Arbitrum Sepolia)

1. Fill in `packages/contracts/.env` (copy `.env.example`):
   - `ARBITRUM_SEPOLIA_RPC_URL`
   - `DEPLOYER_PRIVATE_KEY` (funded with Sepolia ETH)
   - `TREASURY_MANAGER_ADDRESS` (can be deployer for now)
2. `pnpm --filter contracts run deploy -- --network arbitrumSepolia`
3. Verify contracts on Arbiscan Sepolia
4. Smoke test: approve tokens → call `mintUniverse` → confirm 90/10 split on-chain
5. Point Ponder indexer at deployed addresses, confirm event ingestion

After that: Phase II (simulation service stub, wallet auth, API).

## Recent decisions (not yet in a doc)

_(none — all current decisions are captured in `docs/`)_
