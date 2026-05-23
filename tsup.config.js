import { defineConfig } from "tsup";
export default defineConfig({
    entry: ["src/server.ts"],
    format: ["esm", "cjs"], // Keep this as ESM
    target: "esnext",
    outDir: "dist",
    clean: true,
    bundle: true,
    splitting: false,
    sourcemap: true,
    dts: false,
    banner: {
        js: `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
  `,
    },
});
//# sourceMappingURL=tsup.config.js.map