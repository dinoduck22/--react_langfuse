// src/data/dummyAddWidgetModal.ts

// 위젯 데이터 타입을 정의하고 export하여 다른 파일에서 재사용할 수 있게 합니다.
export type Widget = {
  id: string;
  name: string;
  description: string;
  viewType: string;
  chartType: string;
};

// 모달에 표시될 위젯 목록 데이터입니다.
export const DUMMY_WIDGETS: Widget[] = [
  {
    id: 'widget-1',
    name: 'Count (Traces)',
    description: 'Shows the count of Traces',
    viewType: 'Traces',
    chartType: 'Line Chart (Time Series)',
  },
  {
    id: 'widget-2',
    name: 'Total Cost ($)',
    description: 'Total cost across all use cases',
    viewType: 'Traces',
    chartType: 'Area Chart (Time Series)',
  },
  {
    id: 'widget-3',
    name: 'Cost by Model Name ($)',
    description: 'Total cost broken down by model name',
    viewType: 'Observations',
    chartType: 'Vertical Bar Chart (Time Series)',
  },
  // 필요에 따라 이곳에 더 많은 위젯 데이터를 추가할 수 있습니다.
];