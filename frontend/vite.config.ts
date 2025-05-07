import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	plugins: [
		vue(),
		tailwindcss(),
		tsconfigPaths(),
	],
	server: {
		host: "0.0.0.0",
		port: 3000,
	},
	optimizeDeps: {
		force: true,
	},
});
