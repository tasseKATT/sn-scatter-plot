/* eslint-disable no-param-reassign */
import KEYS from '../../../constants/keys';
import MODES from '../../../constants/modes';
import NUMBERS from '../../../constants/numbers';

export default function createAxes({ models, flags }) {
  const { layoutService, dockService, themeService, chartModel } = models;
  const { xAxis, yAxis } = layoutService.getLayout();
  const enabledPanZoom = flags.isEnabled('panZoom');

  const style = themeService.getStyles();
  const viewHandler = chartModel.query.getViewHandler();
  const trackBy = (node, i) => {
    if (i === 0) return 'axis';
    if (node.type === 'text') {
      return `label: ${node.text}`;
    }
    return `mark: ${node.tickLabel}`;
  };

  const xAxisDefinition =
    !xAxis || xAxis.show === 'none'
      ? false
      : {
          type: 'axis',
          key: KEYS.COMPONENT.X_AXIS,
          scale: KEYS.SCALE.X,
          layout: {
            dock: dockService.meta.x.dock,
            minimumLayoutMode: MODES.AXIS.X,
          },
          settings: {
            labels: {
              show: xAxis.show !== 'title',
              fontFamily: style.axis.label.name.fontFamily,
              fontSize: style.axis.label.name.fontSize,
              fill: style.axis.label.name.color,
            },
            line: {
              stroke: style.axis.line.major.color,
            },
            ticks: {
              stroke: style.axis.line.major.color,
            },
            minorTicks: {
              stroke: style.axis.line.minor.color,
            },
            paddingEnd: NUMBERS.AXIS.X.PADDING.END,
          },
          animations: {
            enabled: true,
            trackBy,
            compensateForLayoutChanges(currentNodes, currentRect, preRect) {
              if (currentRect.width !== preRect.width) {
                const deltaX = currentRect.x - preRect.x;
                const deltaWidth = currentRect.width - preRect.width;
                currentNodes[0].x1 += deltaX;
                currentNodes[0].x2 += deltaX + deltaWidth;
              }
            },
          },
        };

  const yAxisDefinition =
    !yAxis || yAxis.show === 'none'
      ? false
      : {
          type: 'axis',
          key: KEYS.COMPONENT.Y_AXIS,
          scale: KEYS.SCALE.Y,
          layout: {
            dock: dockService.meta.y.dock,
            minimumLayoutMode: MODES.AXIS.Y,
          },
          settings: {
            labels: {
              show: yAxis.show !== 'title',
              fontFamily: style.axis.label.name.fontFamily,
              fontSize: style.axis.label.name.fontSize,
              fill: style.axis.label.name.color,
            },
            line: {
              stroke: style.axis.line.major.color,
            },
            ticks: {
              stroke: style.axis.line.major.color,
              show: yAxis.show !== 'title',
            },
            minorTicks: {
              stroke: style.axis.line.minor.color,
            },
            paddingEnd: !enabledPanZoom
              ? undefined
              : () =>
                  yAxis.show === 'title' || viewHandler.getMeta().isHomeState === false
                    ? 0
                    : NUMBERS.AXIS.Y.PADDING.END,
          },
          animations: {
            enabled: true,
            trackBy,
            compensateForLayoutChanges(currentNodes, currentRect, preRect) {
              if (dockService.meta.y.dock === 'right') {
                return;
              }
              const deltaWidth = currentRect.width - preRect.width;
              currentNodes.forEach((node) => {
                if (node.type === 'line') {
                  node.x1 += deltaWidth;
                  node.x2 += deltaWidth;
                } else if (node.type === 'text') {
                  node.x += deltaWidth;
                }
              });
            },
          },
        };

  return [xAxisDefinition, yAxisDefinition];
}
