import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the existing problems.json (backup)
const oldData = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', 'problems_backup.json'), 'utf8'));

// Create topics array with IDs
const topics = oldData.topics.map((topic, index) => ({
    id: index + 1,
    name: topic
}));

// Add the special topics (100 and 101)
topics.push({ id: 100, name: "Linked List" });
topics.push({ id: 101, name: "Binary Tree" });

// Create patterns array with IDs
const patterns = oldData.patterns.map((pattern, index) => ({
    id: index + 1,
    name: pattern
}));

// Helper function to find topic IDs by name (returns array)
function findTopicIds(topicName) {
    const ids = topics
        .filter(t => t.name === topicName)
        .map(t => t.id);
    return ids.length > 0 ? ids : [];
}

// Helper function to find pattern IDs by tag names
function findPatternIds(tags) {
    return tags.map(tag => {
        const entry = patterns.find(p => p.name === tag);
        return entry ? entry.id : null;
    }).filter(id => id !== null);
}

// Transform problems to key-value pairs with topicIds and patternIds
const problems = {};
oldData.problems.forEach(problem => {
    const topicIds = findTopicIds(problem.category);
    const patternIds = findPatternIds(problem.tags);

    problems[problem.id] = {
        ...problem,
        topicIds,
        patternIds
    };
});

// Create the new data structure
const newData = {
    topics,
    patterns,
    problems
};

// Write the new data to a file
fs.writeFileSync(
    path.join(__dirname, 'public', 'data', 'problems_transformed.json'),
    JSON.stringify(newData, null, 4),
    'utf8'
);

console.log('✅ Transformation complete!');
console.log(`Total topics: ${Object.keys(topics).length}`);
console.log(`Total patterns: ${Object.keys(patterns).length}`);
console.log(`Total problems: ${Object.keys(problems).length}`);
