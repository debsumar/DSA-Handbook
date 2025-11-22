import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Activity,
    Brain,
    Code2,
    Flame,
    GitBranch,
    Quote,
    Zap,
    Play,
    Pause,
    RotateCcw,
    Search,
    ArrowUpDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import { getCurrentStreak, getDailyGoalProgress } from '../../../lib/streakUtils';
import { useGetProblemsDataQuery } from '../problemsApi';
import { getTopicIcon } from '../../../lib/topicIcons';

// --- Components ---

const BentoCard = ({
    children,
    className = "",
    delay = 0,
    noHover = false
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    noHover?: boolean;
}) => (
    <motion.div
        className={`
            relative overflow-hidden rounded-[2rem] p-6
            bg-[var(--bg-secondary)]/40 backdrop-blur-xl
            border border-[var(--border-color)]/50
            shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]
            transition-all duration-500 ease-out
            group
            ${!noHover ? 'hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:-translate-y-1 hover:border-[var(--accent-primary)]/20' : ''}
            ${className}
        `}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay, type: "spring", stiffness: 80, damping: 20 }}
    >
        {/* Premium Inner Highlight/Glow */}
        <div className="absolute inset-0 rounded-[2rem] border border-white/10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-white/5 pointer-events-none" />

        {/* Hover Gradient Orb */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--accent-primary)]/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col">
            {children}
        </div>
    </motion.div>
);

const ProgressBar = ({ value, color = "bg-[var(--accent-primary)]", label }: { value: number, color?: string, label?: string }) => (
    <div className="w-full">
        {label && <div className="flex justify-between text-xs mb-1.5 font-medium text-[var(--text-secondary)]">
            <span>{label}</span>
            <span>{value}%</span>
        </div>}
        <div className="h-2 w-full bg-[var(--bg-primary)]/50 rounded-full overflow-hidden border border-[var(--border-color)]/30">
            <motion.div
                className={`h-full rounded-full ${color}`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
        </div>
    </div>
);

const VisualizerCard = ({ className, delay }: { className?: string, delay?: number }) => {
    const [array, setArray] = useState<number[]>([]);
    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [activeIndices, setActiveIndices] = useState<number[]>([]);
    const [foundIndex, setFoundIndex] = useState<number | null>(null);
    const [algorithm, setAlgorithm] = useState('bubble');
    const [message, setMessage] = useState('');

    const stopRef = useRef(false);
    const pausedRef = useRef(false);

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    useEffect(() => {
        resetArray();
        return () => {
            stopRef.current = true;
        };
    }, []);

    const resetArray = () => {
        stopRef.current = true; // Kill any running sort
        setRunning(false);
        setPaused(false);
        setMessage('');
        setActiveIndices([]);
        setFoundIndex(null);

        // Small timeout to allow loop to exit before resetting array
        setTimeout(() => {
            const newArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 80) + 15);
            setArray(newArr);
            stopRef.current = false; // Reset stop flag
        }, 100);
    };

    const sleep = (ms: number) => {
        return new Promise(resolve => {
            const check = () => {
                if (stopRef.current) return resolve(false); // Stop
                if (pausedRef.current) {
                    setTimeout(check, 100); // Wait while paused
                } else {
                    setTimeout(() => resolve(true), ms);
                }
            };
            check();
        });
    };

    const runAlgorithm = async () => {
        if (running && !paused) {
            setPaused(true);
            return;
        }
        if (running && paused) {
            setPaused(false);
            return;
        }

        setRunning(true);
        setPaused(false);
        stopRef.current = false;
        setMessage('');
        setFoundIndex(null);
        setActiveIndices([]);

        // Use current array state
        let arr = [...array];

        if (algorithm === 'bubble') {
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr.length - i - 1; j++) {
                    if (stopRef.current) return;
                    setActiveIndices([j, j + 1]);
                    const shouldContinue = await sleep(300);
                    if (!shouldContinue) return;

                    if (arr[j] > arr[j + 1]) {
                        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                        setArray([...arr]);
                    }
                }
            }
        } else if (algorithm === 'selection') {
            for (let i = 0; i < arr.length; i++) {
                let minIdx = i;
                for (let j = i + 1; j < arr.length; j++) {
                    if (stopRef.current) return;
                    setActiveIndices([i, j, minIdx]);
                    const shouldContinue = await sleep(250);
                    if (!shouldContinue) return;

                    if (arr[j] < arr[minIdx]) {
                        minIdx = j;
                    }
                }
                if (minIdx !== i) {
                    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                    setArray([...arr]);
                }
            }
        } else if (algorithm === 'linear') {
            // Linear Search: Iterate through entire array, mimicking a full pass
            const target = arr[Math.floor(Math.random() * arr.length)];

            for (let i = 0; i < arr.length; i++) {
                if (stopRef.current) return;
                setActiveIndices([i]);
                const shouldContinue = await sleep(300);
                if (!shouldContinue) return;

                if (arr[i] === target) {
                    setFoundIndex(i);
                    // Continue searching entire array
                }
            }
        } else if (algorithm === 'binary') {
            // Binary Search: Sort instantly then search
            arr.sort((a, b) => a - b);
            setArray([...arr]);
            await sleep(500); // Brief pause to show sorted state

            const target = arr[Math.floor(Math.random() * arr.length)];

            let left = 0;
            let right = arr.length - 1;

            while (left <= right) {
                if (stopRef.current) return;
                const mid = Math.floor((left + right) / 2);
                setActiveIndices([left, right, mid]);
                const shouldContinue = await sleep(500); // Slightly slower to follow jumps
                if (!shouldContinue) return;

                if (arr[mid] === target) {
                    setFoundIndex(mid);
                    // Don't break, continue searching to see if there are more (or just to finish loop)
                    // We force move to right to continue loop
                    left = mid + 1;
                } else if (arr[mid] < target) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }

        setActiveIndices([]);
        setRunning(false);
        setPaused(false);
        // Only show 'Sorted!' message for actual sorting algorithms
        if (!stopRef.current && (algorithm === 'bubble' || algorithm === 'selection')) {
            setMessage('Sorted!');
        }
    };

    return (
        <BentoCard className={className} delay={delay} noHover>
            <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-4 mb-2">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                                {algorithm.includes('sort') || algorithm === 'bubble' || algorithm === 'selection' ? <ArrowUpDown size={20} /> : <Search size={20} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)]">Visualizer</h3>
                                <p className="text-[10px] text-[var(--text-secondary)]">Algorithm Demo</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={resetArray}
                                className="p-2 hover:bg-[var(--bg-secondary)] rounded-full text-[var(--text-secondary)] transition-colors"
                            >
                                <RotateCcw size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <select
                                value={algorithm}
                                onChange={(e) => {
                                    setAlgorithm(e.target.value);
                                    // resetArray(); // Don't auto-reset, let user decide or just keep current array
                                    stopRef.current = true; // Stop current run though
                                    setRunning(false);
                                    setPaused(false);
                                    setActiveIndices([]);
                                    setFoundIndex(null);
                                    setMessage('');
                                }}
                                className="w-full appearance-none bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-medium border border-[var(--border-color)] rounded-lg px-3 py-2 outline-none focus:border-[var(--accent-primary)] transition-colors cursor-pointer"
                            >
                                <option value="bubble">Bubble Sort</option>
                                <option value="selection">Selection Sort</option>
                                <option value="linear">Linear Search</option>
                                <option value="binary">Binary Search</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
                                <ArrowUpDown size={12} />
                            </div>
                        </div>

                        <button
                            onClick={runAlgorithm}
                            className={`px-4 py-1.5 text-[var(--bg-primary)] text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-md ${running && !paused
                                ? 'bg-yellow-500 hover:bg-yellow-600'
                                : 'bg-[var(--text-primary)] hover:opacity-90'
                                }`}
                        >
                            {running && !paused ? <><Pause size={12} fill="currentColor" /> Pause</> : <><Play size={12} fill="currentColor" /> {paused ? 'Resume' : 'Run'}</>}
                        </button>
                    </div>
                </div>

                <div className="relative flex-1 min-h-[120px] flex items-end justify-between gap-2 px-2 pb-2">
                    {message && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[var(--bg-primary)]/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold border border-[var(--border-color)] shadow-sm z-10 whitespace-nowrap">
                            {message}
                        </div>
                    )}
                    {array.map((val, idx) => (
                        <motion.div
                            key={idx}
                            layout
                            className={`w-full rounded-t-md relative transition-colors duration-200 flex items-end justify-center pb-1 ${idx === foundIndex
                                ? 'bg-green-500'
                                : activeIndices.includes(idx)
                                    ? 'bg-indigo-500'
                                    : 'bg-[var(--text-secondary)]/30'
                                }`}
                            style={{ height: `${val}%` }}
                        >
                            <span className={`text-[10px] font-bold ${idx === foundIndex || activeIndices.includes(idx) ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                                {val}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </BentoCard>
    );
};

const quizQuestions = [
    { q: "Time complexity of Binary Search?", a: "O(log n)" },
    { q: "Best case for Bubble Sort?", a: "O(n)" },
    { q: "Worst case for Quick Sort?", a: "O(n²)" },
    { q: "Access time for Hash Map?", a: "O(1)" },
    { q: "Space complexity of Merge Sort?", a: "O(n)" },
    { q: "Is BFS LIFO or FIFO?", a: "FIFO (Queue)" },
    { q: "Is DFS LIFO or FIFO?", a: "LIFO (Stack)" },
    { q: "Height of balanced tree?", a: "O(log n)" },
    { q: "Lookup in Linked List?", a: "O(n)" },
    { q: "Insert in Dynamic Array?", a: "O(1) amortized" },
    { q: "Smallest element in Min-Heap?", a: "Root" },
    { q: "Time to build a Heap?", a: "O(n)" },
    { q: "Edges in MST with V nodes?", a: "V - 1" },
    { q: "Topological Sort complexity?", a: "O(V + E)" },
    { q: "Dijkstra with Binary Heap?", a: "O(E log V)" },
    { q: "Floyd-Warshall complexity?", a: "O(V³)" },
    { q: "Bellman-Ford complexity?", a: "O(VE)" },
    { q: "Search in BST (Worst)?", a: "O(n)" },
    { q: "Remove from Stack?", a: "O(1)" },
    { q: "Get min in Min-Stack?", a: "O(1)" }
];

const FlashcardCard = ({ className, delay }: { className?: string, delay?: number }) => {
    const [index, setIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isChanging, setIsChanging] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            handleAutoChange();
        }, 5000);
        return () => clearInterval(interval);
    }, [index, isFlipped]);

    const handleAutoChange = () => {
        setIsChanging(true);
        setTimeout(() => {
            setIndex((prev) => (prev + 1) % quizQuestions.length);
            setIsFlipped(false);
            setIsChanging(false);
        }, 300);
    };

    const handleManualClick = () => {
        if (!isChanging) {
            setIsFlipped(!isFlipped);
        }
    };

    const currentQ = quizQuestions[index];

    return (
        <BentoCard className={`${className} cursor-pointer perspective-1000`} delay={delay} noHover>
            <div className="h-full w-full relative group" onClick={handleManualClick}>
                <motion.div
                    className="w-full h-full relative preserve-3d"
                    animate={{
                        rotateY: isChanging ? 90 : (isFlipped ? 180 : 0)
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "easeInOut"
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front (Question) */}
                    <div
                        className="absolute inset-0 flex flex-col backface-hidden bg-[var(--bg-secondary)]/40 backdrop-blur-xl rounded-[2rem] p-6"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-2 text-pink-500 mb-2">
                            <Brain size={18} />
                            <span className="font-bold text-[var(--text-primary)] text-sm">Quiz</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-[var(--text-secondary)] text-sm text-center font-medium leading-relaxed">
                                {currentQ.q}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-60 text-center mt-auto">
                            {isChanging ? 'Loading...' : 'Tap to Reveal'}
                        </div>

                        {/* Timer Bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--border-color)]/30 rounded-t-[2rem] overflow-hidden">
                            <motion.div
                                className="h-full bg-pink-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                                key={index}
                            />
                        </div>
                    </div>

                    {/* Back (Answer) */}
                    <div
                        className="absolute inset-0 flex flex-col backface-hidden bg-[var(--bg-secondary)]/80 backdrop-blur-xl rounded-[2rem] border border-[var(--accent-primary)]/20 p-6"
                        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-2 text-[var(--accent-primary)] mb-2">
                            <Brain size={18} />
                            <span className="font-bold text-[var(--text-primary)] text-sm">Answer</span>
                        </div>

                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-xl font-bold text-[var(--accent-primary)] text-center">
                                {currentQ.a}
                            </div>
                        </div>

                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-60 text-center mt-auto">
                            Tap to Flip Back
                        </div>
                    </div>
                </motion.div>
            </div>
        </BentoCard>
    );
};

const QuoteCard = ({ className, delay }: { className?: string, delay?: number }) => {
    return (
        <BentoCard className={`${className} flex flex-col justify-between !p-6`} delay={delay}>
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <Quote size={18} />
                <span className="font-bold text-[var(--text-primary)] text-sm">Quotes</span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <p className="text-lg font-medium text-[var(--text-primary)] italic leading-relaxed">
                    "Talk is cheap. Show me the code."
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-3 font-bold">
                    — Linus Torvalds
                </p>
            </div>

            <div className="absolute bottom-0 right-0 p-4 opacity-5">
                <Quote size={80} />
            </div>
        </BentoCard>
    );
};

export const Home = () => {
    // Get completed problems from Redux
    const completedProblemIds = useSelector((state: RootState) => state.problems.completedProblemIds);

    // Get problems data to calculate topic mastery
    const { data: problemsData } = useGetProblemsDataQuery();

    // Track streak and daily goals
    const [streak, setStreak] = useState(0);
    const [dailyGoal, setDailyGoal] = useState({ completed: 0, total: 5 });

    // Update streak and daily goal on mount and when completedProblemIds changes
    useEffect(() => {
        setStreak(getCurrentStreak());
        setDailyGoal(getDailyGoalProgress());
    }, [completedProblemIds]);

    // Calculate total completed
    const totalCompleted = completedProblemIds.length;

    // Calculate daily goal percentage
    const dailyGoalPercentage = Math.min((dailyGoal.completed / dailyGoal.total) * 100, 100);

    // Calculate topic mastery dynamically
    const topicMastery = React.useMemo(() => {
        if (!problemsData) return [];

        const topicStats = problemsData.topics.map(topic => {
            // Get all problems for this topic
            const topicProblems = Object.values(problemsData.problems).filter(
                problem => problem.topicIds.includes(topic.id)
            );

            const total = topicProblems.length;
            const completed = topicProblems.filter(p => completedProblemIds.includes(p.id)).length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            // Get icon and color from shared config
            const { icon, color } = getTopicIcon(topic.name);

            return {
                name: topic.name.length > 15 ? topic.name.substring(0, 13) + '...' : topic.name,
                fullName: topic.name,
                icon,
                progress,
                completed,
                total,
                color,
            };
        });

        // Sort by completed count (descending) and take top 4
        return topicStats
            .sort((a, b) => b.completed - a.completed)
            .slice(0, 4);
    }, [problemsData, completedProblemIds]);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 md:p-8 font-sans selection:bg-[var(--accent-primary)]/30 overflow-x-hidden transition-colors duration-300">

            {/* Background Noise Texture */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    className="mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-2">
                            <span
                                className="text-transparent bg-clip-text"
                                style={{
                                    backgroundImage: document.documentElement.classList.contains('dark')
                                        ? 'linear-gradient(to right, #ffffff, #525252, #d4d4d4)'
                                        : 'linear-gradient(to right, #737373, #e5e5e5, #d4d4d4)'
                                }}
                            >
                                DSA Handbook
                            </span>
                        </h1>
                        <p className="text-[var(--text-secondary)] text-xl font-medium flex items-center gap-2">
                            {/* <Terminal size={20} className="text-[var(--accent-primary)]" /> */}
                            Master the patterns. Ace the interview.
                        </p>
                    </div>
                    <Link to="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all text-lg group"
                        >
                            Start Practicing
                            <div className="bg-black text-white rounded-full p-1 group-hover:translate-x-1 transition-transform">
                                <ArrowRight size={16} />
                            </div>
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-auto gap-6 pb-12">

                    {/* 1. Main Hero Card - Top Left (2x2) */}
                    <BentoCard className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] !p-8" delay={0.1}>
                        <div className="flex flex-col justify-between h-full relative z-10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-bold mb-6 shadow-sm">
                                    <Zap size={14} className="fill-current" />
                                    <span>NEW PATTERNS ADDED</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-6 tracking-tight">
                                    Level up your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-purple-500">Coding Skills</span>
                                </h2>
                                <p className="text-[var(--text-secondary)] text-lg max-w-md leading-relaxed">
                                    Don't just memorize solutions. Understand the underlying patterns that solve 90% of interview questions.
                                </p>
                            </div>

                        </div>

                        {/* Decorative Background Elements */}
                        <div className="absolute right-0 bottom-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                            <Code2 size={300} />
                        </div>
                        <div className="absolute top-1/2 right-10 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />
                    </BentoCard>

                    {/* 2. Activity - Top Right (1x1) */}
                    <BentoCard className="md:col-span-1 md:row-span-1" delay={0.2}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <Activity size={18} className="text-[var(--accent-primary)]" /> Activity
                            </h3>
                            <div className="text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded">+24%</div>
                        </div>

                        <div className="flex items-end justify-between h-24 gap-1.5">
                            {[35, 60, 25, 65, 45, 80, 55, 90, 70, 100].map((h, i) => (
                                <motion.div
                                    key={i}
                                    className="w-full bg-[var(--text-secondary)]/20 rounded-t-md relative group/bar overflow-hidden"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.8, delay: 0.4 + (i * 0.05) }}
                                >
                                    <div className="absolute bottom-0 w-full h-full bg-[var(--accent-primary)] opacity-80 group-hover/bar:opacity-100 transition-opacity" />
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-3 flex justify-between items-center text-xs text-[var(--text-secondary)] font-medium">
                            <span>Last 10 Days</span>
                            <span className="text-[var(--text-primary)]">{totalCompleted} Solved</span>
                        </div>
                    </BentoCard>

                    {/* 3. Topics/Tags - Top Right (1x2) */}
                    <BentoCard className="md:col-span-1 md:row-span-2 flex flex-col" delay={0.3}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <Brain size={18} className="text-purple-500" />
                                Mastery
                            </h3>
                        </div>

                        <div className="space-y-5 flex-1">
                            {topicMastery.length > 0 ? (
                                topicMastery.map((topic, i) => (
                                    <div key={i} className="group/topic">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-1.5 flex items-center justify-center">
                                                <topic.icon size={16} className={`${topic.color.replace('bg-', 'text-')} opacity-90`} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-sm font-medium text-[var(--text-primary)]">{topic.name}</span>
                                            <span className="text-xs text-[var(--text-secondary)] ml-auto">{topic.completed}/{topic.total}</span>
                                        </div>
                                        <ProgressBar value={topic.progress} color={topic.color} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-[var(--text-secondary)] py-8">
                                    <p className="text-sm">Start solving problems to see your mastery!</p>
                                </div>
                            )}
                        </div>

                        <Link to="/" className="mt-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-t border-[var(--border-color)]/50 transition-colors">
                            View All Topics
                        </Link>
                    </BentoCard>

                    {/* 4. Stats - Middle Left (1x1) */}
                    <BentoCard className="md:col-span-1 md:row-span-1" delay={0.4}>
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                                    <Flame size={24} className="fill-current" />
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Streak</div>
                                    <div className="text-2xl font-bold text-[var(--text-primary)]">{streak} <span className="text-sm font-normal text-[var(--text-secondary)]">Days</span></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--text-secondary)]">Daily Goal</span>
                                    <span className="font-bold">{dailyGoal.completed}/{dailyGoal.total}</span>
                                </div>
                                <div className="h-3 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden p-[2px]">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${dailyGoalPercentage}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                </div>
                                <div className="text-xs text-[var(--text-secondary)] text-center mt-1">
                                    Keep the fire burning! 🔥
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 5. Essential Patterns - Middle Center (2x1) - TALLER */}
                    <BentoCard className="md:col-span-2 md:row-span-1 h-[280px]" delay={0.5}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <GitBranch size={20} />
                            </div>
                            <h3 className="font-bold text-[var(--text-primary)]">Essential Patterns</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[var(--border-color)] scrollbar-track-transparent">
                            {[
                                { name: 'Two Pointers', desc: 'Array/String' },
                                { name: 'Sliding Window', desc: 'Subarrays' },
                                { name: 'Merge Intervals', desc: 'Scheduling' },
                                { name: 'Fast & Slow', desc: 'Linked List' },
                                { name: 'Cyclic Sort', desc: 'Arrays 1-N' },
                                { name: 'In-place Reversal', desc: 'Linked List' },
                                { name: 'BFS / DFS', desc: 'Graph/Tree' },
                                { name: 'Topological Sort', desc: 'Dependencies' },
                                { name: 'Two Heaps', desc: 'Median' },
                                { name: 'Subsets', desc: 'Permutations' },
                            ].map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border-color)] hover:border-[var(--accent-primary)]/30 hover:bg-[var(--bg-primary)] transition-all cursor-pointer group/item h-fit">
                                    <div>
                                        <div className="text-sm font-bold text-[var(--text-primary)]">{p.name}</div>
                                        <div className="text-[10px] text-[var(--text-secondary)]">{p.desc}</div>
                                    </div>
                                    <ArrowRight size={14} className="text-[var(--text-secondary)] opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    {/* 6. Quote - Bottom Left (1x1) - TALLER */}
                    <QuoteCard className="md:col-span-1 md:row-span-1 h-[280px]" delay={0.6} />

                    {/* 7. Visualizer - Bottom Center (2x1) - TALLER */}
                    <VisualizerCard className="md:col-span-2 md:row-span-1 h-[280px]" delay={0.7} />

                    {/* 8. Flashcard - Bottom Right (1x1) - TALLER */}
                    <FlashcardCard className="md:col-span-1 md:row-span-1 h-[280px]" delay={0.8} />

                </div>
            </div>
        </div>
    );
};
