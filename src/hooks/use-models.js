import {
  useEffect,
  useState,
  useStaleLayout,
  useTheme,
  useConstraints,
  useTranslator,
  useAppLayout,
  useModel,
  useOptions,
  useRect,
} from '@nebula.js/stardust';

import createChartModel from '../models/chart-model';
import createDockModel from '../models/dock-model';
import getLogicalSize from '../logical-size';
import utils from '../utils';

const useModels = ({ core }) => {
  const layout = useStaleLayout();
  const theme = useTheme();
  const model = useModel();
  const translator = useTranslator();
  const constraints = useConstraints();
  const options = useOptions();
  const rect = useRect();
  const { qLocaleInfo: localeInfo } = useAppLayout();
  const [models, setModels] = useState();

  useEffect(() => {
    if (!layout || !core) {
      return;
    }

    const { picassoInstance, chart } = core;

    // TODO: use the layoutmodel module or another proper implementation
    const layoutModel = {
      meta: {
        isSnapshot: !!layout.snapshotData,
      },
      getDataPages: () => layout.qHyperCube.qDataPages,
      getHyperCube: () => layout.qHyperCube,
      getHyperCubeValue: (path, defaultValue) => utils.getValue(layout.qHyperCube, path, defaultValue),
      getLayoutValue: (path, defaultValue) => utils.getValue(layout, path, defaultValue),
      getLayout: () => layout,
      setDataPages: (pages) => {
        layout.qHyperCube.qDataPages = pages;
      },
    };

    const logicalSize = getLogicalSize({ layout: layoutModel.getLayout(), options });
    const dockModel = createDockModel({ layoutModel, size: logicalSize || rect, rtl: options.direction === 'rtl' });

    const chartModel = createChartModel({
      chart,
      localeInfo,
      layoutModel,
      dockModel,
      model,
      picasso: picassoInstance,
      options,
    });

    setModels({
      layoutModel,
      chartModel,
      dockModel,
    });
  }, [core, layout, constraints, theme.name(), translator.language(), options.direction, options.viewState]);

  return models;
};

export default useModels;