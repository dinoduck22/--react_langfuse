# Components `src/components`

Writer [dinoduck22](https://github.com/dinoduck22)


| 컴포넌트                     | 역할                                                           | 사용 페이지                                          | 연결 방식                                                                                        |
| ------------------------ | ------------------------------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **AddToDatasetModal**    | Trace/Observation의 Input, Output, Metadata를 데이터셋에 추가하는 모달 UI | `Tracing` (`TraceDetailView.jsx`)               | Trace 상세 패널에서 '+ Add to datasets' 클릭 시 열림. 선택된 Trace의 input/output/metadata를 `CodeBlock`에 표시 |
| **Card**                 | 제목+내용을 담는 카드형 UI 컨테이너                                        | `Home` (`Home.jsx`)                             | 대시보드 카드(Traces, Model Cost, Scores). `onClick`으로 네비게이션                                       |
| **Chart**                | 영역/막대/라인/파이 등 데이터 시각화 차트                                     | `Home` (`Home.jsx`)                             | `TraceChart.jsx`를 통해 "Traces Over Time" 라인 차트 렌더링                                            |
| **ChatBox**              | 채팅 형식 프롬프트 생성/편집 UI (메시지 추가, 삭제, 드래그 이동)                     | `PromptsNew`, `Playground`                      | 프롬프트 타입이 Chat일 때 `chatContent` 상태 관리. Playground에서 LLM 메시지 입력                                |
| **CodeBlock**            | 줄 번호가 있는 코드 블록 (편집 가능)                                       | `AddToDatasetModal`                             | 모달에서 Input/Output/Metadata 표시 및 편집                                                           |
| **Comments**             | Trace/Observation에 대한 댓글 표시/작성/삭제                            | `Tracing` (`TraceDetailView.jsx` → `SidePanel`) | 댓글 아이콘 클릭 시 `SidePanel`에 렌더링. `useComments` 훅 사용                                             |
| **DataTable**            | 페이징, 정렬, 즐겨찾기, 삭제 포함 테이블 UI                                  | `Tracing`, `Sessions`, `Prompts`                | `columns`와 `data` props를 받아 데이터 렌더링                                                          |
| **DateRange**            | 날짜·시간 범위 선택 캘린더 + 프리셋 UI                                     | `Sessions`, `FilterBuilder`                     | Sessions의 필터 바, FilterBuilder에서 Timestamp 필터로 사용                                             |
| **FilterButton**         | 일관된 스타일의 필터 버튼                                               | `FilterControls` 하위 컴포넌트                        | 드롭다운 열기, 새로고침 등 트리거 버튼                                                                       |
| **FilterControls**       | 여러 필터 컴포넌트(시간, 환경, 빌더, 새로고침)를 묶는 컨테이너                        | `Tracing`, `Sessions`                           | 각 페이지의 필터 바에 위치                                                                              |
| **Form**                 | 라벨+설명+입력을 묶는 폼 레이아웃                                          | `PromptsNew`                                    | 프롬프트 생성 페이지의 Name, Prompt, Config 섹션 구성                                                      |
| **Layouts**              | Breadcrumbs + 폼 영역 + 저장/취소 버튼이 있는 폼 레이아웃                     | `PromptsNew`                                    | 새 프롬프트 생성 페이지 전체 구조                                                                          |
| **LineNumberedTextarea** | 줄 번호가 표시되는 textarea                                          | `PromptsNew`, `NewItemModal`                    | Text 프롬프트, JSON Config, Tool 파라미터/Schema 입력                                                  |
| **Modal**                | 재사용 가능한 모달창                                                  | `Settings` 내 여러 페이지                             | 'Add new\...' 버튼 클릭 시 각 폼 컴포넌트(`NewScoreForm` 등) 포함                                          |
| **PageHeader**           | 모든 페이지 상단 헤더 (조직/프로젝트 이름, 제목, 토글 버튼)                         | `Layout.jsx` (모든 페이지)                           | `Layout`에 포함되어 모든 페이지 상단에 고정                                                                 |
| **ProjectId**            | 프로젝트 ID 없을 시 입력/리디렉션 처리                                      | `App.jsx` (라우팅)                                 | `/playground` 접근 시 `ProjectGate`가 리디렉션/배너 표시                                                 |
| **SearchInput**          | 검색어 입력창 + 검색 유형 드롭다운                                         | `Tracing`, `Prompts`                            | `searchQuery`, `searchType` 상태 관리 → `useSearch` 훅 활용                                         |
| **SidePanel**            | 오른쪽에서 슬라이드되는 패널 UI                                           | `TraceDetailView`, `Settings/Models`            | 댓글 버튼 클릭 시 `Comments` 표시, 모델 추가 시 `NewModelForm` 표시                                          |
| **Toast**                | 화면 하단의 일시적 알림 메시지                                            | `Tracing` (`TraceDetailView.jsx`)               | 클립보드 복사, 댓글 추가/삭제 완료 시 `toastInfo`로 피드백                                                      |
| **TopFilters**           | 상단 바 형태의 주요 필터 UI                                            | `Home`                                          | 대시보드 전체에 적용될 필터 모음                                                                           |
