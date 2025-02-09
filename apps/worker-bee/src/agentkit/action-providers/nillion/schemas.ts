import { z } from "zod";

/**
 * Input schema for Get Record action.
 */
// TODO uuid
export const GetRecordSchema = z
	.object({
		schemaId: z.string().describe("The schema id to use"),
	})
	.strip()
	.describe("Instructions for get scret from nillion vault");
