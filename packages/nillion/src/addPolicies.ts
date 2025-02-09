import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { config } from "./config";

export const addPolicies = async (data, schemaId: any) => {
	const collection = new SecretVaultWrapper(
		config.nodes,
		config.orgCredentials,
		"9d03997d-2200-452d-87f9-92d4728ea93e",
	);
	await collection.init();
	console.log("✅ Collection initialized");
	const dataWritten = await collection.writeToNodes(data);
	console.log(dataWritten);
	console.log(
		"👀 Data written to nodes:",
		JSON.stringify(dataWritten, null, 2),
	);

	const newIds = [
		...new Set(dataWritten.map((item: any) => item.result.data.created).flat()),
	];
	console.log("uploaded record ids:", newIds);

	return newIds;
};
