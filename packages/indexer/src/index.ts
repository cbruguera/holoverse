import { ponder } from '@ponder/core';

ponder.on('Universe:UniverseMinted', async ({ event, context }) => {
  await context.db.Universe.create({
    id: event.args.tokenId.toString(),
    data: {
      owner: event.args.owner,
      nrgBurned: event.args.nrgBurned,
      mintedAt: event.block.timestamp,
      txHash: event.transaction.hash,
    },
  });
});

// Index NRG burns: Transfer events where to == address(0)
ponder.on('NrgToken:Transfer', async ({ event, context }) => {
  const ZERO = '0x0000000000000000000000000000000000000000';
  if (event.args.to.toLowerCase() !== ZERO) return;

  const id = `${event.transaction.hash}-${event.log.logIndex}`;
  await context.db.NrgBurn.create({
    id,
    data: {
      from: event.args.from,
      amount: event.args.value,
      burnedAt: event.block.timestamp,
      txHash: event.transaction.hash,
    },
  });
});
