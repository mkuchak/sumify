import { build } from "esbuild";

const define = {};

for (const k in process.env) {
  // Bypass windows errors
  if (k === "CommonProgramFiles(x86)" || k === "ProgramFiles(x86)") {
    continue;
  }
  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

const options = {
  bundle: true,
  minify: true,
  treeShaking: true,
  sourcemap: true,
  format: "esm",
  target: "esnext",
  platform: "browser",
  entryPoints: ["./src/index.ts"],
  outfile: "./dist/index.js",
};

try {
  await build({ ...options, define });
} catch {
  process.exitCode = 1;
}
