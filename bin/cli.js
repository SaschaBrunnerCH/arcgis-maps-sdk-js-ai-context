#!/usr/bin/env node

const path = require('path');
const { installClaude, installCopilot, installAll, listContexts, colors, colorize, log } = require('../lib/installer');

const pkg = require('../package.json');

const COMMANDS = {
  claude: 'Install Claude skills to .claude/skills/arcgis-maps-sdk-js/',
  copilot: 'Install GitHub Copilot instructions to .github/instructions/',
  all: 'Install all AI context files',
  list: 'Show available contexts',
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
  log(`  ${colorize('cyan', '--help, -h'.padEnd(12))} Show this help message`);
  log(`  ${colorize('cyan', '--version, -v'.padEnd(12))} Show version number`);
  log('');

  log(colorize('bold', 'EXAMPLES'));
  log(colorize('dim', '  # Install Claude skills'));
  log(`  npx ${pkg.name} claude`);
  log('');
  log(colorize('dim', '  # Install GitHub Copilot instructions'));
  log(`  npx ${pkg.name} copilot`);
  log('');
  log(colorize('dim', '  # Install everything'));
  log(`  npx ${pkg.name} all`);
  log('');
  log(colorize('dim', '  # List available contexts'));
  log(`  npx ${pkg.name} list`);
  log('');

  log(colorize('bold', 'MORE INFO'));
  log(`  ${colorize('blue', pkg.homepage)}`);
  log('');
}

function showVersion() {
  log(`${pkg.name} v${pkg.version}`);
}

function main() {
  const args = process.argv.slice(2);

  // Handle flags
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    showVersion();
    process.exit(0);
  }

  // Get command
  const command = args[0];

  if (!command) {
    showHelp();
    process.exit(0);
  }

  // Execute command
  showBanner();

  let success = false;

  switch (command.toLowerCase()) {
    case 'claude':
      success = installClaude();
      break;

    case 'copilot':
      success = installCopilot();
      break;

    case 'all':
      success = installAll();
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
