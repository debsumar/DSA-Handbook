import { apiSlice } from '../api/apiSlice';

export interface Topic {
    id: number;
    name: string;
}

export interface Pattern {
    id: number;
    name: string;
}

export interface Problem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    description: string;
    link: string;
    tags: string[];
    complexity: {
        time: string;
        space: string;
    };
    topicIds: number[];
    patternIds: number[];
}

export interface ProblemsData {
    topics: Topic[];
    patterns: Pattern[];
    problems: { [key: string]: Problem };
}

export const problemsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProblems: builder.query<Problem[], void>({
            query: () => 'problems.json',
            transformResponse: (response: any) => {
                // Handle both old array format and new object format
                if (Array.isArray(response)) return response;
                // Convert problems object to array
                if (response.problems) {
                    return Object.values(response.problems);
                }
                return [];
            },
        }),
        getProblemsData: builder.query<ProblemsData, void>({
            query: () => 'problems.json',
        }),
        getProblemById: builder.query<Problem, string>({
            query: () => 'problems.json',
            transformResponse: (response: any, _, arg) => {
                let problems: Problem[] = [];
                if (Array.isArray(response)) {
                    problems = response;
                } else if (response.problems) {
                    problems = Object.values(response.problems);
                }
                const problem = problems.find((p: Problem) => p.id === arg);
                if (!problem) {
                    throw new Error(`Problem with id ${arg} not found`);
                }
                return problem;
            },
        }),
    }),
});

export const { useGetProblemsQuery, useGetProblemsDataQuery, useGetProblemByIdQuery } = problemsApi;
