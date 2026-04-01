import {saveAs} from "file-saver";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentQueryData} from "@/ducks/queries/queriesSlice.ts";
import {useCallback} from "react";

export interface DownloadTSVButtonProps {
    queryKey: string;
    format: 'tsv' | 'json'
}

export default function DownloadDataButton({queryKey, format}: DownloadTSVButtonProps) {
    const data = useAppSelector(selectCurrentQueryData);
    const downloadTSVHandler = useCallback(() => {
        const values = data.map(row => Object.values(row).join('\t')).join('\r\n');
        const file = new Blob([values]);
        saveAs(file, `query-${queryKey}.txt`);
    }, [data, queryKey])

    const downloadJSONHandler = useCallback(() => {
        const values = JSON.stringify(data, undefined, 2);
        const file = new Blob([values]);
        saveAs(file, `query-${queryKey}.json`);
    }, [data, queryKey])

    const downloadHandler = format === 'tsv' ? downloadTSVHandler : downloadJSONHandler

    return (
        <button type="button" className="btn btn-sm btn-outline-secondary"
                onClick={downloadHandler}
                disabled={data.length === 0}>
            {format === 'tsv' && <span>Download TSV</span>}
            {format === 'json' && <span>Download JSON</span>}
        </button>
    )
}
