import {
    clusterApiUrl,
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
    TransactionBlockhashCtor,
} from "@solana/web3.js";

/**
 * @NOTE How to calculate transaction cost
*/  
(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const payer = Keypair.generate();
    const payee = Keypair.generate();

    const recentBlockHash = await connection.getLatestBlockhash();
    const TransactionBlockhashCtor:  TransactionBlockhashCtor = {
        feePayer: payer.publicKey,
        blockhash: recentBlockHash.blockhash,
        lastValidBlockHeight: recentBlockHash.lastValidBlockHeight
    }
    const transaction = new Transaction(TransactionBlockhashCtor)
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: payee.publicKey,
            lamports: 10
        })
    )  

    const fees = await transaction.getEstimatedFee(connection);
    console.log(`Estimated SOL transfer cost: ${fees} lamports`)

})()