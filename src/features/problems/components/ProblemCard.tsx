import { motion, useAnimation } from 'framer-motion';
import type { Problem } from '../problemsApi';
import { ExternalLink, Check } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { toggleProblemCompletion } from '../problemsSlice';
import type { RootState } from '../../../app/store';
import { useState } from 'react';

interface ProblemCardProps {
    problem: Problem;
    index: number;
}

export const ProblemCard = ({ problem, index }: ProblemCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showRipple, setShowRipple] = useState(false);
    const dispatch = useDispatch();
    const checkboxControls = useAnimation();
    const completedProblems = useSelector((state: RootState) => state.problems.completedProblems);
    const isDone = completedProblems.some(p => p.id === problem.id);

    const handleCheckboxClick = () => {
        dispatch(toggleProblemCompletion(problem.id));

        // Trigger ripple effect
        setShowRipple(true);
        setTimeout(() => setShowRipple(false), 600);

        // Celebratory bounce animation
        checkboxControls.start({
            scale: [1, 1.3, 0.9, 1.1, 1],
            rotate: [0, -10, 10, -5, 0],
            transition: { duration: 0.5, ease: "easeInOut" }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`group relative bg-[var(--bg-secondary)] rounded-xl p-6 border transition-all duration-300 overflow-hidden cursor-pointer
                ${isDone
                    ? 'border-green-500/30 bg-green-500/5 shadow-lg shadow-green-500/10'
                    : 'border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:shadow-2xl hover:shadow-[var(--accent-primary)]/10'
                }`}
            style={{
                transformStyle: 'preserve-3d',
            }}
        >

            {/* Glow Effect */}
            <motion.div
                className={`absolute inset-0 opacity-0 transition-opacity duration-500 blur-2xl
                    ${isDone ? 'bg-green-500' : 'bg-[var(--accent-primary)]'}`}
                animate={isHovered ? { opacity: 0.08 } : { opacity: 0 }}
            />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                        <motion.span
                            whileHover={{ scale: 1.1, y: -2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className={`text-xs font-medium px-2 py-1 rounded-md cursor-default
                            ${problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                                    problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                        'bg-red-500/10 text-red-500'
                                } `}
                        >
                            {problem.difficulty}
                        </motion.span>
                        <motion.span
                            whileHover={{ scale: 1.05, y: -2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="text-xs font-medium px-2 py-1 rounded-md bg-[var(--text-primary)]/5 text-[var(--text-secondary)] cursor-default"
                        >
                            {problem.category}
                        </motion.span>
                    </div>

                    {/* Enhanced Checkbox with Micro-interactions */}
                    <motion.button
                        onClick={handleCheckboxClick}
                        animate={checkboxControls}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className={`relative w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300
                            ${isDone
                                ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/50'
                                : 'border-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10'
                            } `}
                    >
                        {/* Ripple Effect */}
                        {showRipple && (
                            <motion.span
                                className={`absolute inset-0 rounded ${isDone ? 'bg-green-500' : 'bg-[var(--accent-primary)]'}`}
                                initial={{ scale: 1, opacity: 0.6 }}
                                animate={{ scale: 2.5, opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        )}

                        {/* Check Icon with Animation */}
                        {isDone && (
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 15,
                                    duration: 0.6
                                }}
                            >
                                <Check size={14} strokeWidth={3} />
                            </motion.div>
                        )}
                    </motion.button>
                </div>

                <motion.h3
                    className={`text-xl font-bold mb-2 transition-colors duration-300 ${isDone ? 'text-green-500/90' : 'group-hover:text-[var(--accent-primary)]'}`}
                    animate={isHovered ? { x: 4 } : { x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {problem.title}
                </motion.h3>

                <motion.p
                    className="text-sm text-[var(--text-secondary)] mb-6 line-clamp-2 flex-grow"
                    animate={isHovered ? { opacity: 0.9 } : { opacity: 1 }}
                >
                    {problem.description}
                </motion.p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-2 flex-wrap">
                        {problem.tags.slice(0, 2).map((tag, idx) => (
                            <motion.span
                                key={tag}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + idx * 0.05 }}
                                whileHover={{ scale: 1.1, y: -2 }}
                                className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] cursor-default"
                            >
                                #{tag}
                            </motion.span>
                        ))}
                    </div>
                    <a href={problem.link} target="_blank" rel="noopener noreferrer">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="group/btn hover:bg-[var(--accent-primary)] hover:text-black transition-all duration-300 gap-2"
                        >
                            Open
                            <motion.div
                                whileHover={{ x: 2, y: -2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <ExternalLink size={14} />
                            </motion.div>
                        </Button>
                    </a>
                </div>
            </div>
        </motion.div>
    );
};
