import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './root';
import { Home } from '../features/problems/components/Home';
import { ProblemList } from '../features/problems/components/ProblemList';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <ProblemList />,
            },
            {
                path: 'about',
                element: <Home />,
            },
        ],
    },
]);
