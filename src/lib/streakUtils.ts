/**
 * Utility functions for tracking user progress and streaks
 */

interface StreakData {
    currentStreak: number;
    lastCompletionDate: string | null;
    dailyCompletions: Record<string, number>; // date -> count
}

const STREAK_KEY = 'dsa_streak_data';
const DAILY_GOAL = 5;

/**
 * Load streak data from localStorage
 */
export const loadStreakData = (): StreakData => {
    try {
        const saved = localStorage.getItem(STREAK_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Failed to load streak data:', error);
    }

    return {
        currentStreak: 0,
        lastCompletionDate: null,
        dailyCompletions: {},
    };
};

/**
 * Save streak data to localStorage
 */
export const saveStreakData = (data: StreakData): void => {
    try {
        localStorage.setItem(STREAK_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save streak data:', error);
    }
};

/**
 * Get today's date in YYYY-MM-DD format
 */
const getTodayString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

/**
 * Check if two dates are consecutive days
 */
const areConsecutiveDays = (date1: string, date2: string): boolean => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
};

/**
 * Update streak when a problem is completed
 */
export const updateStreak = (): StreakData => {
    const data = loadStreakData();
    const today = getTodayString();

    // Update daily completion count
    data.dailyCompletions[today] = (data.dailyCompletions[today] || 0) + 1;

    // Update streak
    if (data.lastCompletionDate === null) {
        // First ever completion
        data.currentStreak = 1;
    } else if (data.lastCompletionDate === today) {
        // Already completed today, no streak change
        // Streak stays the same
    } else if (areConsecutiveDays(data.lastCompletionDate, today)) {
        // Consecutive day, increment streak
        data.currentStreak += 1;
    } else {
        // Broke the streak, reset to 1
        data.currentStreak = 1;
    }

    data.lastCompletionDate = today;
    saveStreakData(data);
    return data;
};

/**
 * Get today's completion count
 */
export const getTodayCompletions = (): number => {
    const data = loadStreakData();
    const today = getTodayString();
    return data.dailyCompletions[today] || 0;
};

/**
 * Get daily goal progress (e.g., "3/5")
 */
export const getDailyGoalProgress = (): { completed: number; total: number } => {
    const completed = getTodayCompletions();
    return { completed, total: DAILY_GOAL };
};

/**
 * Get streak count
 */
export const getCurrentStreak = (): number => {
    const data = loadStreakData();
    const today = getTodayString();

    // Check if streak is still valid (completed today or yesterday)
    if (data.lastCompletionDate === null) {
        return 0;
    }

    if (data.lastCompletionDate === today) {
        return data.currentStreak;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    if (data.lastCompletionDate === yesterdayString) {
        return data.currentStreak;
    }

    // Streak broken if not completed today or yesterday
    return 0;
};
