import React, { useState, useEffect } from 'react';
import { GridApi } from 'ag-grid-community';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import styles from './layout/CustomPagination.module.css';

interface CustomPaginationProps {
  gridApi: GridApi;
  pageSizes: number[]; // 페이지 크기 옵션을 prop으로 받음
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ gridApi, pageSizes }) => {
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [inputValue, setInputValue] = useState('1');
    const [pageSize, setPageSize] = useState(pageSizes[0] || 10); // 페이지 크기 state 추가

    useEffect(() => {
        if (gridApi) {
            const onPaginationChanged = () => {
                if (!gridApi || gridApi.isDestroyed()) {
                    return;
                }
                setTotalPages(gridApi.paginationGetTotalPages());
                const newCurrentPage = gridApi.paginationGetCurrentPage() + 1;
                setCurrentPage(newCurrentPage);
                setInputValue(newCurrentPage.toString());
                setPageSize(gridApi.paginationGetPageSize());
            };

            gridApi.addEventListener('paginationChanged', onPaginationChanged);;
            onPaginationChanged();

            return () => {
                if (gridApi && !gridApi.isDestroyed()) {
                    gridApi.removeEventListener('paginationChanged', onPaginationChanged);
                }
            };
        }
    }, [gridApi]);

    const onPageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const onPageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const page = parseInt(inputValue, 10);
            if (!isNaN(page) && page > 0 && page <= totalPages) {
                gridApi.paginationGoToPage(page - 1);
            } else {
                setInputValue(currentPage.toString());
            }
        }
    };

  // ✅ 페이지 크기 변경 핸들러 추가
    const onPageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(e.target.value);
        // ✅ setPageSize(newSize); // 이 줄은 paginationChanged 이벤트가 처리하므로 중복임
        // ✅ Deprecated된 paginationSetPageSize 대신 setGridOption 사용
        gridApi.setGridOption('paginationPageSize', newSize);
    };

    const onBtFirst = () => gridApi.paginationGoToFirstPage();
    const onBtPrev = () => gridApi.paginationGoToPreviousPage();
    const onBtNext = () => gridApi.paginationGoToNextPage();
    const onBtLast = () => gridApi.paginationGoToLastPage();

    if (!gridApi || totalPages == 0) {
        return null;
    }

    return (
        <div className={styles.paginationContainer}>
        {/* ✅ 페이지 크기 선택기 추가 */}
            <div className={styles.pageSizeSelector}>
                <span>Rows per page</span>
                <select value={pageSize} onChange={onPageSizeChange} className={styles.pageSizeSelect}>
                    {pageSizes.map(size => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.controlsWrapper}>
                <div className={styles.pageInfo}>
                    <span>Page</span>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={onPageInputChange}
                        onKeyDown={onPageInputKeyDown}
                        onBlur={() => setInputValue(currentPage.toString())}
                        className={styles.pageInput}
                    />
                    <span>of {totalPages}</span>
                </div>
                <div className={styles.buttonGroup}>
                    <button onClick={onBtFirst} disabled={currentPage === 1} className={styles.button}>
                        <ChevronsLeft size={18} />
                    </button>
                    <button onClick={onBtPrev} disabled={currentPage === 1} className={styles.button}>
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={onBtNext} disabled={currentPage === totalPages} className={styles.button}>
                        <ChevronRight size={18} />
                    </button>
                    <button onClick={onBtLast} disabled={currentPage === totalPages} className={styles.button}>
                        <ChevronsRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomPagination;