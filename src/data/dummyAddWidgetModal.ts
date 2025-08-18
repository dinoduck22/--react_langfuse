// src/data/dummyAddWidgetModal.ts

export type Widget = {
  id: string;
  name: string;
  description: string;
  viewType: string;
  chartType: string; // 차트 종류를 식별할 키
};

export const DUMMY_WIDGETS: Widget[] = [
  {
    id: 'widget-1',
    name: 'Total Traces',
    description: 'Shows the count of Traces',
    viewType: 'Traces',
    chartType: 'BigNumberChart', // BigNumberChart
  },
  {
    id: 'widget-2',
    name: 'Total Cost',
    description: 'Total cost across all use cases',
    viewType: 'Traces',
    chartType: 'LineChart', // LineChart
  },
  {
    id: 'widget-3',
    name: 'Cost by Model Name',
    description: 'Total cost broken down by model name',
    viewType: 'Observations',
    chartType: 'VerticalBarChart', // VerticalBarChart
  },
  {
    id: 'widget-4',
    name: 'Cost by Environment',
    description: 'Total cost broken down by trace.environment',
    viewType: 'Traces',
    chartType: 'PieChart', // PieChart
  },
];