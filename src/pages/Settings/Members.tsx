import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {ColDef, GridApi, GridReadyEvent, ICellRendererParams} from 'ag-grid-community';
import {Plus, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import commonStyles from './layout/SettingsCommon.module.css'
import gridStyles from './layout/SettingsGrid.module.css'
import styles from './layout/Members.module.css'
import CustomPagination from "./CustomPagination";
import ColumnMenu from "../../layouts/ColumnMenu";
import Modal from '../../components/Modal/Modal'
import NewMemberForm from './form/NewMemberForm'

interface Member {
    id: string;
    name: string;
    email: string;
    organizationRole: 'Owner' | 'Admin' | 'Member' | 'Viewer' | 'None';
    projectRole: string;
    memberSince: string;
}

const DUMMY_MEMBERS_DATA: Member[] = [
  { id: '1', name: 'Na Youngseok', email: 'youngseok@naver.com', organizationRole: 'Owner', projectRole: 'N/A on plan', memberSince: '2025-08-01' },
  // 페이지네이션 테스트를 위해 데이터 추가
  ...Array.from({ length: 30 }, (_, i) => ({
      id: `${i + 2}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      organizationRole: (['Admin', 'Member'] as const)[i % 2],
      projectRole: 'N/A on plan',
      memberSince: '2025-08-01',
  })),
];

// Name
const NameRenderer: React.FC<ICellRendererParams> = (props) => (
    <div className = { styles.nameCell }>
        <span>{ props.value }</span>
    </div>
)

// Organization Role
const OrganizationRoleRenderer: React.FC<ICellRendererParams> = (props) => (
    <div className = { styles.roleCell }>
        <select defaultValue ={ props.value } className = { styles.roleSelect }>
            <option>Owner</option>
            <option>Admin</option>
            <option>Member</option>
            <option>Viewer</option>
            <option>None</option>
        </select>
    </div>
)

const ActionsRenderer: React.FC = () => {
    return (
        <div className = { styles.actionRenderer }>
            <button className = { styles.actionButton }>
                <Trash2 size = { 16 } />
            </button>
        </div>
    )
}

const COLUMN_DEFINITIONS: (ColDef & { headerName: string; field: string; lockVisible?: boolean })[] = [
    { field: 'name', headerName: 'Name', cellRenderer: NameRenderer, flex: 2, resizable: true, sortable: true, lockVisible: true },
    { field: 'email', headerName: 'Email', flex: 3, resizable: true, sortable: true, lockVisible: true },
    { field: 'organizationRole', headerName: 'Organization Role', cellRenderer: OrganizationRoleRenderer, flex: 2, resizable: true, sortable: true, lockVisible: true },
    { field: 'projectRole', headerName: 'Project Role', flex: 2, resizable: true, sortable: true, lockVisible: true },
    { field: 'memberSince', headerName: 'Member Since', flex: 1, resizable: true, sortable: true },
    { field: 'actions', headerName: 'Actions', cellRenderer: ActionsRenderer, flex: 1, resizable: false, sortable: false, lockVisible: true },
]

const Members: React.FC = () => {
    const gridRef = useRef<AgGridReact>(null);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const pageSizes = useMemo(() => [10, 20, 30, 40, 50], []);

    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
    const columnButtonRef = useRef<HTMLDivElement>(null);

    const [rowData, setRowData] = useState<Member[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setRowData(DUMMY_MEMBERS_DATA);
    }, []);

    const [columnVisibility, setColumnVisibility] = useState({
        name: true,
        email: true,
        organizationRole: true,
        projectRole: true,
        memberSince: true,
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
            <h3>Project Members</h3>
            <div className = { gridStyles.header }>
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
                <button className = { `${ gridStyles.headerButton } ${ gridStyles.addButton }` }>
                    <Plus size = { 16 } /> Add new member
                </button>
            </div>

            <div className = { `ag-theme-alpine ${ gridStyles.gridContainer }` }>
                <AgGridReact
                    ref = { gridRef }
                    rowData = { rowData }
                    columnDefs = { columnDefs }
                    pagination = { true }
                    paginationPageSize = { pageSizes[0] }
                    suppressPaginationPanel = { true }
                    onGridReady = { onGridReady }
                    icons = { icons }
                    domLayout = 'autoHeight'
                />
            </div>

            <Modal
                title = "Add new member to the organization"
                isOpen = { isModalOpen }
                onClose = { () => setIsModalOpen(false) }
            >
                <NewMemberForm onClose = { () => setIsModalOpen(false) } />
            </Modal>
            { gridApi && <CustomPagination gridApi = { gridApi } pageSizes = { pageSizes } /> }
        </div>
    );
};

export default Members;