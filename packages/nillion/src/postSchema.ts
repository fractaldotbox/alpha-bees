import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { config } from "./config";
import schema from "./schema.json" assert { type: "json" };

export const postSchema = async () => {
	const org = new SecretVaultWrapper(config.nodes, config.orgCredentials);
	await org.init();

	const collectionName = "AlphaBee Collection";
	const newSchema = await org.createSchema(schema, collectionName);
	console.log("✅ New Collection Schema created for all nodes:", newSchema);
	console.log("👀 Schema ID:", newSchema[0].result.data);
	return newSchema[0].result.data;
};
