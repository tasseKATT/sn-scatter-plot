import KEYS from '../../../constants/keys';

export default function createHeatMap({ models, flags }) {
  const { layoutService, chartModel } = models;
  let binWidthPx;
  let binHeightPx;

  return {
    key: KEYS.COMPONENT.HEAT_MAP,
    type: 'point',
    data: {
      extract: {
        source: KEYS.DATA.BIN,
        field: KEYS.FIELDS.BIN,
        props: {
          x: { field: KEYS.FIELDS.BIN_X },
          y: { field: KEYS.FIELDS.BIN_Y },
          binDensity: { field: KEYS.FIELDS.BIN_DENSITY },
        },
      },
    },
    show: () => layoutService.meta.isBigData && flags.isEnabled('DATA_BINNING'),
    // brush: { consume: [highlight, highlightIntersect, highlightColor] },
    settings: {
      x: {
        scale: KEYS.SCALE.X,
      },
      y: {
        scale: KEYS.SCALE.Y,
      },
      fill: {
        scale: KEYS.SCALE.HEAT_MAP_COLOR,
        fn: (d) => d.scale(d.datum.binDensity.value),
      },
      opacity: 0.8,
      shape: () => ({
        type: 'rect',
        width: binWidthPx,
        height: binHeightPx,
      }),
    },
    beforeRender: ({ size }) => {
      const viewHandler = chartModel.query.getViewHandler();
      const dataView = viewHandler.getDataView();
      const bins = layoutService.getLayoutValue('dataPages')[0];
      const data = bins.slice(1);
      const firstBin = data[0];
      const binWidth = firstBin ? Math.abs(firstBin.qText[0] - firstBin.qText[2]) : 0;
      const binHeight = firstBin ? Math.abs(firstBin.qText[1] - firstBin.qText[3]) : 0;

      binWidthPx = (binWidth * size.width) / (dataView.xAxisMax - dataView.xAxisMin);
      binHeightPx = (binHeight * size.height) / (dataView.yAxisMax - dataView.yAxisMin);
    },
  };
}
