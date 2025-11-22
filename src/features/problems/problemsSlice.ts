import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CompletedProblem {
    id: string;
    completedAt: string; // ISO date string
}

interface ProblemsState {
    filter: string;
    difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
    selectedTopic: number | null;
    selectedPattern: number | null;
    completedProblems: CompletedProblem[];
}

// Load completed problems from localStorage
const loadCompletedProblems = (): CompletedProblem[] => {
    try {
        const saved = localStorage.getItem('completedProblemsV2');
        if (saved) {
            return JSON.parse(saved);
        }

        // Migration from old format (string[])
        const oldSaved = localStorage.getItem('completedProblemIds');
        if (oldSaved) {
            const ids: string[] = JSON.parse(oldSaved);
            const now = new Date().toISOString();
            const migrated = ids.map(id => ({ id, completedAt: now }));
            return migrated;
        }

        return [];
    } catch (error) {
        console.error('Failed to load completed problems:', error);
        return [];
    }
};

// Save completed problems to localStorage
const saveCompletedProblems = (completedProblems: CompletedProblem[]) => {
    try {
        localStorage.setItem('completedProblemsV2', JSON.stringify(completedProblems));
        // Sync to old key for backward compatibility/safety
        localStorage.setItem('completedProblemIds', JSON.stringify(completedProblems.map(p => p.id)));
    } catch (error) {
        console.error('Failed to save completed problems:', error);
    }
};

const initialState: ProblemsState = {
    filter: '',
    difficulty: 'All',
    selectedTopic: 1, // Default to Array (id: 1)
    selectedPattern: 1, // Default to All Patterns (id: 1)
    completedProblems: loadCompletedProblems(),
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
            const index = state.completedProblems.findIndex(p => p.id === problemId);

            if (index !== -1) {
                state.completedProblems.splice(index, 1); // Remove if exists
            } else {
                state.completedProblems.push({
                    id: problemId,
                    completedAt: new Date().toISOString()
                }); // Add if not exists
            }
            // Save to localStorage
            saveCompletedProblems(state.completedProblems);
        },
    },
});

export const { setFilter, setDifficulty, setTopic, setPattern, toggleProblemCompletion } = problemsSlice.actions;
export default problemsSlice.reducer;
