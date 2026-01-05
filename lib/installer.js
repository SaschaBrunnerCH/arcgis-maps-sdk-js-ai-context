const fs = require('fs');
const path = require('path');

// ANSI color codes (built-in, no dependencies)
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  white: '\x1b[37m',
};

function colorize(color, text) {
  return `${colors[color]}${text}${colors.reset}`;
}

function log(message) {
  console.log(message);
}

function success(message) {
  log(`${colorize('green', '\u2714')} ${message}`);
}

function error(message) {
  log(`${colorize('red', '\u2718')} ${message}`);
}

function info(message) {
  log(`${colorize('cyan', '\u2139')} ${message}`);
}

function warning(message) {
  log(`${colorize('yellow', '\u26A0')} ${message}`);
}

function header(message) {
  log(`\n${colorize('bold', colorize('magenta', message))}`);
}

/**
 * Get the contexts directory path (where bundled contexts are stored)
 */
function getContextsDir() {
  return path.join(__dirname, '..', 'contexts');
}

/**
 * Get available SDK versions
 */
function getAvailableVersions() {
  const contextsDir = getContextsDir();

  if (!fs.existsSync(contextsDir)) {
    return [];
  }

  const entries = fs.readdirSync(contextsDir, { withFileTypes: true });
  const versions = entries
    .filter(e => e.isDirectory() && /^\d+\.\d+$/.test(e.name))
    .map(e => e.name)
    .sort((a, b) => {
      const [aMajor, aMinor] = a.split('.').map(Number);
      const [bMajor, bMinor] = b.split('.').map(Number);
      if (aMajor !== bMajor) return aMajor - bMajor;
      return aMinor - bMinor;
    });

  return versions;
}

/**
 * Get the latest available version
 */
function getLatestVersion() {
  const versions = getAvailableVersions();
  return versions.length > 0 ? versions[versions.length - 1] : null;
}

/**
 * Copy directory recursively
 */
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source directory does not exist: ${src}`);
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Check if directory is writable
 */
function isWritable(dirPath) {
  try {
    const testFile = path.join(dirPath, '.write-test-' + Date.now());
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(testFile, '');
    fs.unlinkSync(testFile);
    return true;
  } catch {
    return false;
  }
}

/**
 * Count files in a directory recursively
 */
function countFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;

  let count = 0;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dirPath, entry.name));
    } else {
      count++;
    }
  }

  return count;
}

/**
 * List directory contents recursively with indentation
 */
function listDirContents(dirPath, indent = '') {
  if (!fs.existsSync(dirPath)) return [];

  const items = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true }).sort((a, b) => {
    // Directories first, then files
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    const isDir = entry.isDirectory();
    const icon = isDir ? '\u{1F4C1}' : '\u{1F4C4}';
    items.push(`${indent}${icon} ${entry.name}`);

    if (isDir) {
      items.push(...listDirContents(path.join(dirPath, entry.name), indent + '  '));
    }
  }

  return items;
}

/**
 * Install Agent Skills
 */
function installSkills(targetDir = process.cwd(), sdkVersion = null) {
  const version = sdkVersion || getLatestVersion();

  if (!version) {
    error('No SDK versions available');
    return false;
  }

  const destPath = path.join(targetDir, '.github', 'skills');
  const srcPath = path.join(getContextsDir(), version, 'skills');

  header(`Installing Agent Skills (SDK ${version})`);
  info(`Source: ${srcPath}`);
  info(`Target: ${destPath}`);

  if (!fs.existsSync(srcPath)) {
    error(`Agent Skills not found for SDK version ${version}`);
    return false;
  }

  const parentDir = path.dirname(destPath);
  if (!isWritable(parentDir)) {
    error(`Cannot write to directory: ${parentDir}`);
    error('Please check permissions and try again');
    return false;
  }

  try {
    copyDirSync(srcPath, destPath);
    const fileCount = countFiles(destPath);
    success(`Installed ${fileCount} Agent Skills files for SDK ${version}`);
    success(`Location: ${colorize('cyan', destPath)}`);
    return true;
  } catch (err) {
    error(`Failed to install Agent Skills: ${err.message}`);
    return false;
  }
}

/**
 * List available contexts
 */
function listContexts() {
  const contextsDir = getContextsDir();
  const versions = getAvailableVersions();

  header('Available Agent Skills');
  log('');

  // Show available versions
  log(`${colorize('bold', colorize('blue', 'Available SDK Versions'))}`);
  if (versions.length > 0) {
    const latestVersion = versions[versions.length - 1];
    for (const version of versions) {
      const isLatest = version === latestVersion;
      const label = isLatest ? ` ${colorize('green', '(latest)')}` : '';
      log(`  ${colorize('green', '\u2022')} ${colorize('cyan', version)}${label}`);
    }
  } else {
    log(`  ${colorize('dim', 'No versions available')}`);
  }
  log('');

  // Show contents for latest version
  const latestVersion = getLatestVersion();
  if (!latestVersion) {
    return;
  }

  // Agent Skills
  const skillsDir = path.join(contextsDir, latestVersion, 'skills');
  if (fs.existsSync(skillsDir)) {
    log(`${colorize('bold', colorize('blue', `Agent Skills (SDK ${latestVersion})`))}`);
    log(colorize('dim', `  Installs to: .github/skills/`));

    const entries = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const skillPath = path.join(skillsDir, entry.name, 'SKILL.md');
      if (fs.existsSync(skillPath)) {
        // Read first few lines to get name and description
        const content = fs.readFileSync(skillPath, 'utf8');
        const nameMatch = content.match(/^name:\s*(.+)$/m);
        const descMatch = content.match(/^description:\s*(.+)$/m);

        const name = nameMatch ? nameMatch[1] : entry.name;
        const desc = descMatch ? descMatch[1].substring(0, 60) + (descMatch[1].length > 60 ? '...' : '') : '';

        log(`  ${colorize('green', '\u2022')} ${colorize('cyan', name)}`);
        if (desc) {
          log(`    ${colorize('dim', desc)}`);
        }
      }
    }

    const skillCount = entries.length;
    log(`  ${colorize('dim', `(${skillCount} skills total)`)}`);
  }

  log('');
  log(colorize('dim', 'Usage:'));
  log(colorize('dim', '  npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context skills           # Install skills (latest)'));
  log(colorize('dim', '  npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context skills --sdk 4.34  # Install for specific version'));
}

module.exports = {
  installSkills,
  listContexts,
  getAvailableVersions,
  getLatestVersion,
  colors,
  colorize,
  log,
  success,
  error,
  info,
  warning,
  header,
};
