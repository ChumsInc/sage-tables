import React, {useEffect, useState} from 'react';
import Editor, {useMonaco} from '@monaco-editor/react';
import {IDisposable} from 'monaco-editor'
import {useMediaQuery} from "@mui/material";


export interface SQLEditorProps {
    queryKey: string;
    sql: string;
    readonly?: boolean;
    onChange: (value?: string) => void;
    onExecute: (sql: string, queryKey: string) => void;
}

const SQLEditor = ({queryKey, sql, readonly, onChange, onExecute}: SQLEditorProps) => {
    const monaco = useMonaco();
    const [action, setAction] = useState<IDisposable|null>(null);
    const [theme, setTheme] = useState<string>('vs');
    const matches = useMediaQuery('(prefers-color-scheme: dark)');
    useEffect(() => {
        setTheme(matches ? 'vs-dark' : 'vs')
    },[matches])
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
        <Editor onChange={onChange} value={sql} height="30vh" defaultLanguage="sql" theme={theme}/>
    )
}

export default SQLEditor;
