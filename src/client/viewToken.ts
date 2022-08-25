import {
    Connection,
    Keypair,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
    clusterApiUrl,
    PublicKey,
} from "@solana/web3.js";

import { 
    createMint, 
    createTransferInstruction,
    TOKEN_PROGRAM_ID, 
    getOrCreateAssociatedTokenAccount,
    getMint,
    getAccount,
    mintTo,
    AccountLayout
} from "@solana/spl-token";

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const tokenAccounts = await connection.getTokenAccountsByOwner(
        new PublicKey("Fq2PLUzruav37hmZSA7VSt1Er7PD9vV65gyk6MYqgSVV"), 
        {
            programId: TOKEN_PROGRAM_ID
        }
    )
    console.log("TOKEN ACCOUNTS:", tokenAccounts);
    tokenAccounts.value.forEach( tokenAccount => {
        const accountData = AccountLayout.decode(tokenAccount.account.data);
        console.log( `${new PublicKey(accountData.mint)}  ${accountData.amount}`)
    })
})()
