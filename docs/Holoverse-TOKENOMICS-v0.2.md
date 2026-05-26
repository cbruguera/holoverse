# Holoverse Tokenomics (v0.2) — Entropy-Balanced Model

This document outlines the refined economic model for Holoverse, addressing the risks of "farm-and-dump" cycles, liquidity black holes, and end-game stagnation identified in v0.1.

## 1. The Core Utility: ENERGY ($NRG)

$NRG is the native utility token of the Holoverse ecosystem. It represents the literal energy required to sustain and grow a universe.

### Key Metrics
*   **Standard:** ERC-20
*   **Primary Role:** Fuel for creation, evolution, and maintenance.
*   **Secondary Role:** Medium of exchange for NPC labor and exported assets.

---

## 2. Supply & Emission: Counter-Cyclical Adaptive Model

To avoid the "Liquidity Black Hole" (where low activity leads to low rewards, further decreasing activity), Holoverse employs a counter-cyclical emission schedule.

### The Epoch Cap
*   $NRG is emitted daily (per Epoch).
*   **Emission Formula:** `Emission = Max(BaseFloor, AdaptiveWeight(RecentBurns))`
*   **Base Floor:** A guaranteed minimum emission to ensure baseline liquidity and reward early adopters or survivors during "market winters."
*   **Adaptive Weight:** As $NRG burns increase, the protocol allows higher emissions (up to a Hard Cap) to support a growing economy without causing hyper-inflation.

### Distribution (Proof of Activity)
Emissions are distributed to Universe Owners and NPCs based on:
1.  **Player Minutes:** Active time spent by the owner and invited players.
2.  **NPC Interaction:** Number of unique interactions within the universe.
3.  **Complexity Score:** A generative metric based on the universe's stage, diversity of species, and technological progress. For Social-Stage universes, this explicitly includes **Internal Economic Velocity** (the volume and frequency of player-to-player commerce).

---

## 3. The Three Sinks (Deflationary Pressure)

### A. Creation (The Big Bang)
*   **Cost:** $NRG + Fixed USDC Fee.
*   **Burn:** 90% of the $NRG used for minting is permanently removed from circulation.
*   **Treasury:** 10% of $NRG and 100% of the USDC fee fund the protocol treasury for development and liquidity.

### B. Evolution (Directed Mutation)
*   **Stage Transitions:** Moving from Cosmic → Biological → Social requires a significant $NRG burn.
*   **Generative Modification:** Players can burn $NRG to "re-roll" certain generative traits or accelerate natural processes.

### C. Maintenance (The Second Law of Thermodynamics)
*   **The Entropy Tax:** Every universe has a decay rate. To maintain a universe's Stage and its earning potential, the owner must "feed" it $NRG.
*   **Failure to Maintain:** If the maintenance burn is missed, the universe regresses. A "Transcendent" universe could fall back to "Social," losing its unique cross-universe abilities and reducing its complexity score.

---

## 4. The Labor Market: NPC Economy

Players who do not own a Universe NFT can still participate and earn $NRG.

*   **Incarnation:** Players join a universe as an NPC.
*   **Labor for Rewards:** NPCs perform actions that increase the universe's Complexity Score.
*   **Revenue Sharing:** A smart-contract-enforced split between the Universe Owner and NPCs.
    *   *Example:* Owner sets a 30% NPC split. 30% of all $NRG earned by the universe from the Epoch Cap is streamed to active NPCs based on their contribution.
*   **Protocol Tax:** 5% of all owner-to-NPC transfers is burned.

---

## 5. Macro-Economic Arbitrage & Governance

By using $NRG as a universal "Reserve Currency" across thousands of independent sub-economies, Holoverse creates a unified Common Market.

### A. Inter-Universal Trade
Since all universes use $NRG, resources can be priced according to efficiency. Players can buy items in "Technological" universes and sell them in "Biological" universes where they are rare, creating a cross-universe arbitrage layer.

### B. Competitive Governance
Universe Owners compete for "citizens" (NPCs and Business Owners). If one owner sets excessive taxes or fees, players can move their businesses to a more favorable universe. This forces owners to act as service providers, offering better infrastructure and "Local Laws" to maintain their Complexity Score.

### C. Shared Value, Local Logic
While the underlying value ($NRG) is global, the "Economic Identity" of each universe is local. A universe can be a socialist commune or a hyper-capitalist trade hub; the global $NRG economy remains stable regardless of local ideological choices.

---

## 6. Economic Flywheel Summary

1.  **New Players** mint universes (Burn $NRG).
2.  **Active Play** earns $NRG from the Epoch Cap.
3.  **Advanced Users** evolve universes (Burn $NRG) to earn a larger share of the Cap.
4.  **Idle Owners** must pay Maintenance (Burn $NRG) or lose their progress.
5.  **NPC Players** provide the labor required to keep high-level universes complex, earning $NRG without the capital requirement of a mint.

---

## 7. Open Decisions for v0.3
*   Exact values for the **Base Floor** vs. **Hard Cap**.
*   The slope of the **Maintenance Burn** (does it scale linearly or exponentially with stage?).
*   Specific "Proof of Activity" weights to prevent sybil/botting.
