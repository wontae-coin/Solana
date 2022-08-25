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
    getOrCreateAssociatedTokenAccount,
    getMint,
    getAccount,
    mintTo
} from "@solana/spl-token";

//TODO SEE spl.solana.com/token
//! Transfer SPL Token from an account to another
(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const payer = Keypair.generate();

    let airdropSigniture = await connection.requestAirdrop(
        payer.publicKey,
        LAMPORTS_PER_SOL
    )
    
    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSigniture
    });
    let payerBalance = await connection.getBalance(payer.publicKey);
    console.log("payer's balance:", payerBalance);

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
    console.log("token mint address:", mint.toBase58());
    console.log("initial balance of the new mint token ,funded by TOKEN PROGRAM:", await connection.getBalance(mint));

    let mintInfo = await getMint(
        connection,
        mint
    )
    console.log(`initial supply:`, mintInfo.supply);
    //* let's mint some
    // first create an associated account to hold the balance of te new mint
    const newlyMintTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        payer.publicKey
    )
    console.log("newly mint token account: ",newlyMintTokenAccount.address.toBase58())
    let tokenAccountInfo = await getAccount(
        connection,
        newlyMintTokenAccount.address
    )
    console.log(tokenAccountInfo.amount)
    //* let's mint100 tokens into the account
    await mintTo(
        connection,
        payer,
        mint,
        newlyMintTokenAccount.address,
        mintAuthority,
        100000000000 // base decimal was 9
    )
    mintInfo = await getMint(
        connection,
        mint
    )

    console.log("now check out the mint supply :", mintInfo.supply);
    tokenAccountInfo = await getAccount(
        connection,
        newlyMintTokenAccount.address
    )
    console.log("token account balance:", mintInfo.supply);
})()