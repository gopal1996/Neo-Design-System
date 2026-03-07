#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const skillsDir = path.join(os.homedir(), '.claude', 'skills');
const skillSrc = path.join(__dirname, '..', 'neo.md');
const skillDest = path.join(skillsDir, 'neo.md');

try {
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
  }
  fs.copyFileSync(skillSrc, skillDest);
  console.log('');
  console.log('  Neo Design System skill installed for Claude Code.');
  console.log('  Run /neo in any project to load the design system context.');
  console.log('');
} catch {
  // Non-fatal — Claude Code may not be installed
}
