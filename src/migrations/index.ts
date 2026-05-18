import * as migration_20260518_084119_initial from './20260518_084119_initial';

export const migrations = [
  {
    up: migration_20260518_084119_initial.up,
    down: migration_20260518_084119_initial.down,
    name: '20260518_084119_initial'
  },
];
