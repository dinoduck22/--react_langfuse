import React, {useState, useCallback, useRef, useMemo, useEffect} from 'react'
import { ColDef, ICellRendererParams, GridReadyEvent, GridApi } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
    Plus,
    GitCommitHorizontal,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';
import commonStyles from './layout/SettingsCommon.module.css'
import gridStyles from './layout/SettingsGrid.module.css'
import styles from './layout/Models.module.css';
import CustomPagination from './CustomPagination';
import ColumnMenu from '../../layouts/ColumnMenu'
import SidePanel from "../../components/SidePanel/SidePanel";
import NewModelForm, { ModelData } from './form/NewModelForm'

interface ModelDefinition {
    modelName: string;
    matchPattern: string;
    pries: {
        input?: number;
        output?: number;
        [key: string]: number | undefined;
    };
    tokenizer: string;
    tokenizerConfig: Record<string, string>;
    lastUsed?: string;
}

// Maintainer 아이콘
const MaintainerRenderer: React.FC<ICellRendererParams> = () => (
    <div className = { styles.maintainerCell }>
        <GitCommitHorizontal size = { 16 } color = "#ef444" />
    </div>
);

// 가격
const PricesRenderer: React.FC<ICellRendererParams> = (props) => (
    <div className = { styles.pricesCell }>
        <div><span>input</span> ${ props.data.inputPrice.toFixed(4) }</div>
        <div><span>output</span> ${ props.data.outputPrice.toFixed(4) }</div>
    </div>
)

// Tokenizer 설정
const TokenizerConfRenderer: React.FC<ICellRendererParams> = ({ data }) => {
    const config = data.tokenizerConfig;
    const entries = Object.entries(config);

    return (
        <div className = { commonStyles.simpleTokenizerCell }>
            { entries.map(([key, value]) => (
                <div key = { key }>
                    { `{${ key }: "${ value }"` }
                </div>
            ))}
        </div>
    );
};

// Actions 버튼
const ActionsRenderer: React.FC<ICellRendererParams> = (props) => {
    return (
        <div className = { styles.cellCenter }>
            <button className = { styles.cloneButton }>Clone</button>
        </div>
    );
};

const DUMMY_MODEL_MODELS = [
    { modelName: 'babbage-002', matchPattern: '(?i)^(babbage-002)$', inputPrice: 0.000004, outputPrice: 0.000016, tokenizer: 'openai', tokenizerConfig: { tokenizerModel: "babbage-002" }, lastUsed: '2025-08-10' },
    { modelName: 'chat-bison', matchPattern: '(?i)^(chat-bison)(@[a-za-Z0-9_-]+)?$', inputPrice: 0.00000025, outputPrice: 0.00000050, tokenizer: 'google', tokenizerConfig: {}, lastUsed: '2025-08-11' },
    { modelName: 'chat-bison-32k', matchPattern: '(?i)^(chat-bison-32k)(@[a-za-Z0-9_-]+)?$', inputPrice: 0.00000025, outputPrice: 0.00000050, tokenizer: 'google', tokenizerConfig: {}, lastUsed: '2025-08-11' },
    { modelName: 'chatgpt-4o-latest', matchPattern: '(?i)^(chatgpt-4o-latest)$', inputPrice: 0.000005, outputPrice: 0.000015, tokenizer: 'openai', tokenizerConfig: { "tokensPerMessage": 1, "tokenizerModel": "gpt-4o" }, lastUsed: '2025-08-12' },
    { modelName: 'claude-1.1', matchPattern: '(?i)^(claude-1.1)$', inputPrice: 0.000008, outputPrice: 0.000024, tokenizer: 'claude', tokenizerConfig: {}, lastUsed: '2025-08-09' },
    ...Array.from({ length: 15 }, (_, i) => ({
        modelName: `test-model-${i + 1}`,
        matchPattern: `(?i)^(test-model-${i + 1})$`,
        inputPrice: 0.00001 + i * 0.000001,
        outputPrice: 0.00002 + i * 0.000002,
        tokenizer: ['openai', 'claude', 'google'][i % 3],
        tokenizerConfig: { model: `test-${i}`},
        lastUsed: `2025-07-${15 + i}`
    }))
];

const COLUMN_DEFINITIONS: (ColDef & { headerName: string; field: string; lockVisible?: boolean})[] = [
    { field: 'modelName', headerName: 'Model Name', width: 150, cellStyle: { 'fontWeight': 'bold' }, lockVisible: true },
    { field: 'maintainer', headerName: 'Maintainer', width: 10, cellRenderer: MaintainerRenderer, lockVisible: true },
    { field: 'matchPattern', headerName: 'Match Pattern', width: 150, lockVisible: true },
    { field: 'prices', headerName: 'Prices per unit', width: 150, cellRenderer: PricesRenderer },
    { field: 'tokenizer', headerName: 'Tokenizer', width: 120 },
    { field: 'tokenizerConfig', headerName: 'Tokenizer Config', width: 250, cellRenderer: TokenizerConfRenderer, autoHeight: true },
    { field: 'lastUsed', headerName: 'Last used', width: 100 },
    { field: 'actions', headerName: 'Actions', width: 100, cellRenderer: ActionsRenderer, sortable: false, resizable: false, lockVisible: true },
]

const Models: React.FC = () => {
    const gridRef = useRef<AgGridReact>(null);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const pageSizes = useMemo(() => [10, 20, 30, 40, 50], []);

    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
    const columnButtonRef = useRef<HTMLDivElement>(null);

    const [rowData, setRowData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setRowData(DUMMY_MODEL_MODELS);
    }, []);

    const handleSaveModel = (newModelData: ModelData) => {
        const newModel: ModelDefinition = {
            ...newModelData,
            tokenizerConfig: {}, // 기본값 또는 폼에서 추가된 값
            lastUsed: new Date().toISOString().split('T'[0]),
        };
        setRowData(prevData => [...prevData, newModel]);
        setIsModalOpen(false);
    };

    const [columnVisibility, setColumnVisibility] = useState({
        modelName: true,
        maintainer: true,
        matchPattern: true,
        prices: true,
        tokenizer: true,
        tokenizerConfig: true,
        lastUsed: true,
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

    const defaultColDef = useMemo(() => ({
        minWidth: 50,
        resizable: true,
        sortable: true,
    }), []);

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
            <h3>Models</h3>
            <p>A model represents a LLM model. It is used to calculate tokens and cost.</p>
            <div className = { gridStyles.header }>
                {/* ✅ Columns 버튼을 div로 감싸서 position 기준점으로 만듦 */}
                <div ref = { columnButtonRef } className = { gridStyles.columnsButtonWrapper } onClick={() => setIsColumnMenuOpen(prev => !prev)}>
                    <button className = { `${ gridStyles.headerButton } ${ gridStyles.columnsButton }` }>
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
                    <Plus size = { 16 } /> Add model definition
                </button>
            </div>

            <div className = { `ag-theme-alpine ${ gridStyles.gridContainer }` }>
                <AgGridReact
                    ref = { gridRef }
                    rowData = {rowData}
                    columnDefs = { columnDefs }
                    defaultColDef = { defaultColDef }
                    pagination = { true }
                    paginationPageSize = { pageSizes[0] }
                    suppressPaginationPanel = { true }
                    onGridReady = { onGridReady }
                    icons = { icons }
                    rowHeight = { 96 }
                    domLayout = 'autoHeight'
                />
            </div>

            <SidePanel
                isOpen = { isModalOpen }
                onClose = { () => setIsModalOpen(false) }
            >
                <NewModelForm
                    onSave = { handleSaveModel }
                    onCancel = { () => setIsModalOpen(false) }
                />
            </SidePanel>
            { gridApi && <CustomPagination gridApi={ gridApi } pageSizes={ pageSizes } />}
        </div>
    );
};

export default Models;