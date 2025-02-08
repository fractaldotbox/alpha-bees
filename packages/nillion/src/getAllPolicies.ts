import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { config } from './config';

export const getAllPolicies = async (schemaId:any = "8e21e686-17ab-4507-a530-edcab0b5416a") => {
    try {
        const collection = new SecretVaultWrapper(
            config.nodes,
            config.orgCredentials,
            schemaId
        );
        await collection.init();

        const decryptedCollectionData = await collection.readFromNodes({});

        return decryptedCollectionData;
    } catch (error: any) {
        console.error('❌ SecretVaultWrapper error:', error.message);
        process.exit(1);
    }
}
