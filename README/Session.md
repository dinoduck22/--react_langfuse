# Session

Writer [dinoduck22](https://github.com/dinoduck22)

### Session 페이지 (`/src/Pages/Tracing/Sessions/Sessions.jsx`)

| API Name            | 세션 목록 조회                                                                       |
| ------------------- | ------------------------------------------------------------------------------ |
| **Authentication**  | public Key\:secret Key                                                         |
| **Endpoint**        | `/api/public/sessions`                                                         |
| **Docs**            | [링크](https://api.reference.langfuse.com/#tag/sessions/get/api/public/sessions) |
| **Method**          | GET                                                                            |
| **Notes**           | `.env` 파일에 저장된 API Key를 사용하여 모든 세션 목록을 가져옵니다.                                  |
| **Parameters**      | -                                                                              |
| **Project**         | -                                                                              |
| **Response Format** | JSON                                                                           |
| **Status**          | Active                                                                         |
| **Tags**            | -                                                                              |

| API Name            | 세션 상세 정보 조회                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| **Authentication**  | public Key\:secret Key                                                                         |
| **Endpoint**        | `/api/public/sessions/{sessionId}`                                                             |
| **Docs**            | [링크](https://api.reference.langfuse.com/#tag/sessions/get/api/public/sessions/%7BsessionId%7D) |
| **Method**          | GET                                                                                            |
| **Notes**           | `.env` 파일에 저장된 API Key를 사용하여 특정 세션에 속한 모든 트레이스의 상세 정보를 가져옵니다.                                  |
| **Parameters**      | `{sessionId}`                                                                                  |
| **Project**         | -                                                                                              |
| **Response Format** | JSON                                                                                           |
| **Status**          | Active                                                                                         |
| **Tags**            | -                                                                                              |

### 0. 연결된 API 목록

1. **세션 목록 조회 (`fetchSessions`)**
    - **설명**: Langfuse에 저장된 모든 세션 목록을 가져옵니다.
    - **파일명**: `src/Pages/Tracing/Sessions/SessionApi.js`
    - **공식 문서**: [https://api.reference.langfuse.com/#tag/sessions](https://api.reference.langfuse.com/#tag/sessions)

2. **세션 상세 정보 조회 (`fetchSessionDetails`)**
    - **설명**: `SessionDetail` 페이지에서 사용되며, 특정 세션에 속한 모든 트레이스의 상세 정보를 가져옵니다.
    - **파일명**: `src/Pages/Tracing/Sessions/SessionDetailApi.js`
    - **공식 문서**: [https://api.reference.langfuse.com/#tag/sessions/get/api/public/sessions/{sessionId}](https://api.reference.langfuse.com/#tag/sessions/get/api/public/sessions/%7BsessionId%7D)

### 1. 함수 기능 설명

1. **`useState` Hooks**:
    - **`sessions`**: API로부터 받아온 세션 목록 데이터를 저장합니다.
    - **`isLoading`, `error`**: 데이터 로딩 상태 및 발생한 에러를 관리합니다.
    - **`selectedSessionId`**: 사용자가 선택한 세션의 ID를 저장합니다.
    - **`isColumnVisibleModalOpen`**: 컬럼 표시 여부를 설정하는 모달의 상태를 관리합니다.
    - **`columns`**: 테이블에 표시될 컬럼의 정보와 표시 여부(`visible`)를 관리합니다.
    - **`startDate`, `endDate`**: 날짜 범위 필터의 시작일과 종료일을 관리합니다.
    - **`favoriteState`**, **`selectedRows`**: 즐겨찾기 상태와 테이블에서 체크박스로 선택된 행의 상태를 관리합니다.
    - **`builderFilters`**: 고급 필터 빌더의 조건을 저장합니다.
2. **`useEffect` Hooks**:
    - **`loadSessions`**: 페이지가 처음 로드될 때 `fetchSessions` API를 호출하여 세션 목록을 가져옵니다.
3. **`useMemo` Hooks**:
    - **`visibleColumns`**: 사용자가 선택한 컬럼만 테이블에 표시하기 위해 컬럼 목록을 필터링합니다.
4. **기타 함수**:
    - **`loadSessions`**: `fetchSessions` API를 호출하여 세션 목록을 비동기적으로 가져오는 함수입니다.
    - **`toggleFavorite`**: 특정 세션의 즐겨찾기 상태를 토글합니다.
    - **`toggleColumnVisibility`**, **`setAllColumnsVisible`**: 컬럼의 개별 또는 전체 표시 여부를 변경합니다.

### 2. 연결된 컴포넌트 목록

1. **`DataTable`** (`/src/components/DataTable/DataTable.jsx`)
    - **연결 방식**: Session 페이지의 메인 콘텐츠 영역에 위치하며, 세션 목록(`sessions`)과 표시할 컬럼 정보(`visibleColumns`)를 props로 전달받아 테이블 형태로 렌더링합니다.
    - **주요 기능**: 데이터 표시, 행 선택, 체크박스, 즐겨찾기 기능을 담당합니다.
2. **`FilterControls`** (`/src/components/FilterControls/FilterControls.jsx`)
    - **연결 방식**: 테이블 상단의 필터 바에 위치하며, 새로고침, 고급 필터 빌더 등의 컴포넌트를 포함합니다.
    - **주요 기능**: 다양한 필터 컴포넌트들을 그룹화하여 표시합니다.
3. **`DateRangePicker`** (`/src/components/DateRange/DateRangePicker.jsx`)
    - **연결 방식**: 필터 바에 위치하며, `startDate`와 `endDate` 상태를 props로 받아 날짜 범위를 표시하고, 변경 시 부모의 상태를 업데이트합니다.
    - **주요 기능**: 사용자가 특정 기간을 선택하여 데이터를 필터링할 수 있는 UI를 제공합니다.
4. **`ColumnVisibilityModal`** (`/src/Pages/Tracing/ColumnVisibilityModal.jsx`)
    - **연결 방식**: 'Columns' 버튼 클릭 시 `isColumnVisibleModalOpen` 상태가 true가 되어 모달이 표시됩니다.
    - **주요 기능**: 사용자가 테이블에 표시할 컬럼을 선택하거나 해제할 수 있는 인터페이스를 제공합니다.