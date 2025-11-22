import { createSlice } from '@reduxjs/toolkit';

interface UserState {
    likedProblems: string[];
}

const initialState: UserState = {
    likedProblems: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleLike(state, action) {
            const id = action.payload;
            if (state.likedProblems.includes(id)) {
                state.likedProblems = state.likedProblems.filter((p) => p !== id);
            } else {
                state.likedProblems.push(id);
            }
        },
    },
});

export const { toggleLike } = userSlice.actions;
export default userSlice.reducer;
