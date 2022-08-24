import {
	Connection,
	clusterApiUrl,
	Keypair,
	PublicKey,
	Transaction,
	TransactionInstruction,
	sendAndConfirmTransaction,
	LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { findAssociatedTokenAddress } from "./ata";
const store = require('../../../mykey.json');

const key1 = Keypair.fromSecretKey(Uint8Array.from(store));

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

(async function (){
	// 4자리만큼 allocate한 다음에 값을 0으로 채웠다
	const buffer = Buffer.alloc(4, 0);
	// 리트랜디안, 비겐디안, 메모리가 바이트에 저장하는것에 대한 규칙
  	buffer.writeUint32LE(0x44332201);
  	// console.log(buffer);  // 01 22 33 44
	// tx 안에 여러개의 instruction이 들어갈 수 있는데, 그래서 티엑스 한방 쏘면 인스트럭션들이 티엑스들이 여러개가 실행되는 것
	const key1PubKey = key1.publicKey.toString();
	console.log(key1PubKey);
	
	const txi = new TransactionInstruction({
		// tx를 네트워크에 보낼 때에는 아래 3가지 Txinstruction이 필요하다
		keys:[], 
		data: buffer,
		// solana address, 프로그램의 pubkey
		programId: new PublicKey("DPbVsGyPJdkK6PMDJJh519R8r2YTnqw37mLCqE3GCYjb"),
	});
	// feepayer: tx 비용을 내는건데, pubkey로 한다
	const tx = new Transaction().add(txi);
	// 여러 키의 서명이 필요하다하면 저 어레이에 줄줄이 붙이면 된다
	const sig = await sendAndConfirmTransaction(connection, tx, [key1]);
	console.log(sig);

	//* create a test wallet to listen to
	const wallet = Keypair.generate();
	// register a callback to listen to the wallet
	connection.onAccountChange(
		wallet.publicKey,
		(updatedAccountInfo, context) => {console.log("Updated account info: ", updatedAccountInfo)},
		"confirmed"
	)
	const airdropSigniture = await connection.requestAirdrop(
		wallet.publicKey,
		LAMPORTS_PER_SOL
	)

	await connection.confirmTransaction(airdropSigniture);
	console.log("Airdrop completed")
	

	// const myPubKey = new PublicKey("FgVPHSDHWgYEBnKkm4oQSFhmcktU3yBHeLaaYR5gYSPp");
    // const usdcPubkey = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    // const ata = await findAssociatedTokenAddress(
    //     myPubKey,
    //     usdcPubkey
    // )
    // console.log(ata);

})();

// 월렛 연결하는 라이브러리는 키페어를 로컬에서 얻는게 아니라 연결된 팬텀에서 가져올 수 있는 메소드들이 있다. 센드트랜잭션 