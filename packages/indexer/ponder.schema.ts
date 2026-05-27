import { createSchema } from '@ponder/core';

export default createSchema((p) => ({
  Universe: p.createTable({
    id: p.string(),          // tokenId as string
    owner: p.hex(),
    nrgBurned: p.bigint(),
    mintedAt: p.int(),       // block timestamp
    txHash: p.hex(),
  }),

  NrgBurn: p.createTable({
    id: p.string(),          // txHash-logIndex
    from: p.hex(),
    amount: p.bigint(),
    burnedAt: p.int(),
    txHash: p.hex(),
  }),
}));
