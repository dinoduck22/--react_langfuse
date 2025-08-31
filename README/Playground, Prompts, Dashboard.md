# Playground, Prompts, Dashboard

Writer [dinoduck22](https://github.com/dinoduck22)

# 0. 연결된 API 목록

| API Name | 프롬프트 목록 조회 |
| :--- | :--- |
| **Authentication** | public Key:secret Key |
| **Endpoint** | `/api/public/v2/prompts` |
| **Docs** | - |
| **Method** | GET |
| **Notes** | `.env` 파일에 저장된 API Key를 사용합니다. |
| **Parameters** | - |
| **Project** | - |
| **Response Format** | JSON |
| **Status** | Active |
| **Tags** | - |


| API Name | 특정 프롬프트 버전 목록 조회 |
| :--- | :--- |
| **Authentication** | public Key:secret Key |
| **Endpoint** | `/api/public/v2/prompts/{promptName}` |
| **Docs** | - |
| **Method** | GET |
| **Notes** | `.env` 파일에 저장된 API Key를 사용합니다. |
| **Parameters** | - |
| **Project** | - |
| **Response Format** | JSON |
| **Status** | Active |
| **Tags** | - |


| API Name | 새 프롬프트 또는 새 버전 생성 |
| :--- | :--- |
| **Authentication** | public Key:secret Key |
| **Endpoint** | `/api/public/v2/prompts/{promptName}` |
| **Docs** | - |
| **Method** | POST |
| **Notes** | `.env` 파일에 저장된 API Key를 사용합니다. |
| **Parameters** | - |
| **Project** | - |
| **Response Format** | JSON |
| **Status** | Active |
| **Tags** | - |


| API Name | 기존 프롬프트를 기반으로 새 버전 생성 |
| :--- | :--- |
| **Authentication** | public Key:secret Key |
| **Endpoint** | `/api/public/v2/prompts/{name}/versions/{version}` |
| **Docs** | - |
| **Method** | PATCH |
| **Notes** | `.env` 파일에 저장된 API Key를 사용합니다. |
| **Parameters** | - |
| **Project** | - |
| **Response Format** | JSON |
| **Status** | Active |
| **Tags** | - |


| API Name | 지표 데이터 조회 |
| :--- | :--- |
| **Authentication** | public Key:secret Key |
| **Endpoint** | `/api/public/metrics` |
| **Docs** | - |
| **Method** | GET |
| **Notes** | `.env` 파일에 저장된 API Key를 사용합니다. 기존 프롬프트를 기반으로 새 버전 생성 할때도 사용합니다. |
| **Parameters** | - |
| **Project** | Dashboard |
| **Response Format** | JSON |
| **Status** | Active |
| **Tags** | - |

### 0.1. Playground 연결된 API

Playground 페이지는 직접적으로 Langfuse API를 호출하기보다는, 설정된 LLM 모델을 테스트하는 데 중점을 둡니다. 따라서 LLM 제공업체(예: OpenAI, Anthropic)의 API를 호출하는 기능이 내재되어 있으나, Langfuse API와의 직접적인 연동은 프롬프트 저장 기능 등에서 간접적으로 이루어집니다.

- `src/pages/Playground/SavePromptPopover.tsx`에서 `fetchPrompts` API를 호출하여 기존 프롬프트 목록을 가져옵니다.

### 0.2 Prompts 연결된 API

| API 설명 | 파일명 | Langfuse 공식 API |
| --- | --- | --- |
| **프롬프트 목록 조회** | `src/pages/Prompts/promptsApi.ts` | `langfuse.api.promptsList`, `langfuse.api.promptsGet` |
| **특정 프롬프트 버전 목록 조회** | `src/pages/Prompts/promptsApi.ts` | `langfuse.api.promptsGet` |
| **새 프롬프트 또는 새 버전 생성** | `src/pages/Prompts/PromptsNewApi.ts` | `langfuse.api.promptsCreate` |
| **기존 프롬프트를 기반으로 새 버전 생성** | `src/pages/Prompts/promptsApi.ts` | `langfuse.api.promptsCreate` |

### 0.3. Dashboard 연결된 API

| API 설명 | 파일명 | Langfuse 공식 문서 |
| --- | --- | --- |
| **지표 데이터 조회** | `src/pages/Dashboards/metricsApi.ts` | (Langfuse 공식 문서에 Metrics API 관련 내용이 있다면 추가) |
- **설명**: 대시보드 위젯에 표시될 데이터를 조회하는 API입니다. `fetchMetrics` 함수는 파라미터로 받은 `view`, `metrics`, `filters` 등의 조건을 조합하여 Langfuse의 Metrics API(`GET /api/public/metrics`)를 호출하고, 그 결과를 반환합니다.

---

<aside>
💡 Playground, Prompts는 jsx로 변경한 게 있습니다. 
Dashboard는 tsx로 되어있습니다. (변경 필요)

</aside>

# 1. Playground 페이지

### 1.1. 함수 기능 설명

- **`useState` Hooks**:
    - **`panels`**: `PlaygroundComponent`의 배열을 관리하며, 각 패널은 고유 ID(`Date.now()`)를 가집니다. 이를 통해 여러 테스트 패널을 동적으로 추가하고 삭제할 수 있습니다.
    - **`messages`**: `ChatBox` 컴포넌트에 표시될 메시지 배열(`ChatMessage[]`)의 상태를 관리합니다.
    - **`isLlmModalOpen`**: 'Add LLM Connection' 모달(`NewLlmConnectionModal`)의 열림/닫힘 상태를 제어합니다.
    - **`modalType`**: 'tool' 또는 'schema' 생성 모달(`NewItemModal`)의 표시 여부와 유형을 관리합니다.
    - **`activePanel`**: 'Tools', 'Schema' 등 현재 활성화된 설정 패널의 이름을 저장하여 UI를 토글합니다.
    - **`isSavePopoverOpen`**: 프롬프트 저장 팝업(`SavePromptPopover`)의 표시 여부를 관리합니다.
    - **`attachedTools`, `availableTools`**: 모델에 연결된 Tool과 연결 가능한 Tool 목록의 상태를 관리합니다.
    - **`attachedUserSchema`, `availableSchemas`**: 모델에 적용된 Schema와 적용 가능한 Schema 목록의 상태를 관리합니다.
- **Handler Functions**:
    - **`addPanel`, `removePanel`**: `panels` 상태를 업데이트하여 테스트 패널을 추가하거나 삭제합니다. 마지막 패널은 삭제되지 않습니다.
    - **`resetPlayground`**: `panels` 상태를 초기 상태(패널 1개)로 되돌립니다.
    - **`togglePanel(panelName)`**: `activePanel` 상태를 변경하여 Tools 또는 Schema 설정 패널을 열거나 닫습니다.
    - **`handleAddTool`, `handleRemoveTool`**: `attachedTools` 상태를 업데이트하여 모델에 Tool을 추가하거나 제거합니다.
    - **`handleAddSchema`, `handleRemoveSchema`**: `attachedUserSchema` 상태를 업데이트하여 모델에 Schema를 적용하거나 제거합니다.

### 1.2. 연결된 컴포넌트

| 컴포넌트명 | 파일 경로 | 연결 방식 및 설명 |
| --- | --- | --- |
| **PlaygroundPanel** | `src/pages/Playground/PlaygroundPanel.tsx` | Tools, Schema 등 각 설정 패널의 UI를 구성하는 컴포넌트입니다. 제목과 설명을 props로 받아 표시합니다. |
| **NewLlmConnectionModal** | `src/pages/Playground/NewLlmConnectionModal.tsx` | 새로운 LLM 연결을 추가할 때 사용되는 모달 컴포넌트입니다. |
| **NewItemModal** | `src/pages/Playground/NewItemModal.tsx` | 새로운 Tool 또는 Schema를 생성할 때 사용되는 모달 컴포넌트입니다. |
| **SavePromptPopover** | `src/pages/Playground/SavePromptPopover.tsx` | 작성한 프롬프트를 저장할 때 나타나는 팝업 컴포넌트입니다. |
| **ChatBox** | `src/components/ChatBox/ChatBox.tsx` | 사용자 입력, 시스템 메시지 등 대화 형식의 프롬프트를 작성하고 관리하는 핵심 UI 컴포넌트입니다. |

## 1.3 미완료

### 기능

1. Tool, View, Vriables 기능 및 API 목록 불러오기, 저장 연결
    - tool, schema 생성하는 창의 Parameter 부분 입력창
        - code block 컴포넌트로 변경
        - Prettify 버튼 기능 적용
2. 저장 아이콘 (프롬프트 담당분이 하실것)
    - Save as new Prompts, Save as new prompts version API 저장 연결
    - Prompts 검색 가능한지 확인
3. message, Placeholder에 따라 input 값으로 전달 되는 submit 버튼
    - input 값에 {{}} 사용시 variables로 들어가는 기능
4. Run All
    - Add panel로 다수의 panel이 동시에 submit되어 작동되는 기능
5. LLM 모델 불러오기 API 연결
    - 모델 연결해서 submit 되는 기능
6. LLM 모델 더해서 생성하기 연결
    - Setting LLM New Model 창으로 이동 연결 (추천)
7. 모델 고급 설정 창
    - Promtps와 동일한 창입니다. (주의)

### UI (우선순위 낮음)

1. Submit 버튼 파랑색인것을 다른 UI와 통일감 있게 변경

---

# 2. Prompts 페이지

### 2.1. 함수 기능 설명

- **`useState` Hooks**:
    - **`prompts`**: API를 통해 받아온 프롬프트 목록(`DisplayPrompt[]`)을 저장하고 관리합니다.
    - **`isLoading`, `error`**: 데이터 로딩 상태와 에러 발생 시 에러 메시지를 관리합니다.
    - **`promptToDelete`**: 삭제 확인 UI를 표시하기 위해 사용자가 삭제하려는 프롬프트 객체를 임시 저장합니다.
    - **`searchType`**, **`searchQuery`**: `SearchInput` 컴포넌트와 연동되어 검색 유형('Names, Tags' 등)과 실제 검색어를 관리합니다.
    - **`selectedVersion`**: 상세 페이지에서 사용자가 선택한 특정 버전의 프롬프트 정보를 저장합니다.
    - **`activeDetailTab`**: 상세 페이지의 오른쪽 패널에서 'Prompt', 'Config' 등 활성화된 탭을 관리합니다.
    - **`isDuplicateModalOpen`**: 프롬프트 복제 모달의 표시 여부를 제어합니다.
    - **`promptName`, `promptType`, `chatContent`, `textContent`, `config`, `labels`, `commitMessage`**: 새 프롬프트/버전 생성 페이지(`PromptsNew.tsx`)에서 각 입력 필드의 상태를 관리합니다.
- **`useEffect` Hooks**:
    - **`loadPrompts`**: `Prompts.tsx` 진입 시, `fetchPrompts` API를 호출하여 프롬프트 목록을 비동기적으로 불러옵니다. API 호출 중 발생할 수 있는 CORS, 인증 오류 등을 처리하여 사용자에게 안내합니다.
    - **`loadPromptData`**: `PromptsDetail.tsx` 진입 시, `useParams`로 얻은 `id`를 사용하여 `fetchPromptVersions` API를 호출하고 해당 프롬프트의 버전 목록을 불러옵니다.
    - **`extractVariables`**: `PromptsNew.tsx`에서 `textContent`나 `chatContent`가 변경될 때마다 `{{변수}}` 형태의 문자열을 추출하여 `variables` 상태를 업데이트합니다.
- **Handler Functions**:
    - **`handleDeleteClick`, `confirmDelete`**: 사용자가 삭제 버튼을 누르면 `promptToDelete` 상태를 설정하여 확인 UI를 띄우고, 최종 확인 시 `prompts` 상태에서 해당 항목을 제거합니다.
    - **`handleSave`**: `PromptsNew.tsx`에서 저장 버튼 클릭 시, `createPromptOrVersion` API를 호출하여 입력된 정보로 새 프롬프트 또는 새 버전을 생성합니다.
    - **`handleNewVersion`**: `PromptsDetail.tsx`에서 'New Version' 버튼 클릭 시, 현재 버전 정보를 `useNavigate`의 `state`에 담아 `/prompts/new` 경로로 전달하며 새 버전 생성 모드로 전환합니다.
    - **`handleDuplicateSubmit`**: `DuplicatePromptModal`에서 'Submit' 버튼 클릭 시 호출되어 프롬프트 복제 로직을 수행합니다.
- **Custom Hooks & `useMemo`**:
    - **`useSearch`**: `Prompts.tsx`에서 검색어(`searchQuery`)와 검색 유형(`searchType`)에 따라 `prompts` 목록을 실시간으로 필터링하는 로직을 처리합니다.
    - **`variables`**: `PromptsDetail.tsx`에서 `selectedVersion`이 변경될 때마다, 프롬프트 내용에서 `{{변수}}`를 추출하여 메모이제이션된 변수 목록을 생성합니다.

### 2.2. 연결된 컴포넌트

| 컴포넌트명 | 파일 경로 | 연결 방식 및 설명 |
| --- | --- | --- |
| **SearchInput** | `src/components/SearchInput/SearchInput.tsx` | 프롬프트 목록(`Prompts.tsx`) 상단에 위치하며, 검색어 및 검색 유형(이름/태그, 전체 텍스트)을 관리합니다. |
| **DuplicatePromptModal** | `src/pages/Prompts/DuplicatePromptModal.tsx` | 프롬프트 상세 페이지(`PromptsDetail.tsx`)에서 프롬프트를 복제할 때 사용되는 모달입니다. |
| **PromptsReference** | `src/pages/Prompts/PromptsReference.tsx` | 프롬프트 생성/수정 페이지(`PromptsNew.tsx`)에서 다른 프롬프트를 참조로 삽입할 때 사용되는 모달입니다. |
| **ChatBox** | `src/components/ChatBox/ChatBox.tsx` | 'Chat' 타입 프롬프트 생성/수정 시 대화 형식의 UI를 제공합니다. |
| **LineNumberedTextarea** | `src/components/LineNumberedTextarea/LineNumberedTextarea.tsx` | 'Text' 타입 프롬프트 및 Config 입력 시 줄 번호가 있는 텍스트 에디터를 제공합니다. |
| **FormPageLayout** | `src/components/Layouts/FormPageLayout.tsx` | 프롬프트 생성/수정 페이지의 전체적인 레이아웃(헤더, 저장/취소 버튼 등)을 구성합니다. |
| **FormGroup** | `src/components/Form/FormGroup.tsx` | 프롬프트 생성/수정 페이지에서 각 입력 필드(Name, Prompt, Config 등)의 UI 단위를 구성합니다. |

## 2.3 미완료

### 기능

<aside>
1️⃣ Prompts.jsx 메인 페이지
</aside>

1. Delete API 연결
    - 버전 많이 쌓이면 삭제되는지 확인(최소 버전 3~4)
    - new version에서 production label 체크 해제 후 생성시 삭제되는지 확인
2. `Filter` 버튼 수정
    - src/compoents/FilterControl/FilterBuilder 폴더의 Filter 사용 (추천)
3. 열 Type에서 값을 API로 들고 오는지 확인
    - chat/Text 되는지 확인
4. observation 갯수 잘 들고 오는지 API 연결 확인

<aside>
2️⃣ PromptsNew.jsx 페이지 → playground 페이지에서 확인
</aside>

1. Metrics 탭 삭제
2. Add Prompt Referece API 연결
    - New Prompts에서 Reference 멘션 기능 구현
3. Linked Generation에 Tracing 연결해서 테이블 뜰 수 있게 수정
    - src/Pages/Tracing/TracingView 파일을 보시는걸 추천합니다
4. `Dataset run` 버튼 구현 및 연결
    - Prompts 검색 기능 구현해야 함
    - 저장 API 연결 create확인
5. `Duplicate` 버튼 API 연결
6. `Prompt 삭제` 버튼 API 연결
    - 해당 버전 삭제
7. Prompt 이전 버전 API로 불러오기 (버전 누적)
8. Playground 버튼 클릭시 페이지 이동
9. Prompt 생성 API 연결
10. Production 라벨 체크 하지 않은 경우 리스트 불러오기 오류 발생 수정
11. Chat/Text 타입 변경에 따라 API 저장 타입 변경
12. Chat 타입일 때 System, User 등 메시지 역할에 맞춰 API 저장
13. LineNumberedTextArea → CodeBlock 컴포넌트로 변경 (추천)
    - New Prompts에 config 입력칸을 변경
14. `Comment` 버튼 기능
    - components/Comments 사용해서 기능 구현 (추천)
15. 검색 기능
    - components/SearchInput 사용해서 기능 구현 (추천)
16. 이전 prompts 페이지랑 화살표로 이동 기능
    - 프롬프트 리스트간에 이동

<aside>
3️⃣ PromptsNew.jsx 페이지 → playground 페이지에서 확인
</aside>

1. playground에서 `저장`버튼
[https://www.notion.so/Playground-Prompts-Dashboard-25eb0cdec7e08082b57dfc8147a63da6?source=copy_link#25eb0cdec7e0803bbc3eca830e9bd3c4](https://www.notion.so/25eb0cdec7e08082b57dfc8147a63da6?pvs=21)
    - Save as new prompt 만들어야함
    - search 확인하기
    - 프롬프트 목록만 불러오는건 → 구현완료됨
    - Save as new prompt version → 구현해야 함

### UI

1. 테이블 페이지 이동 
    - Data Table 컴포넌트에 공통으로 되어있습니다. → 수정주의(공통사용)

---

# Dashboard 페이지

### 3.1. 함수 기능 설명

- **`useState` Hooks**:
    - **`activeTab`**: `Dashboards.tsx`에서 'Dashboards'와 'Widgets' 탭 간의 전환을 관리합니다.
    - **`widgets`, `layouts`**: `DashboardDetail.tsx`에서 `react-grid-layout`에 표시될 위젯의 정보와 레이아웃 상태를 관리합니다.
    - **`widgetData`, `loading`, `error`**: `DashboardDetail.tsx`에서 각 위젯별로 API를 통해 받아온 데이터, 로딩 상태, 에러 상태를 객체 형태로 관리합니다. (예: `widgetData['total-traces']`)
    - **`isAddWidgetModalOpen`**: 위젯 추가 모달(`AddWidgetModal`)의 표시 여부를 제어합니다.
    - **`startDate`, `endDate`**: `DateRangePicker` 컴포넌트와 연동되어 대시보드 전체의 데이터 조회 기간을 관리합니다.
    - **`name`, `description`**: `DashboardNew.tsx` 및 `WidgetNew.tsx`에서 생성할 대시보드 또는 위젯의 이름과 설명 상태를 관리합니다.
    - **`filters`**: `WidgetNew.tsx`에서 위젯 생성 시 적용할 필터 목록을 관리합니다.
- **`useEffect` Hooks**:
    - **`fetchAllWidgetData`**: `DashboardDetail.tsx`에서 `startDate` 또는 `endDate`가 변경될 때마다 실행됩니다. `initialWidgets` 배열을 순회하며 각 위젯에 필요한 파라미터로 `fetchMetrics` API를 호출하고, 받아온 데이터를 `widgetData` 상태에 업데이트합니다.
- **Handler Functions**:
    - **`handleNewButtonClick`**: `Dashboards.tsx`에서 현재 `activeTab`에 따라 'New dashboard' 또는 'New widget' 생성 페이지로 `useNavigate`를 이용해 이동시킵니다.
    - **`handleAddWidget`**: `AddWidgetModal`에서 위젯을 선택하고 추가하면, `widgets`와 `layouts` 상태를 업데이트하여 대시보드에 새 위젯을 렌더링합니다.
    - **`handleDeleteWidget`**: 위젯 카드에서 삭제 버튼 클릭 시, `window.confirm`으로 재확인 후 해당 위젯을 `widgets`와 `layouts` 상태에서 제거합니다.
    - **`handleCopyWidget`**: 위젯 복사 시, 현재 위젯의 설정을 URL 파라미터로 만들어 `WidgetNew.tsx` 페이지로 이동시킵니다.
    - **`handleDownloadWidgetData`**: `downloadAsCSV` 유틸 함수를 호출하여 현재 위젯의 데이터를 CSV 파일로 다운로드합니다.
    - **`handleSave`**: `DashboardNew.tsx` 또는 `WidgetNew.tsx`에서 저장 버튼 클릭 시, 입력된 정보로 새 대시보드/위젯을 생성하는 로직을 수행하고 목록 페이지로 이동합니다.
- **Helper Functions**:
    - **`getApiParamsForWidget`**: 위젯의 ID와 날짜 범위를 기반으로 `fetchMetrics` API 호출에 필요한 파라미터 객체를 생성하여 반환합니다.
    - **`renderChart`**: 위젯의 `chartType`에 따라 적절한 차트 컴포넌트(`LineChart`, `BarChart` 등)를 동적으로 렌더링하고, API 데이터를 props로 전달합니다.

### 3.2. 연결된 컴포넌트

| 컴포넌트명 | 파일 경로 | 연결 방식 및 설명 |
| --- | --- | --- |
| **DashboardsView** | `src/pages/Dashboards/DashboardsView.tsx` | 대시보드 목록을 `DataTable` 컴포넌트를 이용해 테이블 형태로 보여줍니다. |
| **WidgetsView** | `src/pages/Dashboards/WidgetsView.tsx` | 위젯 목록을 `DataTable` 컴포넌트를 이용해 테이블 형태로 보여줍니다. |
| **DataTable** | `src/components/DataTable/DataTable.tsx` | `DashboardsView`와 `WidgetsView`에서 목록을 표시하는 데 사용되는 공용 테이블 컴포넌트입니다. |
| **FormPageLayout** | `src/components/Layouts/FormPageLayout.tsx` | `DashboardNew.tsx`에서 새 대시보드 생성 폼의 전체 레이아웃을 구성합니다. |
| **FormGroup** | `src/components/Form/FormGroup.tsx` | `DashboardNew.tsx`와 `WidgetNew.tsx`에서 각 입력 필드의 UI 단위를 구성합니다. |
| **WidgetCard** | `src/components/Dashboard/WidgetCard.tsx` | `DashboardDetail.tsx`에서 각 위젯을 감싸는 카드 UI 컴포넌트입니다. 드래그 핸들, 복사/삭제/다운로드 버튼을 포함합니다. |
| **AddWidgetModal** | `src/pages/Dashboards/AddWidgetModal.tsx` | `DashboardDetail.tsx`에서 위젯을 추가할 때 사용되는 모달입니다. |
| **DateRangePicker** | `src/components/DateRange/DateRangePicker.tsx` | `DashboardDetail.tsx` 페이지 상단에 위치하며, 데이터 조회 기간을 설정하는 컴포넌트입니다. |
| **Chart 컴포넌트** | `src/components/Chart/` | `DashboardDetail.tsx`의 `renderChart` 함수 내에서 위젯의 `chartType`에 따라 `LineChart`, `BarChart`, `PieChart` 등 다양한 차트 컴포넌트를 동적으로 렌더링합니다. |

## 3.3 미완료

### 기능

<aside>
2️⃣

대시보드

</aside>

1. 대시보드 테이블 리스트 삭제 API 연결
2. 카드 데이터 API 연결 된것 작동 되는지 확인
3. 필터 버튼 수정
    - components/FilterConrtol/FilterBuilder 사용 (추천)
4. 달력 및 Last 7 days 버튼 수정 시 필터 적용
    - 달력 창 클릭시 end, start 날짜 변경 기능
5. 카드 호버시 아이콘 기능
    - 저장 CSV 파일로 저장
    - 삭제 API 연결

<aside>
2️⃣

위젯

</aside>

1. Visualization에서 chart 변경시 위의 Data Selection의 Metrice, Filter, View가 변경 되는 기능
2. 위젯 새로 생성시 NEW WIDGET 버튼 클릭시 목록으로 보이기 API 연결
3. 위젯 탭 버튼 클릭시 테이블에 위젯 리스트 불러오기 API 연결
4. 위젯 저장 API 연결
5. 오른쪽 패널에 있는 기존의 데이터를 불러와서 표 렌더링 API 연결
    - 오른쪽 패널에 필터 적용되어 데이터 그래프 그려지는 기능
    - 오른쪽 패널에 Chart 중 안돼는 Area Chart 삭제
    - 달력 수정 시 데이터 수정 적용