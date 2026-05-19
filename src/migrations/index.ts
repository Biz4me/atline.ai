import * as migration_20260518_084119_initial from './20260518_084119_initial';
import * as migration_20260519_085421 from './20260519_085421';
import * as migration_20260519_102408 from './20260519_102408';
import * as migration_20260519_133320 from './20260519_133320';

export const migrations = [
  {
    up: migration_20260518_084119_initial.up,
    down: migration_20260518_084119_initial.down,
    name: '20260518_084119_initial',
  },
  {
    up: migration_20260519_085421.up,
    down: migration_20260519_085421.down,
    name: '20260519_085421',
  },
  {
    up: migration_20260519_102408.up,
    down: migration_20260519_102408.down,
    name: '20260519_102408',
  },
  {
    up: migration_20260519_133320.up,
    down: migration_20260519_133320.down,
    name: '20260519_133320'
  },
];
