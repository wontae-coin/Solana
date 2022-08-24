import { 
    clusterApiUrl,
    Connection,
    Keypair, 
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionBlockhashCtor
} from "@solana/web3.js";
import nacl from "tweetnacl";

(async()=>{
    let payer = Keypair.generate();
    let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
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
    
    let balance = await connection.getBalance(payer.publicKey);
    console.log("base balance:",balance);
    
    let toAccount = Keypair.generate();
    
    let transaction = new Transaction();
    let instruction = SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAccount.publicKey,
        lamports: 1000
    })
    transaction.add(instruction);
    
    //* feePayer is by default the first signer, or payer, if the parameter is not set
    await sendAndConfirmTransaction(connection, transaction, [payer]);
    // console.log("from balance:", await connection.getBalance(payer.publicKey));
    // console.log("to balance:", await connection.getBalance(toAccount.publicKey));
})()

