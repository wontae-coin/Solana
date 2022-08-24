import {
    clusterApiUrl,
	Connection
} from '@solana/web3.js';


(async () => {
    let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    let slot = await connection.getSlot();
    console.log(slot);
    
    let blockTime = await connection.getBlockTime(slot);
    console.log(blockTime);

    let block = await connection.getBlock(slot);
    console.log(block);

    let slotLeader = await connection.getSlotLeader();
    console.log(slotLeader);
})() 