#!/usr/bin/env node

import { copyFileSync, chmodSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const gitHooksDir = join(root, ".git", "hooks");
const sourceHooksDir = join(root, ".githooks");

// Only run inside a git repo (skip in CI or when installed as dependency)
if (!existsSync(join(root, ".git"))) {
  process.exit(0);
}

mkdirSync(gitHooksDir, { recursive: true });

const hooks = ["pre-push"];

for (const hook of hooks) {
  const src = join(sourceHooksDir, hook);
  const dest = join(gitHooksDir, hook);

  if (existsSync(src)) {
    copyFileSync(src, dest);
    chmodSync(dest, 0o755);
    console.log(`Installed git hook: ${hook}`);
  }
}
