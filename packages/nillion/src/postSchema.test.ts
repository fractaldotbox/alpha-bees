import { describe, expect, test, vi } from "vitest";
import { postSchema } from "./postSchema";

describe("postSchema", () => {
	test("should return a schema ID", async () => {
		const result = await postSchema();
		console.log("schemaId", result);
		// if the schema ID is returned and it's uuidv4, then the test passes
		expect(result).toBeDefined();
		expect(result).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		);
	});
});
