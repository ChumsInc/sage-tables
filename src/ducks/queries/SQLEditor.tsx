import React, {useEffect} from 'react';
import Editor, {useMonaco,} from '@monaco-editor/react';


export interface SQLEditorProps {
    sql: string;
    readonly?: boolean;
    onChange: (value?: string) => void;
    onExecute: (sql: string) => void;
}

const SQLEditor = ({sql, readonly, onChange, onExecute}: SQLEditorProps) => {
    const monaco = useMonaco();
    useEffect(() => {
        if (monaco) {
            monaco.editor.addEditorAction({
                id: 'save',
                run: (editor) => {
                    onExecute(editor.getValue())
                },
                contextMenuGroupId: 'unknown',
                label: 'Save',
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter]
            })
            console.log(monaco);
        }
    }, [monaco]);
    return (
        <Editor onChange={onChange} value={sql} height="30vh" defaultLanguage="sql"/>
    )
}

export default SQLEditor;
