import type { CompletedProblem } from '../features/problems/problemsSlice';

const DAILY_GOAL = 5;

/**
 * Get today's date in YYYY-MM-DD format
 */
const getTodayString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

/**
 * Get daily completions map (date -> count)
 */
export const getDailyCompletions = (completedProblems: CompletedProblem[]): Record<string, number> => {
    const completions: Record<string, number> = {};
    completedProblems.forEach(p => {
        const date = p.completedAt.split('T')[0];
        completions[date] = (completions[date] || 0) + 1;
    });
    return completions;
};

/**
 * Get today's completion count
 */
export const getTodayCompletions = (completedProblems: CompletedProblem[]): number => {
    const today = getTodayString();
    const completions = getDailyCompletions(completedProblems);
    return completions[today] || 0;
};

/**
 * Get daily goal progress (e.g., "3/5")
 */
export const getDailyGoalProgress = (completedProblems: CompletedProblem[]): { completed: number; total: number } => {
    const completed = getTodayCompletions(completedProblems);
    return { completed, total: DAILY_GOAL };
};

/**
 * Get streak count
 */
export const getCurrentStreak = (completedProblems: CompletedProblem[]): number => {
    const completions = getDailyCompletions(completedProblems);
    const sortedDates = Object.keys(completions).sort();

    if (sortedDates.length === 0) return 0;

    const today = getTodayString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    // Check if the last completion was today or yesterday
    const lastDate = sortedDates[sortedDates.length - 1];
    if (lastDate !== today && lastDate !== yesterdayString) {
        return 0;
    }

    let streak = 1; // Start with 1 since we have at least one valid day (today or yesterday)
    let currentDate = new Date(lastDate);

    // Iterate backwards checking for consecutive days
    for (let i = sortedDates.length - 2; i >= 0; i--) {
        const dateStr = sortedDates[i];
        const date = new Date(dateStr);

        const expectedDate = new Date(currentDate);
        expectedDate.setDate(expectedDate.getDate() - 1);

        // Compare dates (ignoring time)
        if (date.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
            streak++;
            currentDate = date;
        } else {
            break;
        }
    }

    return streak;
};

/**
 * Get activity data for the last 10 days
 * Returns an array of percentages (0-100) based on daily goal
 */
export const getLast10DaysActivity = (completedProblems: CompletedProblem[]): number[] => {
    const completions = getDailyCompletions(completedProblems);
    const today = new Date();

    let maxCount = DAILY_GOAL;
    const last10DaysCounts: number[] = [];

    // Calculate counts for last 10 days
    for (let i = 9; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateString = d.toISOString().split('T')[0];
        const count = completions[dateString] || 0;
        last10DaysCounts.push(count);
        if (count > maxCount) maxCount = count;
    }

    // Normalize to percentages (0-100)
    return last10DaysCounts.map(count => Math.round((count / maxCount) * 100));
};
