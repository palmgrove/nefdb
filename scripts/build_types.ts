import { $ } from "bun";

await $`bunx tsc -p tsconfig.build.json`;

const glob = new Bun.Glob("dist/**/*.d.ts");
for await (const path of glob.scan()) {
  const text = await Bun.file(path).text();
  await Bun.write(path, text.replace(/\.ts(?=")/g, ".js"));
}
