import {useCallback, useEffect, useState} from 'react';
import Editor, {useMonaco} from '@monaco-editor/react';
import type {IDisposable} from 'monaco-editor'
import {useTheme} from "@/hooks/useTheme";

function waitMs(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export interface SQLEditorProps {
    queryKey: string;
    sql: string;
    readonly?: boolean;
    onChange: (value?: string) => void;
    onExecute: (sql: string, key:string) => void;
}

const SQLEditor = ({queryKey, sql, onChange, onExecute}: SQLEditorProps) => {
    const monaco = useMonaco();
    const [action, setAction] = useState<IDisposable | null>(null);
    const theme = useTheme();
    const submitHandler = useCallback((sql: string) => {
        onExecute(sql, queryKey);
    }, [onExecute, queryKey]);

    useEffect(() => {
        if (monaco) {
            const nextAction = monaco.editor.addEditorAction({
                id: 'save',
                run: (editor) => {
                    submitHandler(editor.getValue())
                },
                contextMenuGroupId: 'unknown',
                label: 'Save',
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter]
            })
            waitMs(500).then(() => {
                setAction(nextAction);
            })

        }
        return () => {
            if (action) {
                action.dispose();
            }
        }
    }, [monaco, action, submitHandler]);

    return (
        <div className="border rounded p-2 mb-2">
            <Editor onChange={onChange} value={sql} height="20vh" defaultLanguage="sql"
                    theme={theme === 'dark' ? 'vs-dark' : 'vs'}/>
        </div>
    )
}

export default SQLEditor;
