import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { config } from "./config";

export const getAllPolicies = async (schemaId: any) => {
	const collection = new SecretVaultWrapper(
		config.nodes,
		config.orgCredentials,
		schemaId,
	);
	await collection.init();

	const decryptedCollectionData = await collection.readFromNodes({});

	return decryptedCollectionData;
};
