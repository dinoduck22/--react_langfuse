# Tracing
Writer [dinoduck22](https://github.com/dinoduck22)

<aside>
💡Span 페이지는 별도로 구현하지 못했습니다. 
</aside>

### Tracing 페이지 (`/src/Pages/Tracing/Tracing.jsx`)

| API Name            | 트레이스 목록 조회                                                                |
| ------------------- | ------------------------------------------------------------------------- |
| **Authentication**  | public Key\:secret Key                                                    |
| **Endpoint**        | `/api/public/traces`                                                      |
| **Docs**            | [링크](https://api.reference.langfuse.com/#tag/trace/get/api/public/traces) |
| **Method**          | GET                                                                       |
| **Notes**           | `.env` 파일에 저장된 API Key를 사용하여 트레이스 목록을 가져옵니다.                              |
| **Parameters**      | -                                                                         |
| **Project**         | -                                                                         |
| **Response Format** | JSON                                                                      |
| **Status**          | Active                                                                    |
| **Tags**            | -                                                                         |

| API Name            | 트레이스 상세 정보 조회                                                                           |
| ------------------- | --------------------------------------------------------------------------------------- |
| **Authentication**  | public Key\:secret Key                                                                  |
| **Endpoint**        | `/api/public/traces/{traceId}`                                                          |
| **Docs**            | [링크](https://api.reference.langfuse.com/#tag/trace/get/api/public/traces/%7BtraceId%7D) |
| **Method**          | GET                                                                                     |
| **Notes**           | `.env` 파일에 저장된 API Key를 사용하여 생성된 트레이스가 서버에 완전히 저장되었는지 확인(폴링)하기 위해 주기적으로 호출됩니다.          |
| **Parameters**      | `{traceId}`                                                                             |
| **Project**         | -                                                                                       |
| **Response Format** | JSON                                                                                    |
| **Status**          | Active                                                                                  |
| **Tags**            | -                                                                                       |

| API Name            | 트레이스 삭제                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------ |
| **Authentication**  | public Key\:secret Key                                                                     |
| **Endpoint**        | `/api/public/traces/{traceId}`                                                             |
| **Docs**            | [링크](https://api.reference.langfuse.com/#tag/trace/delete/api/public/traces/%7BtraceId%7D) |
| **Method**          | DELETE                                                                                     |
| **Notes**           | `.env` 파일에 저장된 API Key를 사용하여 ID를 기반으로 특정 트레이스를 삭제합니다.                                      |
| **Parameters**      | `{traceId}`                                                                                |
| **Project**         | -                                                                                          |
| **Response Format** | JSON                                                                                       |
| **Status**          | Active                                                                                     |
| **Tags**            | -                                                                                          |


### 0. 연결된 API 목록

1. **트레이스 목록 조회 (`fetchTraces`)**
    - **설명**: Langfuse에 저장된 모든 트레이스 목록을 가져옵니다.
    - **파일명**: `src/Pages/Tracing/TracingApi.js`
    - **공식 문서**: [https://api.reference.langfuse.com/#tag/trace/get/api/public/traces](https://api.reference.langfuse.com/#tag/trace/get/api/public/traces)
    
2. **트레이스 삭제 (`deleteTrace`)**
    - **설명**: ID를 기반으로 특정 트레이스를 삭제합니다.
    - **파일명**: `src/Pages/Tracing/TracingApi.js`
    - **공식 문서**: [https://api.reference.langfuse.com/#tag/trace/delete/api/public/traces/{traceId}](https://api.reference.langfuse.com/#tag/trace/delete/api/public/traces/%7BtraceId%7D)
    
3. **트레이스 상세 정보 조회 (`fetchTraceDetails`)**
    - **설명**: `TraceDetailPanel`에서 사용되며, 생성된 트레이스가 서버에 완전히 저장되었는지 확인(폴링)하기 위해 주기적으로 호출됩니다.
    - **파일명**: `src/Pages/Tracing/TraceDetailApi.js`
    - **공식 문서**: [https://api.reference.langfuse.com/#tag/trace/get/api/public/traces/{traceId}](https://api.reference.langfuse.com/#tag/trace/get/api/public/traces/%7BtraceId%7D)
    
4. **프로젝트 정보 조회 (`getProjects`)**
    - **설명**: 'New Trace' 버튼 클릭 시, 생성될 트레이스가 속할 프로젝트의 ID를 가져오기 위해 사용됩니다.
    - **파일명**: `src/api/Settings/ProjectApi.js`
    - **공식 문서**: [https://api.reference.langfuse.com/#tag/projects/get/api/public/projects](https://api.reference.langfuse.com/#tag/projects/get/api/public/projects)

### 1. 함수 기능 설명

1. **`useState` Hooks**:
    - **`activeTab`**: 'Traces', 'Observations' 탭 간의 전환을 관리합니다.
    - **`selectedTrace`**: 사용자가 선택한 Trace의 상세 정보를 저장하고, 상세 패널 표시 여부를 결정합니다.
    - **`traces`**: API로부터 받아온 Trace 목록 데이터를 저장합니다.
    - **`isLoading`, `error`**: 데이터 로딩 상태 및 발생한 에러를 관리합니다.
    - **`searchQuery`, `searchType`**: 검색어와 검색 유형('IDs / Names', 'Full Text')을 관리합니다.
    - **`isColumnModalOpen`**: 컬럼 표시 여부를 설정하는 모달의 상태를 관리합니다.
    - **`favoriteState`**, **`selectedRows`**: 즐겨찾기 상태와 테이블에서 체크박스로 선택된 행의 상태를 관리합니다.
    - **`pendingTraceId`**: 'New Trace' 버튼으로 생성된 후, 아직 서버에서 처리 중인 Trace의 ID를 저장하여 폴링(polling)하는데 사용됩니다.
    - **`builderFilters`**: 고급 필터 빌더의 조건을 저장합니다.
    - **`projectId`**: 현재 프로젝트의 ID를 저장합니다.
2. **`useMemo` Hooks**:
    - **`allEnvironments`**: 전체 트레이스 목록에서 중복을 제거한 환경 목록을 생성합니다.
    - **`filteredTraces`**: 검색어, 환경 필터, 시간 범위, 고급 필터 조건에 따라 화면에 표시될 트레이스 목록을 동적으로 계산합니다.
    - **`visibleColumns`**: 사용자가 선택한 컬럼만 테이블에 표시하기 위해 컬럼 목록을 필터링합니다.
3. **`useEffect` Hooks**:
    - **`loadTraces`**: 페이지가 처음 로드될 때 `fetchTraces` API를 호출하여 트레이스 목록을 가져옵니다.
    - **`pendingTraceId`**: `pendingTraceId`가 변경되면, 해당 ID의 트레이스 상세 정보를 주기적으로(2초 간격) 폴링하여 서버 처리가 완료되었는지 확인하고, 완료되면 전체 목록을 새로고침합니다. 30초 후 타임아웃 처리됩니다.
4. **`useCallback` Hooks**:
    - **`loadTraces`**: API를 통해 트레이스 목록을 비동기적으로 가져오는 함수입니다. 의존성이 변경될 때만 함수를 재생성하여 불필요한 리렌더링을 방지합니다.
    - **`toggleFavorite`**: 특정 트레이스의 즐겨찾기 상태를 토글합니다.
    - **`handleDeleteTrace`**: `deleteTrace` API를 호출하여 특정 트레이스를 삭제하고, 성공 시 목록에서 제거합니다.
5. **기타 함수**:
    - **`handleCreateClick`**: `createTrace` 함수를 호출하여 새로운 트레이스를 생성하고, 반환된 ID를 `pendingTraceId`에 저장하여 폴링을 시작합니다.
    - **`handleUpdateClick`**: `prompt`를 통해 사용자로부터 ID를 입력받아 해당 트레이스를 업데이트합니다.
    - **`handleRowClick`**: 테이블의 행을 클릭했을 때 해당 트레이스의 상세 정보를 `selectedTrace`에 저장하여 상세 패널을 엽니다.

### 2. 연결된 컴포넌트 목록

1. **`DataTable`** (`/src/components/DataTable/DataTable.jsx`)
    - **연결 방식**: Tracing 페이지의 메인 콘텐츠 영역에 위치하며, 필터링된 트레이스 목록(`filteredTraces`)과 표시할 컬럼 정보(`visibleColumns`)를 props로 전달받아 테이블 형태로 렌더링합니다.
    - **주요 기능**: 데이터 표시, 행 선택, 체크박스, 즐겨찾기, 삭제 기능 등을 담당합니다.
2. **`SearchInput`** (`/src/components/SearchInput/SearchInput.jsx`)
    - **연결 방식**: 필터 바에 위치하며, `searchQuery`와 `searchType` 상태를 업데이트하는 함수를 props로 전달받습니다.
    - **주요 기능**: 사용자가 입력한 검색어와 검색 유형(ID/Name, Full Text)을 관리합니다.
3. **`FilterControls`** (`/src/components/FilterControls/FilterControls.jsx`)
    - **연결 방식**: `SearchInput` 옆에 위치하며, 새로고침, 환경 필터, 시간 범위 필터, 고급 필터 빌더 컴포넌트를 포함하는 컨테이너 역할을 합니다.
    - **주요 기능**: 다양한 필터 컴포넌트들을 그룹화하여 표시합니다.
4. **`TraceDetailPanel`** (`/src/Pages/Tracing/TraceDetailPanel.jsx`)
    - **연결 방식**: `ReactDOM.createPortal`을 통해 App의 최상위 레벨에 렌더링됩니다. `selectedTrace` 상태가 유효한 값을 가질 때 화면 우측에 슬라이드 형식으로 나타납니다.
    - **주요 기능**: 선택된 트레이스의 상세 정보(타임라인, 입/출력, 메타데이터 등)를 표시합니다.
5. **`ColumnVisibilityModal`** (`/src/Pages/Tracing/ColumnVisibilityModal.jsx`)
    - **연결 방식**: 'Columns' 버튼 클릭 시 `isColumnModalOpen` 상태가 true가 되어 모달이 표시됩니다.
    - **주요 기능**: 사용자가 테이블에 표시할 컬럼을 선택하거나 해제할 수 있는 인터페이스를 제공합니다.