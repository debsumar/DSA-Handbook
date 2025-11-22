import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-10 text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong.</h2>
                    <p className="text-[var(--text-secondary)] mb-4">{this.state.error?.message}</p>
                    <button
                        className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded hover:bg-[var(--accent-hover)]"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
