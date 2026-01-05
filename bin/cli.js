#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { installClaude, installAll, listContexts, getAvailableVersions, colors, colorize, log } = require('../lib/installer');

const pkg = require('../package.json');

const COMMANDS = {
  claude: 'Install Claude skills to .claude/skills/arcgis-maps-sdk-js/',
  all: 'Install all AI context files (latest SDK version)',
  list: 'Show available contexts and SDK versions',
};

function showBanner() {
  log('');
  log(colorize('bold', colorize('cyan', '  ArcGIS Maps SDK for JavaScript - AI Context Installer')));
  log(colorize('dim', `  Version ${pkg.version}`));
  log('');
}

function showHelp() {
  showBanner();

  log(colorize('bold', 'USAGE'));
  log(`  npx ${pkg.name} <command> [options]`);
  log('');

  log(colorize('bold', 'COMMANDS'));
  for (const [cmd, desc] of Object.entries(COMMANDS)) {
    log(`  ${colorize('cyan', cmd.padEnd(12))} ${desc}`);
  }
  log('');

  log(colorize('bold', 'OPTIONS'));
  log(`  ${colorize('cyan', '--sdk <ver>'.padEnd(16))} ArcGIS SDK version (e.g., 4.34)`);
  log(`  ${colorize('cyan', '--help, -h'.padEnd(16))} Show this help message`);
  log(`  ${colorize('cyan', '--version, -v'.padEnd(16))} Show package version number`);
  log('');

  const versions = getAvailableVersions();
  log(colorize('bold', 'AVAILABLE SDK VERSIONS'));
  log(`  ${versions.join(', ')} ${colorize('dim', `(default: ${versions[versions.length - 1]})`)}`);
  log('');

  log(colorize('bold', 'EXAMPLES'));
  log(colorize('dim', '  # Install Claude skills (latest SDK version)'));
  log(`  npx ${pkg.name} claude`);
  log('');
  log(colorize('dim', '  # Install Claude skills for specific SDK version'));
  log(`  npx ${pkg.name} claude --sdk 4.34`);
  log('');
  log(colorize('dim', '  # Install everything'));
  log(`  npx ${pkg.name} all`);
  log('');
  log(colorize('dim', '  # List available contexts and versions'));
  log(`  npx ${pkg.name} list`);
  log('');

  log(colorize('bold', 'MORE INFO'));
  log(`  ${colorize('blue', pkg.homepage)}`);
  log('');
}

function showVersion() {
  log(`${pkg.name} v${pkg.version}`);
}

function parseArgs(args) {
  const result = {
    command: null,
    sdkVersion: null,
    help: false,
    version: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--version' || arg === '-v') {
      result.version = true;
    } else if (arg === '--sdk') {
      result.sdkVersion = args[i + 1];
      i++; // Skip next arg
    } else if (arg.startsWith('--sdk=')) {
      result.sdkVersion = arg.split('=')[1];
    } else if (!arg.startsWith('-') && !result.command) {
      result.command = arg;
    }
  }

  return result;
}

function main() {
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);

  // Handle flags
  if (parsed.help) {
    showHelp();
    process.exit(0);
  }

  if (parsed.version) {
    showVersion();
    process.exit(0);
  }

  // Get command
  const command = parsed.command;

  if (!command) {
    showHelp();
    process.exit(0);
  }

  // Validate SDK version if provided
  const versions = getAvailableVersions();
  let sdkVersion = parsed.sdkVersion;

  if (sdkVersion && !versions.includes(sdkVersion)) {
    log(`${colorize('red', 'Error:')} SDK version "${sdkVersion}" is not available.`);
    log(`Available versions: ${versions.join(', ')}`);
    process.exit(1);
  }

  // Default to latest version
  if (!sdkVersion) {
    sdkVersion = versions[versions.length - 1];
  }

  // Execute command
  showBanner();

  let success = false;

  switch (command.toLowerCase()) {
    case 'claude':
      success = installClaude(process.cwd(), sdkVersion);
      break;

    case 'all':
      success = installAll(process.cwd(), sdkVersion);
      break;

    case 'list':
      listContexts();
      success = true;
      break;

    default:
      log(`${colorize('red', 'Error:')} Unknown command "${command}"`);
      log('');
      log(`Run ${colorize('cyan', `npx ${pkg.name} --help`)} for usage information.`);
      process.exit(1);
  }

  log('');
  process.exit(success ? 0 : 1);
}

main();
