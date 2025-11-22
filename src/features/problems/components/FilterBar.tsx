import React from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setFilter, setDifficulty } from '../problemsSlice';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FilterBar = () => {
    const dispatch = useAppDispatch();
    const { filter, difficulty } = useAppSelector((state) => state.problems);

    const difficulties = ['All', 'Easy', 'Medium', 'Hard'] as const;

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <motion.div
                className="relative flex-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                <Input
                    placeholder="Search problems..."
                    value={filter}
                    onChange={(e) => dispatch(setFilter(e.target.value))}
                    className="pl-10 pr-10"
                />

                {/* Clear search button */}
                <AnimatePresence>
                    {filter && (
                        <motion.button
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => dispatch(setFilter(''))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-full hover:bg-[var(--bg-secondary)]"
                        >
                            <X size={16} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className="flex gap-2 overflow-visible pb-2 sm:pb-0">
                {difficulties.map((diff, index) => {
                    const isActive = difficulty === diff;
                    const [clickKey, setClickKey] = React.useState(0);

                    return (
                        <motion.div
                            key={diff}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.3, type: "spring" }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.92 }}
                            >
                                <Button
                                    variant={isActive ? 'primary' : 'secondary'}
                                    size="sm"
                                    onClick={() => {
                                        dispatch(setDifficulty(diff));
                                        setClickKey(prev => prev + 1);
                                    }}
                                    className={`whitespace-nowrap relative overflow-hidden ${isActive ? 'shadow-lg shadow-[var(--accent-primary)]/20' : ''
                                        }`}
                                >
                                    {/* Click Ripple Effect */}
                                    <motion.div
                                        key={`ripple-${clickKey}`}
                                        className={`absolute inset-0 rounded-md ${isActive ? 'bg-white/30' : 'bg-[var(--accent-primary)]/30'
                                            }`}
                                        initial={{ scale: 0, opacity: 0.8 }}
                                        animate={{ scale: 2.5, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />

                                    {/* Pulse effect for active button */}
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 bg-white/10 rounded-md"
                                            animate={{
                                                opacity: [0.1, 0.2, 0.1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    )}

                                    <span className="relative z-10">{diff}</span>
                                </Button>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
