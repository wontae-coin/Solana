import {NATIVE_MINT, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createSyncNativeInstruction, getAccount} from "@solana/spl-token";
import {clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction} from "@solana/web3.js";

// When you want to wrap SOL, you can send SOL to an associated token account on the native mint and call syncNative.
// syncNative updates the amount field on the token account to match the amount of wrapped SOL available. 
// That SOL is only retrievable by closing the token account and choosing the desired address to send the token account's lamports.
(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const wallet = Keypair.generate();
    let airdropSigniture = await connection.requestAirdrop(
        wallet.publicKey,
        2 * LAMPORTS_PER_SOL
    )
    
    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSigniture
    });
    console.log("Native mint:", NATIVE_MINT);
    const associatedTokenAccount = await getAssociatedTokenAddress(
        NATIVE_MINT,
        wallet.publicKey
    )

    //* Create a token account to hold your wrapped SOL
    const ataTranscation = new Transaction().add(
        createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            associatedTokenAccount,
            wallet.publicKey,
            NATIVE_MINT
        )
    )

    await sendAndConfirmTransaction(connection, ataTranscation, [wallet]);

    // Transfer SOL to associated token account and use SyncNAtive to update wrapped SOL balance
    const solTransferTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: associatedTokenAccount,
            lamports: LAMPORTS_PER_SOL
        }),
        createSyncNativeInstruction(
            associatedTokenAccount
        )
    )
        
    await sendAndConfirmTransaction(connection, solTransferTransaction, [wallet]);

    const accountInfo = await getAccount(connection, associatedTokenAccount);
    console.log(`Native: ${accountInfo.isNative}, Lamports: ${accountInfo.amount}`);
})()