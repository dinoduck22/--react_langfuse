import React, {useState, useRef, useCallback, useMemo} from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import styles from './layout/Models.module.css';
import CustomPagination from "./CustomPagination.tsx";

interface ExportData {
    name: string;
    status: string;
    downloadUrl: string;
    format: string;
    createdBy: string;
    log: string;
}

const Exports: React.FC = () => {
    const gridRef = useRef<AgGridReact>(null);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const pageSizes = useMemo(() => [10, 20, 30, 40, 50], []);

    const [rowData] = useState<ExportData[]>([]);

    const [columnDefs] = useState<ColDef[]>([
        { field: 'name', headerName: 'Name', flex: 2 },
        { field: 'status', headerName: 'Status', flex: 1 },
        { field: 'downloadUrl', headerName: 'Download URL', flex: 2 },
        { field: 'format', headerName: 'Format', flex: 1 },
        { field: 'createdBy', headerName: 'Created By', flex: 1.5 },
        { field: 'log', headerName: 'Log', flex: 1 },
    ]);

    const defaultColDef = useMemo(() => ({
        resizable: true,
        sortable: true,
        minWidth: 100,
    }), []);

    const overlayNoRowsTemplate = useMemo(() => {
        return `<span style="padding: 10px; border: 1px solid #444; background: #2b2b3d;">No results.</span>`;
    }, []);

    const icons = {
       paginationFirst: () => <ChevronsLeft size={18} />,
       paginationPrev: () => <ChevronLeft size={18} />,
       paginationNext: () => <ChevronRight size={18} />,
       paginationLast: () => <ChevronsRight size={18} />,
    };

    const onGridReady = useCallback((event: GridReadyEvent) => {
         setGridApi(event.api);
     }, []);

    return (
        <div className={styles.container}>
            <h3>Exports</h3>
            <p>Export large datasets in your preferred format via the export buttons across Langfuse. Exports are processed asynchronously and remain available for download for one hour. You will receive an email notification once your export is ready.</p>

            <div className={`ag-theme-alpine ${styles.gridContainer}`}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={pageSizes[0]}
                    suppressPaginationPanel={true}
                    onGridReady={onGridReady}
                    overlayNoRowsTemplate={overlayNoRowsTemplate} // ✅ 템플릿 적용
                />
            </div>
            {gridApi && <CustomPagination gridApi={gridApi} pageSizes={pageSizes} />}
        </div>
    );
};

export default Exports;