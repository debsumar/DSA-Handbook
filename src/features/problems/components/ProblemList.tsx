
import { useSelector } from 'react-redux';
import { useGetProblemsQuery, useGetProblemsDataQuery } from '../problemsApi';
import { ProblemCard } from './ProblemCard';
import { FilterBar } from './FilterBar';
import type { RootState } from '../../../app/store';
import { Sidebar } from './Sidebar';

export const ProblemList = () => {
    const { data: problems, isLoading, error } = useGetProblemsQuery();
    const { data: problemsData } = useGetProblemsDataQuery();
    const { filter, difficulty, selectedTopic, selectedPattern } = useSelector((state: RootState) => state.problems);

    const filteredProblems = problems?.filter((problem) => {
        const matchesFilter = problem.title.toLowerCase().includes(filter.toLowerCase());
        const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty;

        // Topic matching: Check if problem's topicIds includes the selected topic
        const matchesTopic = !selectedTopic || problem.topicIds.includes(selectedTopic);

        // Pattern matching: 
        // If "All Patterns" (id: 1) is selected, show all problems for the topic.
        // Otherwise, check if the problem's patternIds include the selected pattern.
        const matchesPattern = selectedPattern === 1 || (selectedPattern && problem.patternIds.includes(selectedPattern));

        return matchesFilter && matchesDifficulty && matchesTopic && matchesPattern;
    });

    // Get the selected topic and pattern names for display
    const selectedTopicName = problemsData?.topics.find(t => t.id === selectedTopic)?.name || 'All Problems';
    const selectedPatternName = problemsData?.patterns.find(p => p.id === selectedPattern)?.name;

    if (isLoading) return <div className="flex justify-center p-10">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-10">Error loading problems</div>;

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">
                        {selectedTopicName}
                        {selectedPatternName && selectedPatternName !== 'All Patterns' && <span className="text-[var(--text-secondary)] text-xl font-normal ml-2">/ {selectedPatternName}</span>}
                    </h1>
                    <FilterBar />
                </div>

                {filteredProblems?.length === 0 ? (
                    <div className="text-center p-10 text-[var(--text-secondary)]">No problems found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProblems?.map((problem, index) => (
                            <ProblemCard key={problem.id} problem={problem} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
