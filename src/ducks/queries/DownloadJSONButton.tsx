import {saveAs} from "file-saver";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentQueryData} from "@/ducks/queries/index.ts";
import {useCallback} from "react";

export interface DownloadJSONButtonProps {
    queryKey: string
}

export default function DownloadJSONButton({queryKey}: DownloadJSONButtonProps) {
    const data = useAppSelector(selectCurrentQueryData);
    const downloadJSONHandler = useCallback(() => {
        const values = JSON.stringify(data, undefined, 2);
        const file = new Blob([values]);
        saveAs(file, `query-${queryKey}.json`);
    }, [data, queryKey])

    return (
        <button type="button" className="btn btn-sm btn-outline-secondary ms-3"
                onClick={downloadJSONHandler}
                disabled={data.length === 0}>
            Download JSON
        </button>
    )
}
