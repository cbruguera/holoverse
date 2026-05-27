# Holoverse — Architecture (components & phasing)

This document describes the system architecture and the major components to implement over the coming months. It aligns with `Holoverse-MAIN_FEATURES-v0.1.MD` (product) and `Holoverse-TOKENOMICS.md` (economy).

## Guiding separation

- **On-chain:** Ownership, value movement, and verifiable policy ($NRG burns, treasury split, stable mint leg, NFT identity).
- **Off-chain authoritative simulation:** Universe state, gameplay rules, anti-abuse, and **emission weighting signals** (e.g. active player-minutes). Start with a clear **off-chain source of truth** for game state; add **checkpoints or commitments** on-chain only where trust minimization is worth the complexity.
- **Client:** Rendering, input, and social surfaces. **Game logic is not entangled with a single renderer** so visuals can evolve (e.g. 2D now, 3D/VR later).

## Smart contract toolchain

**Hardhat** is the default toolchain for compiling, testing, and deploying contracts (TypeScript tests and scripts fit a single JS/TS monorepo with the web app and services). Foundry is a strong alternative for pure-Solidity velocity and fuzzing; staying on Hardhat unless the team later splits contract work into a dedicated Foundry crate.

## Components

| Component | Responsibility |
|-----------|----------------|
| **Contracts (Hardhat)** | Universe NFT mint with $NRG burn + 90/10 treasury split + stable fee path; $NRG ERC-20 integration (existing token or deployment per launch plan); optional claim contract for epoch rewards. |
| **Chain indexing** | Subgraph, Ponder, or equivalent: universes, owners, burns, treasury events—read path for the web app and ops dashboards. |
| **Identity & sessions** | Wallet authentication (e.g. SIWE), linked in-game identity, rate limits on emission-relevant events. |
| **Simulation service** | Authoritative step/tick of universe state; evolution stages; validates actions; persists snapshots and history. |
| **Telemetry / activity ledger** | Durable, queryable log of **verifiable play signals** used for capped epoch allocation and per-universe caps; schema versioned for audits. |
| **Emissions engine** | Computes per-epoch distribution from the ledger under global and per-universe caps; produces **claims** (e.g. merkle roots + proofs) for the claim contract. |
| **API gateway** | HTTP/WebSocket: universe reads, owner settings (visibility, invites, fee config), session coordination. |
| **Web client** | Connect wallet, mint, play shell, owner hub (social/public/private, invites). |
| **Art pipeline** | Deterministic **state → artifact** (e.g. image); versioned generator; metadata and URI updates on mint/state milestones. |
| **Ops** | Multisig treasury, RPC/indexer/API monitoring, CI/CD, staging networks. |

## Phasing (indicative months)

1. **Month 1 — Chain + skeleton:** Hardhat project, core mint + treasury + burn paths, testnet deploy, minimal indexer, monorepo + CI.
2. **Month 2 — Backend core:** Simulation service (minimal cosmic loop), persistence, wallet auth, API to create/read universe; wire successful mint to backend provisioning.
3. **Month 3 — Client MVP:** Web app—wallet, mint, universe dashboard; owner visibility and invite list (stub acceptable).
4. **Month 4 — Economy plumbing:** Telemetry pipeline, emissions engine v1 (capped epochs, per-universe cap), on-chain claims; abuse-oriented load testing.
5. **Month 5 — Product depth:** Generative art v1 on mint/updates; richer cosmic/biological rules; basic multiplayer session hosting.
6. **Month 6+ — Expansion:** Tokenized exports (NFT bridge patterns), owner fee rails, social/technological stage mechanics, external security review before high-traffic mainnet.

## Early technical choices to lock

- **v1 source of truth for world state:** Off-chain store + snapshots; chain carries **identity and economics**, not every tick.
- **Reward delivery:** Prefer **batched merkle claims** for irregular epochs unless streaming claims are explicitly required.
- **Stable leg of mint:** Prefer a single transaction flow (or Permit2) that is easy to audit in Hardhat integration tests.

## Document history

- Initial version: component map and phasing; Hardhat as default contract stack.
