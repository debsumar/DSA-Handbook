import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { RootState } from '../../../app/store';
import { setTopic, setPattern } from '../problemsSlice';
import { useGetProblemsDataQuery } from '../problemsApi';
import { getTopicIcon } from '../../../lib/topicIcons';

export const Sidebar = () => {
    const dispatch = useDispatch();
    const { selectedTopic, selectedPattern, completedProblems } = useSelector((state: RootState) => state.problems);
    const completedProblemIds = completedProblems.map(p => p.id);
    const { data } = useGetProblemsDataQuery();

    // Get topics and patterns from API
    const topics = data?.topics || [];
    const patterns = data?.patterns || [];
    const problems = data?.problems || {};

    // Calculate completion stats
    const getTopicStats = (topicId: number) => {
        const topicProblems = Object.values(problems).filter(p => p.topicIds.includes(topicId));
        const total = topicProblems.length;
        const completed = topicProblems.filter(p => completedProblemIds.includes(p.id)).length;
        return { total, completed };
    };

    return (
        <div className="w-64 flex-shrink-0 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 p-4 border-r border-[var(--border-color)] hidden lg:block scrollbar-thin scrollbar-thumb-[var(--border-color)] scrollbar-track-transparent">
            <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Topics</h3>
                <div className="space-y-1">
                    {topics.map((topic, index) => {
                        const { total, completed } = getTopicStats(topic.id);
                        const isSelected = selectedTopic === topic.id;
                        const { icon: TopicIcon, color } = getTopicIcon(topic.name);

                        return (
                            <motion.button
                                key={topic.id}
                                onClick={() => dispatch(setTopic(topic.id))}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center group overflow-hidden cursor-pointer
                                    ${isSelected
                                        ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-medium'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                {/* Glow effect on selection */}
                                {isSelected && (
                                    <motion.div
                                        layoutId="topicSelection"
                                        className="absolute inset-0 bg-[var(--accent-primary)]/5 rounded-md"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}

                                <div className="relative z-10 flex items-center gap-2">
                                    <div className="p-1.5 flex items-center justify-center">
                                        <TopicIcon
                                            size={16}
                                            className={`${isSelected ? color.replace('bg-', 'text-') : 'text-[var(--text-secondary)]'} opacity-90`}
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                    <span>{topic.name}</span>
                                </div>
                                <motion.span
                                    className={`relative z-10 text-xs px-1.5 py-0.5 rounded-full transition-colors
                                        ${completed === total && total > 0 ? 'bg-green-500/20 text-green-500' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] group-hover:bg-[var(--bg-primary)]'}
                                    `}
                                    animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                >
                                    {completed}/{total}
                                </motion.span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Select Pattern</h3>
                <div className="flex flex-wrap gap-2">
                    {patterns.map((pattern, index) => {
                        const isSelected = selectedPattern === pattern.id;
                        return (
                            <motion.button
                                key={pattern.id}
                                onClick={() => dispatch(setPattern(pattern.id))}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-3 py-1.5 rounded-full text-xs transition-all border flex items-center gap-1.5 relative overflow-hidden cursor-pointer
                                    ${isSelected
                                        ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] font-medium shadow-lg shadow-[var(--accent-primary)]/30'
                                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-transparent hover:border-[var(--accent-primary)]'
                                    }`}
                            >
                                {/* Shimmer effect for selected pattern */}
                                {isSelected && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                    />
                                )}

                                <span className="relative z-10">{pattern.name}</span>

                                {isSelected && pattern.id !== 1 && (
                                    <motion.span
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, rotate: 180 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(setPattern(1));
                                        }}
                                        whileHover={{ rotate: 90, scale: 1.2 }}
                                        whileTap={{ scale: 0.8 }}
                                        className="relative z-10 hover:bg-black/20 rounded-full p-0.5 transition-colors flex items-center justify-center"
                                    >
                                        <X size={12} />
                                    </motion.span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
