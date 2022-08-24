/**
 * @see: https://solanacookbook.com/references/local-development.html
 */
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
import * as bip39 from "bip39";
import nacl from "tweetnacl";
import { decodeUTF8 } from "tweetnacl-util";


const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const wallet = Keypair.generate();

async function subscribeToWallet () {
	connection.onAccountChange(
		wallet.publicKey,
		(updatedAccountInfo, context) => {
			console.log(`Updated account info`, updatedAccountInfo),
			"confirmed"
		}
	)
};

async function getTestSOL() {
	const airdropSignature = await connection.requestAirdrop(
		wallet.publicKey,
		LAMPORTS_PER_SOL
	);
	await connection.confirmTransaction(airdropSignature);
}


(async() => {
	await subscribeToWallet()
	await getTestSOL()
	//* How to check if a public key has an associated private key
	const key = new PublicKey("5oNDL3swdJJF1g9DzJiZ4ynHXgszjAEpUkxVYejchzrY");
	console.log(PublicKey.isOnCurve(key.toBytes()));

	//* Generate a mnemonic phrase
	// const mnemonic = bip39.generateMnemonic();
	// console.log(`mnemonic`, mnemonic);
	
	//* Restore a keypair from a mnemonic phrase
	const mnemonic = "mnemonic hawk book maid edge rose float basket silk machine wrong door believe";
	const seed = bip39.mnemonicToSeedSync(mnemonic, "");
	const keypair = Keypair.fromSeed(seed.slice(0, 32));
	console.log(keypair.publicKey);

	//* How to sign and verify messages with wallets
	const message = "The quick brown fox jumps over the lazy dog";
	const messageBytes = decodeUTF8(message);
	console.log(messageBytes);
	//* Signing, hence secretkey
	
	/** 
	 * @NACL Put stuff inside, turn the key and it's automagically signed and encrypted. Reverse direction works, too.
	 * @note Signing, hence secretkey
	 */
	const signature = nacl.sign.detached(messageBytes, wallet.secretKey);
	const isSigned = nacl.sign.detached.verify(
		messageBytes,
		signature,
		wallet.publicKey.toBytes()
	)
	console.log("signed result:", isSigned);
	
})()
