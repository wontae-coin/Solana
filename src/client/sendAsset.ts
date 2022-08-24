import {
    Connection,
    Keypair,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
    clusterApiUrl
} from "@solana/web3.js";

import { 
    createMint, 
    createTransferInstruction,
    TOKEN_PROGRAM_ID, 
    getOrCreateAssociatedTokenAccount
} from "@solana/spl-token";

//TODO SEE spl.solana.com/token
(async () => {
    const fromKeypair = Keypair.generate();
    
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

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
    let balance = await connection.getBalance(fromKeypair.publicKey);
    console.log(balance);
    
    const toKeypair = Keypair.generate();

    //* Transfer SOL from an account to another
    const lamportsToSend = 1000;
    const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: toKeypair.publicKey,
            lamports: lamportsToSend
        })
    )

    await sendAndConfirmTransaction(
        connection, 
        transferTransaction, 
        [fromKeypair]
    )

    // //! Transfer SPL Token from an account to another
    const payer = Keypair.generate();
    // often times, payer gets to be the mint authority
    const mintAuthority = Keypair.generate();
    const freezeAuthority = Keypair.generate();
   
    const mint = await createMint(
        connection,
        payer,
        mintAuthority.publicKey,
        freezeAuthority.publicKey,
        9, // 9 is to match the CLI decimal default exactly
    );
    console.log(mint.toBase58());
})()