import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import QueryDuration from "./QueryDuration";
import {TablePagination} from "@chumsinc/sortable-tables";
import {
    selectCurrentQueryDataLength,
    selectCurrentQueryDuration,
    selectCurrentQueryPaginationProps,
    updateQuery
} from "@/ducks/queries/index.ts";
import DownloadDataButton from "@/ducks/queries/DownloadDataButton.tsx";
import {Col, Row} from "react-bootstrap";
import QueryResultContext from "@/ducks/queries/QueryResultContext.tsx";


export default function QueryResult({queryKey}: { queryKey: string }) {
    const dispatch = useAppDispatch();
    const dataLength = useAppSelector(selectCurrentQueryDataLength);
    const paginationProps = useAppSelector(selectCurrentQueryPaginationProps);
    const duration = useAppSelector(selectCurrentQueryDuration);

    const pageChangeHandler = (page: number) => {
        dispatch(updateQuery({key: queryKey, page}));
    }

    const rowsPerPageChangeHandler = (rowsPerPage: number) => {
        dispatch(updateQuery({key: queryKey, rowsPerPage}));
    }

    return (
        <div className="query-results-container" key={queryKey}>
            <Row className="g-3 align-items-center mb-3">
                <Col xs="auto">
                    Duration: <QueryDuration duration={duration}/>
                </Col>
                <Col xs="auto">
                    <DownloadDataButton queryKey={queryKey} format="tsv"/>
                </Col>
                <Col xs="auto">
                    <DownloadDataButton queryKey={queryKey} format="json"/>
                </Col>
                <Col className="justify-content-end">
                    <TablePagination page={paginationProps.page} onChangePage={pageChangeHandler} size="sm"
                                     rowsPerPage={paginationProps.rowsPerPage}
                                     rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}
                                     showFirst showLast
                                     count={dataLength}/>
                </Col>
            </Row>
            <QueryResultContext/>
        </div>
    )
}
