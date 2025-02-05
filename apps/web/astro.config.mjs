// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

import node from "@astrojs/node";

export default defineConfig({
	output: "server",
	vite: {
		ssr: {
			target: "node",
			// per target Node.js built-ins will also be externalized by default.
			// seems not working with cloudflare adapter, explicit for now
			external: [
				"crypto",
				"node:util",
				"node:process",
				"node:buffer",
				"node:fs",
				"node:path",
				"node:crypto",
				"node:assert",
				"node:events",
				"node:os",
				"node:stream",
				"node:http",
				"node:https",
				"node:zlib",
				"node:net",
			],
		},
	},
	integrations: [
		react({
			experimentalReactChildren: true,
		}),
		tailwind({
			applyBaseStyles: true,
		}),
	],

	adapter: node({
		mode: "standalone",
	}),
	site:
		import.meta.env.SITE_URL || "https://storacha-image-service.onrender.com",
	server: {
		port: 4321,
		host: "0.0.0.0",
	},
});
