import { 
    clusterApiUrl,
    Connection,
    Keypair, 
    LAMPORTS_PER_SOL,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionBlockhashCtor,
    TransactionInstruction
} from "@solana/web3.js";

(async() => {
    let payer = Keypair.generate();
    let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    let minimumRentForZeroByte = await connection.getMinimumBalanceForRentExemption(0);
    //* Insufficient fund for rent fee 에러는 toAccount도 0이지만 데이터를 가지고 블록체인에 올라가기에
    //* rent가 필요한데 그 렌트도 감당하지 못할 만큼의 너무 적은 돈을 보내버려서 그렇다
    console.log("minimum needed renf fee for 0 byte:", minimumRentForZeroByte);
    
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
        lamports: 1000000
    })
    transaction.add(instruction);
    
    //* feePayer is by default the first signer, or payer, if the parameter is not set
    await sendAndConfirmTransaction(connection, transaction, [payer]);
    console.log("from balance:", await connection.getBalance(payer.publicKey));
    console.log("to balance:", await connection.getBalance(toAccount.publicKey));

    /**
     * @NOTE How to add a memo to a transaction
     */
    transaction.add(
        new TransactionInstruction({
            keys: [{
                pubkey: payer.publicKey,
                isSigner: true,
                isWritable: true
            }],
            data: Buffer.from("Data to send in a trasnaction", 'utf-8'),
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
        })
    )

    await sendAndConfirmTransaction(connection, transaction, [payer])
})()

