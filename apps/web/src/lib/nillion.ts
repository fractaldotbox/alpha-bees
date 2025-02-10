import { addPolicies, flushPolicies } from '@repo/nillion';

export const storeToNillionVault = (key: string, value: string) => {
	// TODO: priority should be dynamic
	console.log('func: storing to nillion vault', key, value);
	addPolicies([{ policy: { $allot: value }, priority: { $allot: 1 } }], '9d03997d-2200-452d-87f9-92d4728ea93e');
};
