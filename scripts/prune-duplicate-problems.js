const fs = require('node:fs');
const vm = require('node:vm');

const FILE = 'linear-algebra/data.js';
const REMOVE_IDS = new Set([
  // Same linear system and solution as 2025-LA-QZ-A1, only the paper label differs.
  '2025-LA-QZ-B1'
]);

const source = fs.readFileSync(FILE, 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { timeout: 3000 });
const bank = vm.runInContext('BANK', sandbox, { timeout: 1000 });
const before = bank.problems.length;
bank.problems = bank.problems.filter((problem) => !REMOVE_IDS.has(problem.id));
fs.writeFileSync(FILE, 'const BANK = ' + JSON.stringify(bank, null, 2) + ';\n');
console.log(`removed=${before - bank.problems.length} remaining=${bank.problems.length}`);
