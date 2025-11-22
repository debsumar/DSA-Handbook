import {
    Hash,
    AlignLeft,
    GitCommit,
    Layers,
    Network,
    Binary,
    Table,
    Grid3x3,
    Search,
    ArrowUpDown,
    RotateCcw,
    Code2,
    TrendingUp,
    GitBranch,
    MoveRight,
    TreePine,
    Share2,
    Calculator
} from 'lucide-react';

/**
 * Maps topic names to their corresponding Lucide icons and colors
 * Each icon is carefully chosen to represent the data structure or algorithm concept
 * All colors use neon green/lime theme variations for consistency
 */
export const topicIconMap: Record<string, { icon: any; color: string }> = {
    // Arrays - Hash represents indexed elements
    'Array': { icon: Hash, color: 'bg-lime-500' },
    '2D Array': { icon: Grid3x3, color: 'bg-lime-400' },

    // Strings - AlignLeft represents text/characters (outline only)
    'String': { icon: AlignLeft, color: 'bg-green-500' },
    'Strings': { icon: AlignLeft, color: 'bg-green-500' },

    // Searching & Sorting - Self explanatory icons
    'Searching': { icon: Search, color: 'bg-emerald-500' },
    'Sorting': { icon: ArrowUpDown, color: 'bg-lime-600' },

    // Recursion & Backtracking - Circular/branching nature
    'Recursion': { icon: RotateCcw, color: 'bg-teal-500' },
    'Backtracking': { icon: GitBranch, color: 'bg-green-600' },

    // Linear Data Structures
    'Stack': { icon: Layers, color: 'bg-lime-500' }, // LIFO - layers stacked
    'Queue': { icon: MoveRight, color: 'bg-emerald-400' }, // FIFO - flow direction
    'Linked List': { icon: GitCommit, color: 'bg-green-500' }, // Connected nodes (outline only)

    // Heap - Tree structure with priority
    'Heap': { icon: TreePine, color: 'bg-lime-600' },

    // Hashing - Hash table structure
    'Hashing': { icon: Table, color: 'bg-green-600' },
    'Hash Table': { icon: Table, color: 'bg-green-600' },

    // Trees - Hierarchical structures
    'Binary Tree': { icon: Network, color: 'bg-emerald-500' },
    'Binary Search Tree': { icon: Binary, color: 'bg-teal-500' }, // Binary + ordered
    'Advanced Trees': { icon: GitBranch, color: 'bg-lime-500' }, // Complex branching

    // Graphs - Network of connections (outline only)
    'Graph': { icon: Share2, color: 'bg-green-500' },

    // Dynamic Programming & Greedy - Optimization strategies
    'DP': { icon: Calculator, color: 'bg-lime-400' }, // Calculation/memoization
    'Dynamic Programming': { icon: Calculator, color: 'bg-lime-400' },
    'Greedy': { icon: TrendingUp, color: 'bg-emerald-600' }, // Optimal choice at each step
    'Greedy Algorithms': { icon: TrendingUp, color: 'bg-emerald-600' },
};

/**
 * Get icon and color for a topic name
 * Returns default Code2 icon if topic not found
 */
export const getTopicIcon = (topicName: string) => {
    return topicIconMap[topicName] || { icon: Code2, color: 'bg-gray-500' };
};
