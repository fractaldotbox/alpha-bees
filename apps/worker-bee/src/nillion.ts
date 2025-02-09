import { SecretVaultWrapper } from "nillion-sv-wrappers";

export const config = {
	orgCredentials: {
		secretKey: process.env.NILLION_SECRET_KEY,
		orgDid: process.env.NILLION_ORG_DID,
	},
	nodes: [
		{
			url: "https://nildb-zy8u.nillion.network",
			did: "did:nil:testnet:nillion1fnhettvcrsfu8zkd5zms4d820l0ct226c3zy8u",
		},
		{
			url: "https://nildb-rl5g.nillion.network",
			did: "did:nil:testnet:nillion14x47xx85de0rg9dqunsdxg8jh82nvkax3jrl5g",
		},
		{
			url: "https://nildb-lpjp.nillion.network",
			did: "did:nil:testnet:nillion167pglv9k7m4gj05rwj520a46tulkff332vlpjp",
		},
	],
};

export const getAllRecords = async (schemaId: any, filter = {}) => {
	const collection = new SecretVaultWrapper(
		config.nodes,
		config.orgCredentials,
		schemaId,
	);
	await collection.init();

	const decryptedCollectionData = await collection.readFromNodes(filter);

	return decryptedCollectionData;
};
