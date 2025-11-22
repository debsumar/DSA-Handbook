import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { updateStreak } from '../../lib/streakUtils';

interface ProblemsState {
    filter: string;
    difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
    selectedTopic: number | null;
    selectedPattern: number | null;
    completedProblemIds: string[];
}

// Load completed problems from localStorage
const loadCompletedProblems = (): string[] => {
    try {
        const saved = localStorage.getItem('completedProblemIds');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Failed to load completed problems:', error);
        return [];
    }
};

// Save completed problems to localStorage
const saveCompletedProblems = (completedIds: string[]) => {
    try {
        localStorage.setItem('completedProblemIds', JSON.stringify(completedIds));
    } catch (error) {
        console.error('Failed to save completed problems:', error);
    }
};

const initialState: ProblemsState = {
    filter: '',
    difficulty: 'All',
    selectedTopic: 1, // Default to Array (id: 1)
    selectedPattern: 1, // Default to All Patterns (id: 1)
    completedProblemIds: loadCompletedProblems(),
};

const problemsSlice = createSlice({
    name: 'problems',
    initialState,
    reducers: {
        setFilter(state, action: PayloadAction<string>) {
            state.filter = action.payload;
        },
        setDifficulty(state, action: PayloadAction<ProblemsState['difficulty']>) {
            state.difficulty = action.payload;
        },
        setTopic(state, action: PayloadAction<number | null>) {
            state.selectedTopic = action.payload;
        },
        setPattern(state, action: PayloadAction<number | null>) {
            state.selectedPattern = action.payload;
        },
        toggleProblemCompletion(state, action: PayloadAction<string>) {
            const problemId = action.payload;
            const index = state.completedProblemIds.indexOf(problemId);
            if (index !== -1) {
                state.completedProblemIds.splice(index, 1); // Remove if exists
            } else {
                state.completedProblemIds.push(problemId); // Add if not exists
                // Update streak when completing a problem
                updateStreak();
            }
            // Save to localStorage
            saveCompletedProblems(state.completedProblemIds);
        },
    },
});

export const { setFilter, setDifficulty, setTopic, setPattern, toggleProblemCompletion } = problemsSlice.actions;
export default problemsSlice.reducer;
