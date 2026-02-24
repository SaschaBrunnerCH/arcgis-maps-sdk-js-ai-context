#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");

const SKILLS_DIRS = [
  { version: "4.34", path: path.join(__dirname, "..", "contexts", "4.34", "skills") },
  { version: "5.0", path: path.join(__dirname, "..", "contexts", "5.0", "skills") },
];
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

function validateSkill(skillDir, version, allSkillNames) {
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

  // Check line count (target: 300-1100)
  const lineCount = content.split("\n").length;
  if (lineCount < 250) {
    errors.push("File too short (" + lineCount + " lines, target 300-1100)");
  } else if (lineCount > 1200) {
    errors.push("File too long (" + lineCount + " lines, target 300-1100)");
  }

  // Version-specific checks
  if (version === "5.0") {
    // Check for 4.34 CDN URL leaks
    if (content.includes("js.arcgis.com/4.")) {
      errors.push("Contains old 4.x CDN URL (should use 5.0)");
    }
    // Check for version 4.34 references in text
    if (content.includes("4.34") && !content.includes("no 4.x equivalent") && !content.includes("4.x")) {
      errors.push("Contains explicit '4.34' version reference");
    }
  }

  // Validate Related Skills cross-references
  if (allSkillNames) {
    const relatedMatch = content.match(/## Related Skills\n([\s\S]*?)(?=\n## |\n$|$)/);
    if (relatedMatch) {
      const relatedSection = relatedMatch[1];
      const skillRefs = relatedSection.match(/`(arcgis-[a-z0-9-]+)`/g);
      if (skillRefs) {
        for (const ref of skillRefs) {
          const refName = ref.replace(/`/g, "");
          // Skip known component names that aren't skills
          if (["arcgis-map", "arcgis-scene", "arcgis-placement"].includes(refName)) continue;
          if (!allSkillNames.includes(refName)) {
            errors.push("Related Skills references non-existent skill: " + refName);
          }
        }
      }
    }
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

function validateVersion(versionInfo) {
  if (!fs.existsSync(versionInfo.path)) {
    console.log("  Skills directory not found: " + versionInfo.path + " (skipping)");
    return { passed: 0, failed: 0, total: 0 };
  }

  const entries = fs.readdirSync(versionInfo.path, { withFileTypes: true });
  const skillDirs = entries
    .filter(function (e) {
      return e.isDirectory();
    })
    .map(function (e) {
      return path.join(versionInfo.path, e.name);
    })
    .sort();

  if (skillDirs.length === 0) {
    console.log("  No skill directories found in " + versionInfo.path);
    return { passed: 0, failed: 0, total: 0 };
  }

  // Collect all skill names for cross-reference validation
  const allSkillNames = entries
    .filter(function (e) {
      return e.isDirectory();
    })
    .map(function (e) {
      return e.name;
    });

  console.log("Validating " + skillDirs.length + " skills (v" + versionInfo.version + ")...\n");

  let totalPassed = 0;
  let totalFailed = 0;

  for (const skillDir of skillDirs) {
    const result = validateSkill(skillDir, versionInfo.version, allSkillNames);

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
    "\nResults (v" + versionInfo.version + "): " +
      totalPassed +
      " passed, " +
      totalFailed +
      " failed, " +
      skillDirs.length +
      " total\n"
  );

  return { passed: totalPassed, failed: totalFailed, total: skillDirs.length };
}

function main() {
  let grandPassed = 0;
  let grandFailed = 0;
  let grandTotal = 0;

  for (const versionInfo of SKILLS_DIRS) {
    const result = validateVersion(versionInfo);
    grandPassed += result.passed;
    grandFailed += result.failed;
    grandTotal += result.total;
  }

  if (grandTotal === 0) {
    console.error("No skills found in any version directory");
    process.exit(1);
  }

  console.log(
    "=== Grand Total: " +
      grandPassed +
      " passed, " +
      grandFailed +
      " failed, " +
      grandTotal +
      " skills ==="
  );

  if (grandFailed > 0) {
    process.exit(1);
  }
}

main();
