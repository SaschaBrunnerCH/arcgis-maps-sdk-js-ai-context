#!/usr/bin/env node

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(__dirname, "..", "skills");
const PASS = "\x1b[32m\u2713\x1b[0m";
const FAIL = "\x1b[31m\u2717\x1b[0m";
const WARN = "\x1b[33m!\x1b[0m";

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yaml = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) yaml[key] = value;
  }

  const body = content.slice(match[0].length).trim();
  return { yaml, body };
}

function validateSkill(skillDir, allSkillNames) {
  const dirName = basename(skillDir);
  const errors = [];
  const warnings = [];

  const skillPath = join(skillDir, "SKILL.md");
  if (!existsSync(skillPath)) {
    errors.push("SKILL.md not found");
    return { dirName, errors, warnings };
  }

  const content = readFileSync(skillPath, "utf8");

  const parsed = parseFrontmatter(content);
  if (!parsed) {
    errors.push("Missing or invalid YAML frontmatter (no --- delimiters)");
    return { dirName, errors, warnings };
  }

  if (!parsed.yaml.name) errors.push("Frontmatter missing 'name' field");
  if (!parsed.yaml.description)
    errors.push("Frontmatter missing 'description' field");

  if (parsed.yaml.name && parsed.yaml.name !== dirName) {
    errors.push(
      `Frontmatter 'name' ("${parsed.yaml.name}") does not match directory name ("${dirName}")`,
    );
  }

  if (!parsed.body) errors.push("No content after frontmatter");

  // Line-count guidance follows Anthropic's "Complete Guide to Building Skills for
  // Claude" and the skill-creator skill: keep SKILL.md under ~500 lines and push
  // overflow into references/. We warn (non-failing) above that threshold instead
  // of enforcing a minimum, so authors aren't pushed to pad thin skills.
  const lineCount = content.split("\n").length;
  if (lineCount > 500) {
    warnings.push(
      `File is ${lineCount} lines (>500); consider moving detail into references/ for progressive disclosure`,
    );
  }

  // Validate Related Skills cross-references
  const relatedMatch = content.match(
    /## Related Skills\n([\s\S]*?)(?=\n## |\n$|$)/,
  );
  if (relatedMatch) {
    const skillRefs = relatedMatch[1].match(/`(arcgis-[a-z0-9-]+)`/g);
    if (skillRefs) {
      for (const ref of skillRefs) {
        const refName = ref.replace(/`/g, "");
        if (
          ["arcgis-map", "arcgis-scene", "arcgis-placement"].includes(refName)
        )
          continue;
        if (!allSkillNames.includes(refName)) {
          errors.push(
            `Related Skills references non-existent skill: ${refName}`,
          );
        }
      }
    }
  }

  // Check AGENTS.md if it exists
  const agentsPath = join(skillDir, "AGENTS.md");
  if (existsSync(agentsPath)) {
    const agentsContent = readFileSync(agentsPath, "utf8").trim();
    if (!agentsContent) errors.push("AGENTS.md exists but is empty");
  }

  return { dirName, errors, warnings };
}

function main() {
  if (!existsSync(SKILLS_DIR)) {
    console.error("Skills directory not found: " + SKILLS_DIR);
    process.exit(1);
  }

  const entries = readdirSync(SKILLS_DIR, { withFileTypes: true });
  const skillDirs = entries
    .filter((e) => e.isDirectory())
    .map((e) => join(SKILLS_DIR, e.name))
    .sort();

  if (skillDirs.length === 0) {
    console.error("No skill directories found");
    process.exit(1);
  }

  const allSkillNames = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  console.log(`Validating ${skillDirs.length} skills...\n`);

  let passed = 0;
  let failed = 0;
  let warned = 0;

  for (const skillDir of skillDirs) {
    const result = validateSkill(skillDir, allSkillNames);
    const hasWarnings = result.warnings && result.warnings.length > 0;
    if (result.errors.length === 0) {
      const marker = hasWarnings ? WARN : PASS;
      console.log(`  ${marker}  ${result.dirName}`);
      passed++;
      if (hasWarnings) warned++;
    } else {
      console.log(`  ${FAIL}  ${result.dirName}`);
      for (const err of result.errors) {
        console.log(`       - ${err}`);
      }
      failed++;
    }
    if (hasWarnings) {
      for (const warning of result.warnings) {
        console.log(`       ! ${warning}`);
      }
    }
  }

  console.log(
    `\nResults: ${passed} passed (${warned} with warnings), ${failed} failed, ${skillDirs.length} total`,
  );

  if (failed > 0) process.exit(1);
}

main();
