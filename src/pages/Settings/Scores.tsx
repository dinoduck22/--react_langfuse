import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef, ICellRendererParams, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Plus, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import commonStyles from './layout/SettingsCommon.module.css'
import gridStyles from './layout/SettingsGrid.module.css'
import CustomPagination from './CustomPagination.tsx';
import ColumnMenu from "../../layouts/ColumnMenu.tsx";
import Modal from '../../components/Modal/Modal.tsx'
import NewScoreForm from './form/NewScoreForm.tsx'

interface ScoreConfig {
    id: number;
    name: string;
    dataType: 'BOOLEAN' | 'CATEGORICAL' | 'NUMERIC';
    range: Record<string, string> | string;
    configID: string;
    createdAt: string;
    description: string;
    status: 'Active' | 'Archived';
}

const DUMMY_SCORES_DATA: ScoreConfig[] = [
  { id: 1, name: 'tonality_correct', dataType: 'BOOLEAN', range: { '0': 'False', '1': 'True' }, description: '', configID: 'cme6tgxo0006pad07qehe7noo', createdAt: '2025-08-01', status: 'Active' },
  { id: 2, name: 'answer_correct', dataType: 'BOOLEAN', range: { '0': 'False', '1': 'True' }, description: '', configID: 'cme6tgxo0006pad07qehe7noo', createdAt: '2025-08-01', status: 'Active' },
  { id: 3, name: 'test-july44th', dataType: 'CATEGORICAL', range: { '0': 'test1', '1': 'test2', '2': 'test3' }, description: 'To provide context to annotato...', configID: 'cme6tgxo0006pad07qehe7noo', createdAt: '2025-08-01', status: 'Active' },
  { id: 4, name: 'First Pass', dataType: 'CATEGORICAL', range: { '0': 'Good Output', '1': 'Bad Output', '2': 'Saved for Later' }, description: '', configID: 'cme6tgxo0006pad07qehe7noo', createdAt: '2025-08-01', status: 'Active' },
  { id: 5, name: 'is_question', dataType: 'BOOLEAN', range: { '0': 'False', '1': 'True' }, description: 'Is the user message a question?', configID: 'cme6tgxo0006pad07qehe7noo', createdAt: '2025-08-01', status: 'Active' },
];

// Range
const RangeRenderer: React.FC<ICellRendererParams<ScoreConfig, ScoreConfig['range']>> = (props) => {
    const rangeData = props.value;
    let displayValue = '';

    if (typeof rangeData === 'object' && rangeData !== null) {
        displayValue = JSON.stringify(rangeData);
    } else if (typeof rangeData === 'string') {
        displayValue = rangeData;
    }

    return (
        <div className = { commonStyles.simpleTokenizerCell }>
            {displayValue}
        </div>
    );
};

const ActionsRenderer: React.FC = () => {
    return (
        <div style = { { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' } }>
            <button style = { { background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' } }>
                <Trash2 size = { 16 } />
            </button>
        </div>
    )
}

const COLUMN_DEFINITIONS: (ColDef & { headerName: string; field: string })[] = [
    { field: 'name', headerName: 'Name', flex: 2, resizable: true, sortable: true },
    { field: 'dataType', headerName: 'Data Type', flex: 1.5, resizable: true, sortable: true },
    { field: 'range', headerName: 'Range', cellRenderer: RangeRenderer, flex: 3, resizable: true, autoHeight: true },
    { field: 'description', headerName: 'Description', flex: 3, resizable: true },
    { field: 'configID', headerName: 'Config ID', flex: 3, resizable: true },
    { field: 'createdAt', headerName: 'Created At', flex: 1, resizable: true },
    { field: 'status', headerName: 'Status', flex: 1, resizable: true, sortable: true },
    { field: 'actions', headerName: 'Action', cellRenderer: ActionsRenderer, flex: 1, resizable: false, sortable: false, },
]

const Scores: React.FC = () => {
    const gridRef = useRef<AgGridReact>(null);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const pageSizes = useMemo(() => [10, 20, 30, 40, 50], []);

    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
    const columnButtonRef = useRef<HTMLDivElement>(null);

    const [rowData, setRowData] = useState<ScoreConfig[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setRowData(DUMMY_SCORES_DATA);
    }, []);

    const [columnVisibility, setColumnVisibility] = useState({
        name: true,
        dataType: true,
        range: true,
        description: true,
        configID: true,
        createdAt: true,
        status: true,
        actions: true,
    });

    const toggleColumnVisibility = (field: keyof typeof columnVisibility) => {
        const columnDef = COLUMN_DEFINITIONS.find(c => c.field === field);
        if (columnDef?.lockVisible) {
            return;
        }
         setColumnVisibility(prev => ({ ...prev, [field]: !prev[field] }));
     };

    const toggleAllColumns = (select: boolean) => {
        const newVisibility = { ...columnVisibility };
        COLUMN_DEFINITIONS.forEach(col => {
            if (!col.lockVisible) {
                newVisibility[col.field as keyof typeof columnVisibility] = select;
            }
        });
        setColumnVisibility(newVisibility);
    };

    const visibleColumnCount = useMemo(() => {
        return Object.values(columnVisibility).filter(isVisible => isVisible).length;
    }, [columnVisibility]);

    const mandatoryFields = useMemo(() =>
        COLUMN_DEFINITIONS.filter(c => c.lockVisible).map(c => c.field),
    []);

    const columnDisplayNames = useMemo(() =>
        COLUMN_DEFINITIONS.reduce((acc, col) => {
            if (col.field) {
                acc[col.field] = col.headerName;
            }
            return acc;
        }, {} as Record<string, string>),
    []);

    const columnDefs = useMemo((): ColDef[] =>
        COLUMN_DEFINITIONS.map(col => ({
            ...col,
            hide: !columnVisibility[col.field as keyof typeof columnVisibility],
        })),
    [columnVisibility]);

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
        <div className = { commonStyles.container }>
            <h3>Score Configs</h3>
            <p>Score configs define which scores are available for annotation in your project. Please note that all score configs are immutable.</p>
            <div className = { gridStyles.header }>
                {/* ✅ Columns 버튼을 div로 감싸서 position 기준점으로 만듦 */}
                <div ref = { columnButtonRef } className = { gridStyles.columnsButtonWrapper } onClick={() => setIsColumnMenuOpen(prev => !prev)}>
                    <button
                        className = { `${ gridStyles.headerButton } ${ gridStyles.columnsButton }` }
                    >
                        <span>Columns</span>
                        <span className = { gridStyles.count }>{ visibleColumnCount }/{ COLUMN_DEFINITIONS.length }</span>
                    </button>
                    <ColumnMenu
                        isOpen = { isColumnMenuOpen }
                        onClose = { () => setIsColumnMenuOpen(false) }
                        anchorE1 = { columnButtonRef }
                        columnVisibility = { columnVisibility }
                        toggleColumnVisibility = { toggleColumnVisibility }
                        displayNames = { columnDisplayNames }
                        mandatoryFields = { mandatoryFields }
                        onToggleAll = { toggleAllColumns }
                    />
                </div>
                <button onClick = { () => setIsModalOpen(true) } className = { `${ gridStyles.headerButton} ${ gridStyles.addButton }` } >
                    <Plus size = { 16 } /> Add new score config
                </button>
            </div>

            <div className = { `ag-theme-alpine ${gridStyles.gridContainer }` }>
                <AgGridReact
                    ref = { gridRef }
                    rowData = { rowData }
                    columnDefs = { columnDefs }
                    suppressRowClickSelection = { true }
                    icons = { icons }
                    rowHeight = { 96 }
                    onGridReady = { onGridReady }
                    domLayout = 'autoHeight'
                />
            </div>

            <Modal
                title = "Add new score config"
                isOpen = { isModalOpen }
                onClose = { () => setIsModalOpen(false) }
            >
                <NewScoreForm onClose = { () => setIsModalOpen(false) } />
            </Modal>
            { gridApi && <CustomPagination gridApi = { gridApi } pageSizes = { pageSizes } /> }
        </div>
    );
};

export default Scores;