"use dom";

export interface LogViewerProps {
    text: string;
    className?: string;
    style?: any;
}

export default function LogViewer({ text, style }: LogViewerProps) {
    return (
        <pre style={style}>
            <code
                style={{
                    lineBreak: "anywhere",
                    wordBreak: "break-all",
                    whiteSpace: "pre-wrap",
                    fontSize: "14px",
                    lineHeight: 1.25,
                }}
            >
                {text}
            </code>
        </pre>
    );
}
