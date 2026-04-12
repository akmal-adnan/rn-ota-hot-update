import {colors} from './colors';
import {radii} from './radii';
import {shadows} from './shadows';
import {spacing} from './spacing';
import {typography} from './typography';

export const theme = {
  colors,
  spacing,
  radii,
  typography,
  shadows,
} as const;

export type AppTheme = typeof theme;
