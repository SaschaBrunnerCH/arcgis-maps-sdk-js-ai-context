#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");

const SKILLS_DIR = path.join(__dirname, "..", "contexts", "4.34", "skills");
const PASS = "\x1b[32m\u2713\x1b[0m";
const FAIL = "\x1b[31m\u2717\x1b[0m";

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return null;
  }

  const yaml = {};
  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) {
      yaml[key] = value;
    }
  }

  const body = content.slice(match[0].length).trim();
  return { yaml, body };
}

function validateSkill(skillDir) {
  const dirName = path.basename(skillDir);
  const errors = [];

  // Check SKILL.md exists
  const skillPath = path.join(skillDir, "SKILL.md");
  if (!fs.existsSync(skillPath)) {
    errors.push("SKILL.md not found");
    return { dirName, errors };
  }

  const content = fs.readFileSync(skillPath, "utf8");

  // Parse and validate frontmatter
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    errors.push("Missing or invalid YAML frontmatter (no --- delimiters)");
    return { dirName, errors };
  }

  if (!parsed.yaml.name) {
    errors.push("Frontmatter missing 'name' field");
  }

  if (!parsed.yaml.description) {
    errors.push("Frontmatter missing 'description' field");
  }

  // Verify name matches directory name
  if (parsed.yaml.name && parsed.yaml.name !== dirName) {
    errors.push(
      "Frontmatter 'name' (\"" +
        parsed.yaml.name +
        '") does not match directory name ("' +
        dirName +
        '")'
    );
  }

  // Check content exists after frontmatter
  if (!parsed.body) {
    errors.push("No content after frontmatter");
  }

  // Check AGENTS.md if it exists
  const agentsPath = path.join(skillDir, "AGENTS.md");
  if (fs.existsSync(agentsPath)) {
    const agentsContent = fs.readFileSync(agentsPath, "utf8").trim();
    if (!agentsContent) {
      errors.push("AGENTS.md exists but is empty");
    }
  }

  return { dirName, errors };
}

function main() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error("Skills directory not found: " + SKILLS_DIR);
    process.exit(1);
  }

  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  const skillDirs = entries
    .filter(function (e) {
      return e.isDirectory();
    })
    .map(function (e) {
      return path.join(SKILLS_DIR, e.name);
    })
    .sort();

  if (skillDirs.length === 0) {
    console.error("No skill directories found in " + SKILLS_DIR);
    process.exit(1);
  }

  console.log("Validating " + skillDirs.length + " skills...\n");

  let totalPassed = 0;
  let totalFailed = 0;

  for (const skillDir of skillDirs) {
    const result = validateSkill(skillDir);

    if (result.errors.length === 0) {
      console.log("  " + PASS + "  " + result.dirName);
      totalPassed++;
    } else {
      console.log("  " + FAIL + "  " + result.dirName);
      for (const err of result.errors) {
        console.log("       - " + err);
      }
      totalFailed++;
    }
  }

  console.log(
    "\nResults: " +
      totalPassed +
      " passed, " +
      totalFailed +
      " failed, " +
      skillDirs.length +
      " total"
  );

  if (totalFailed > 0) {
    process.exit(1);
  }
}

main();
