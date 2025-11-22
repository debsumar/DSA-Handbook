import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { ArrowRight, Code2, Zap, Trophy } from 'lucide-react';

export const Home = () => {
    return (
        <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Background Particles/Grid */}
            <div className="absolute inset-0 -z-10 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <motion.div
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,var(--accent-primary)_0%,transparent_100%)] opacity-10"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl px-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm font-medium mb-6 border border-[var(--accent-primary)]/20"
                >
                    <Trophy size={14} />
                    <span>Level Up Your Skills</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                    Master <span className="text-[var(--accent-primary)]">DSA</span> <br />
                    Like a Pro.
                </h1>
                <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
                    Curated problems designed for the modern developer.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/">
                        <Button size="lg" className="group bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-black font-bold px-8 h-12 text-lg">
                            Start Grinding
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <a href="https://github.com/yourusername/dsa-handbook" target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" size="lg" className="h-12 px-8 text-lg">
                            <Code2 className="mr-2" />
                            View Source
                        </Button>
                    </a>
                </div>

                {/* Stats / Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 border-t border-[var(--border-color)] pt-10">
                    {[
                        { icon: Zap, label: "Fast & Responsive", value: "100ms" },
                        { icon: Code2, label: "Curated Problems", value: "200+" },
                        { icon: Trophy, label: "Success Rate", value: "98%" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <stat.icon className="text-[var(--accent-primary)] mb-2" size={24} />
                            <span className="text-2xl font-bold">{stat.value}</span>
                            <span className="text-sm text-[var(--text-secondary)]">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
