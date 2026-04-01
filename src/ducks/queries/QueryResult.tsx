import {useAppSelector} from "@/app/configureStore.ts";
import QueryDuration from "./QueryDuration";
import {selectCurrentQueryDataLength, selectCurrentQueryDuration} from "@/ducks/queries/queriesSlice.ts";
import DownloadDataButton from "@/ducks/queries/DownloadDataButton.tsx";
import {Col, Row} from "react-bootstrap";
import QueryResultContext from "@/ducks/queries/QueryResultContext.tsx";


export default function QueryResult({queryKey}: { queryKey: string }) {
    const dataLength = useAppSelector(selectCurrentQueryDataLength);
    const duration = useAppSelector(selectCurrentQueryDuration);

    return (
        <div className="query-results-container" key={queryKey}>
            <Row className="g-3 align-items-center mb-3">
                <Col xs="auto">
                    Duration: <QueryDuration duration={duration}/>
                </Col>
                <Col xs="auto">
                    Rows: {dataLength}
                </Col>
                <Col/>
                <Col xs="auto">
                    <DownloadDataButton queryKey={queryKey} format="tsv"/>
                </Col>
                <Col xs="auto">
                    <DownloadDataButton queryKey={queryKey} format="json"/>
                </Col>
            </Row>
            <QueryResultContext/>
        </div>
    )
}
