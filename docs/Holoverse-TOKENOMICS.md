# Holoverse — Token economic model (brief)

## Token

**$NRG** is an ERC-20 utility token
: required for universe creation and selected in-game actions; earned through play under a **capped emission** schedule. It may trade on the open market; design assumes volatility.

## Universe mint (creation)

- **Cost split:** Each mint consumes **$NRG + a small fixed stablecoin fee** (e.g. USDC).
  - **$NRG leg:** **90% burned**, **10% sent to the Holoverse treasury** (same transaction).
  - **Stable leg:** Funds the treasury for predictable operations, audits, liquidity, and grants—without diluting the burn narrative.
- **Rationale:** Players get stable UX on the fiat leg; $NRG remains the primary on-chain sink and alignment layer.

## Emissions (play → $NRG)

- **Cap:** A **fixed maximum** $NRG is issuable per **epoch** (e.g. per day or week). Unused cap does **not** roll over unless you explicitly choose otherwise later; v1 assumes **no rollover** for simplicity.
- **Distribution:** The epoch pool is allocated across universes by a **simple, verifiable weight**—e.g. **active player-minutes** (or session count with a minimum session length) attributed per universe. Each universe has a **hard cap** on the share it can claim per epoch so whales cannot dominate the pool.
- **Anti-gaming (v1):** Weights must be tied to **signed-in, rate-limited** activity defined in the game client/server spec; sybil resistance is “good enough for v1,” not perfect.

## Adaptive rule (optional, bounded)

- Global emissions within the cap may **scale down** when recent **burns** are low (and optionally **scale up** toward the cap when burns are high), but **never above the epoch cap**. This dampens procyclicality without promising “emissions = burns.”

## Other sinks (minimal)

- Additional $NRG burns for **clear, optional** actions only (e.g. accelerate evolution, tokenize an export)—each documented with a fixed or bounded formula. Avoid many micro-sinks in v1.

## Universe owner fees

- Owners may charge participation fees in **any asset** they choose. **Optional** convention: encourage a small **$NRG** component so value recycles into the main loop; not a Holoverse requirement.

## Treasury

- Receives: **10% of $NRG** on universe mint (non-burned), **100% of stable mint fee**, and any future explicitly voted fees.
- **No hidden mint** to treasury beyond documented rules.

## Principles

1. One primary fungible token ($NRG).  
2. **Bounded** issuance; **transparent** burns and fees.  
3. **Simple** player-facing rules: mint = burn-heavy $NRG + small stable; play earns from a **capped** pool.

*Version: aligned with Holoverse v0.1 design notes; numbers (90/10, epoch length, caps) are defaults and can be tuned before launch.*
