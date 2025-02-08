export interface LogViewerProps {
    text: string;
    className?: string;
    style?: any;
}

export default function LogViewer({ text, style, className }: LogViewerProps) {
    return (
        <div className={"flex-1 overflow-auto"}>
            <pre style={style} className={className}>
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
        </div>
    );
}
