import { range } from '../../../interactive';
import KEYS from '../../../constants/keys';

export default function createXRange({ actions, selectionModel, dockModel }) {
  if (selectionModel.query.getIsDimensionLocked()) {
    return false;
  }

  return range(
    {
      eventName: 'xRange',
      key: 'x-range-brush',
      targets: [KEYS.COMPONENT.X_AXIS, KEYS.COMPONENT.POINT],
      fillTargets: [KEYS.COMPONENT.X_AXIS],
      dock: dockModel.x.dock,
      scale: KEYS.SCALE.X,
      onEdited() {
        actions.select.emit('end', 'xRange');
      },
    },
    {
      actions,
    }
  );
}