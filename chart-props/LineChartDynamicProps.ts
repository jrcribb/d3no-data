export interface LineChartDynamicProps {
  data?: {
    x: Date;
    y: number;
  }[];
  datasets?: {
    label: string;
    color: string;
    data: {
      x: Date;
      y: number;
    }[];
  }[];
  type?: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  width?: number;
  height?: number;
  axesColor?: string;
  addLabel?: boolean;
  axesFontSize?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  yAxisMin?: number;
  yAxisMax?: number;
  yAxisAuto?: boolean;
  axesLabelColor?: string;
  axesLabelSize?: string;
  animation?: boolean;
  animationDuration?: number;
  addTooltip?: boolean;
  fontFamily?: string;
  addTitle?: boolean;
  setTitle?: string;
  setTitleColor?: string;
  addLegend?: boolean;
  updateTrigger?: number;
}
