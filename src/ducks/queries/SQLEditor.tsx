import {useEffect, useState} from 'react';
import Editor, {useMonaco} from '@monaco-editor/react';
import type {IDisposable} from 'monaco-editor'
import {useTheme} from "@/hooks/useTheme";


export interface SQLEditorProps {
    queryKey: string;
    sql: string;
    readonly?: boolean;
    onChange: (value?: string) => void;
    onExecute: (sql: string, queryKey: string) => void;
}

const SQLEditor = ({queryKey, sql, onChange, onExecute}: SQLEditorProps) => {
    const monaco = useMonaco();
    const [action, setAction] = useState<IDisposable | null>(null);
    const theme = useTheme();
    useEffect(() => {
        if (monaco) {
            const action = monaco.editor.addEditorAction({
                id: 'save',
                run: (editor) => {
                    onExecute(editor.getValue(), queryKey)
                },
                contextMenuGroupId: 'unknown',
                label: 'Save',
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter]
            })
            setAction(action);
        }
        return () => {
            if (action) {
                action.dispose();
            }
        }
    }, [monaco, queryKey]);
    return (
        <div className="border rounded p-2 mb-2">
            <Editor onChange={onChange} value={sql} height="20vh" defaultLanguage="sql"
                    theme={theme === 'dark' ? 'vs-dark' : 'vs'}/>
        </div>
    )
}

export default SQLEditor;
