import { ICON_SIZE, ICON_COLOR } from './constant'
export const getIcon = iconName =>
  ({ size: ICON_SIZE, color: ICON_COLOR, value: iconName });