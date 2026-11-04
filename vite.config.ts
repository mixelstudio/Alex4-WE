import { defineConfig } from "vite";

export default defineConfig({
	// relative URLs, so the build runs from any folder (GitHub Pages serves
	// it under /Alex4-WE/)
	base: "./",
	build: {
		target: "es2022",
		chunkSizeWarningLimit: 2000,
	},
});
