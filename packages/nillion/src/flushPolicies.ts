import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { config } from "./config";

export const flushPolicies = async (schemaId: any) => {
	const collection = new SecretVaultWrapper(
		config.nodes,
		config.orgCredentials,
		schemaId,
	);
	await collection.init();

	const result = await collection.flushData();

	console.log(result);

	return result;
};
