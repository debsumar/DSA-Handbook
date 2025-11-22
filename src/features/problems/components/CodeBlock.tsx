import { Highlight, themes } from 'prism-react-renderer';
import { useTheme } from '../../../hooks/useTheme';

interface CodeBlockProps {
    code: string;
    language: string;
}

export const CodeBlock = ({ code, language }: CodeBlockProps) => {
    const { resolvedTheme } = useTheme();
    const prismTheme = resolvedTheme === 'dark' ? themes.vsDark : themes.vsLight;

    return (
        <Highlight theme={prismTheme} code={code} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre style={style} className={`${className} p-4 rounded-md overflow-auto text-sm font-mono border border-[var(--border-color)]`}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                            <span className="mr-4 opacity-30 select-none w-4 inline-block text-right">{i + 1}</span>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
};
