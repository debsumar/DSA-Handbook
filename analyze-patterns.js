import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current problems.json
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', 'problems.json'), 'utf8'));

// Count problems per pattern
const patternCounts = {};

// Initialize counts
data.patterns.forEach(pattern => {
    patternCounts[pattern.id] = {
        name: pattern.name,
        count: 0,
        problems: []
    };
});

// Count problems for each pattern
Object.values(data.problems).forEach(problem => {
    problem.patternIds.forEach(patternId => {
        if (patternCounts[patternId]) {
            patternCounts[patternId].count++;
            patternCounts[patternId].problems.push(problem.title);
        }
    });
});

// Display results
console.log('\n📊 Pattern Analysis:');
console.log('='.repeat(60));

const sortedPatterns = Object.entries(patternCounts).sort((a, b) => a[1].count - b[1].count);

sortedPatterns.forEach(([id, info]) => {
    const status = info.count >= 10 ? '✅' : '❌';
    const missing = Math.max(0, 10 - info.count);
    console.log(`${status} Pattern ${id}: ${info.name.padEnd(35)} - ${info.count} problems ${missing > 0 ? `(need ${missing} more)` : ''}`);
});

console.log('='.repeat(60));

// Patterns needing more problems
const needMoreProblems = sortedPatterns.filter(([_, info]) => info.count < 10);
console.log(`\n⚠️  ${needMoreProblems.length} patterns need more problems:\n`);
needMoreProblems.forEach(([id, info]) => {
    console.log(`   - ${info.name} (${info.count}/10)`);
});
