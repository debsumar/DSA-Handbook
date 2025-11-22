import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current problems.json
const problemsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', 'problems.json'), 'utf8'));

// Helper to load additional problems from a file if it exists
function loadAdditional(fileName, key) {
    const filePath = path.join(__dirname, fileName);
    if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return content[key] || [];
    }
    return [];
}

// Load all additional problem arrays
// Add any new files here when needed
const allNewProblems = [];

console.log(`\n📝 Adding ${allNewProblems.length} new problems to the dataset...\n`);

// Add each new problem to the problems object
let addedCount = 0;
allNewProblems.forEach(problem => {
    if (!problemsData.problems[problem.id]) {
        problemsData.problems[problem.id] = problem;
        addedCount++;
        console.log(`✅ Added: ${problem.title}`);
    } else {
        console.log(`⏭️  Skipped (already exists): ${problem.title}`);
    }
});

// Write the updated data back to problems.json
fs.writeFileSync(
    path.join(__dirname, 'public', 'data', 'problems.json'),
    JSON.stringify(problemsData, null, 4),
    'utf8'
);

console.log(`\n✨ Successfully added ${addedCount} new problems!`);
console.log(`📊 Total problems in dataset: ${Object.keys(problemsData.problems).length}`);

// Run analysis to see pattern coverage
console.log('\n' + '='.repeat(60));
console.log('Running pattern coverage analysis...\n');

const patternCounts = {};
problemsData.patterns.forEach(pattern => {
    patternCounts[pattern.id] = {
        name: pattern.name,
        count: 0
    };
});

Object.values(problemsData.problems).forEach(problem => {
    problem.patternIds.forEach(patternId => {
        if (patternCounts[patternId]) {
            patternCounts[patternId].count++;
        }
    });
});

const sortedPatterns = Object.entries(patternCounts).sort((a, b) => a[1].count - b[1].count);

sortedPatterns.forEach(([id, info]) => {
    const status = info.count >= 10 ? '✅' : '⚠️ ';
    console.log(`${status} Pattern ${id}: ${info.name.padEnd(35)} - ${info.count} problems`);
});

const needMore = sortedPatterns.filter(([_, info]) => info.count < 10);
console.log(`\n${needMore.length === 0 ? '🎉 All patterns have 10+ problems!' : `⚠️  ${needMore.length} patterns still need more problems`}`);
