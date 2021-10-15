import KEYS from '../../../constants/keys';

const OOB_SPACE = 10;

export default function createOutOfBounds({ models, context }) {
  const { chartModel, colorService, layoutService } = models;
  const viewHandler = chartModel.query.getViewHandler();
  const { rtl } = context;
  const oobPositions = {
    xMin: -0.005,
    xMax: 1.005,
    yMin: 1.005,
    yMax: -0.005,
  };
  let xAxisMax;
  let xAxisMin;
  let yAxisMax;
  let yAxisMin;

  const oobDefinition = !layoutService.meta.isBigData
    ? {
        key: KEYS.COMPONENT.OUT_OF_BOUNDS,
        type: 'point',
        data: {
          collection: KEYS.COLLECTION.MAIN,
          filter: (d) => {
            // getting axis min/max from viewHandler here as dataView is not initialized
            ({ xAxisMin, xAxisMax, yAxisMin, yAxisMax } = viewHandler.getDataView());
            return d.x.value < xAxisMin || d.x.value > xAxisMax || d.y.value < yAxisMin || d.y.value > yAxisMax;
          },
        },
        settings: {
          x: {
            scale: KEYS.SCALE.X,
            fn: ({ datum }) => {
              if (datum.x.value < xAxisMin) {
                return rtl ? oobPositions.xMax : oobPositions.xMin;
              }
              if (datum.x.value > xAxisMax) {
                return rtl ? oobPositions.xMin : oobPositions.xMax;
              }
              return rtl
                ? (datum.x.value - xAxisMax) / (xAxisMin - xAxisMax)
                : (datum.x.value - xAxisMin) / (xAxisMax - xAxisMin);
            },
          },
          y: {
            scale: KEYS.SCALE.Y,
            fn: ({ datum }) => {
              if (datum.y.value < yAxisMin) {
                return oobPositions.yMin;
              }
              if (datum.y.value > yAxisMax) {
                return oobPositions.yMax;
              }
              return 1 - (datum.y.value - yAxisMin) / (yAxisMax - yAxisMin);
            },
          },
          size: {
            fn: () => '6px',
          },
          fill: colorService.getColor(),
        },
        preferredSize: () => ({
          edgeBleed: {
            top: OOB_SPACE,
            bottom: OOB_SPACE,
            left: OOB_SPACE,
            right: OOB_SPACE,
          },
        }),
        beforeRender: ({ size }) => {
          // can be changed back to 2 * size.h (size.w) if we want to render it in the middle of the oob space;
          // 1.5 * size.h (size.w) to render it near the edge of the oob space like for old scatterplot
          oobPositions.xMin = -OOB_SPACE / (1.5 * size.width);
          oobPositions.xMax = 1 - oobPositions.xMin;
          oobPositions.yMax = -OOB_SPACE / (1.5 * size.height);
          oobPositions.yMin = 1 - oobPositions.yMax;
        },
      }
    : undefined;

  return oobDefinition;
}