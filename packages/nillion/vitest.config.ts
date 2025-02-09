import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
	return {
		test: {
			env: loadEnv(mode, path.resolve(__dirname, "../.."), ""),
		},
	};
});
