import {
    Connection,
    Keypair,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
    clusterApiUrl,
} from "@solana/web3.js";

(async () => {
    const fromKeypair = Keypair.generate();
    const toKeypair = Keypair.generate();

    const connection = new Connection(
        clusterApiUrl("devnet"),
        "confirmed"
    )

    let airdropSigniture = await connection.requestAirdrop(
        fromKeypair.publicKey,
        LAMPORTS_PER_SOL
    )
    
    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSigniture
    });

    const lamportsToSend = 1_000_000;
    const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: toKeypair.publicKey,
            lamports: lamportsToSend
        })
    )

    await sendAndConfirmTransaction(connection, transferTransaction, [
        fromKeypair
    ])
    
})()