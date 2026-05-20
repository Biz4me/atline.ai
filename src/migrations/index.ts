import * as migration_20260518_084119_initial from './20260518_084119_initial';
import * as migration_20260519_085421 from './20260519_085421';
import * as migration_20260519_102408 from './20260519_102408';
import * as migration_20260519_133320 from './20260519_133320';
import * as migration_20260519_164020_add_phone_avatar from './20260519_164020_add_phone_avatar';
import * as migration_20260520_rag_globals from './20260520_rag_globals';
import * as migration_20260520_163000_rag_tables from './20260520_163000_rag_tables';

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
    name: '20260519_133320',
  },
  {
    up: migration_20260519_164020_add_phone_avatar.up,
    down: migration_20260519_164020_add_phone_avatar.down,
    name: '20260519_164020_add_phone_avatar'
  },
  {
    up: migration_20260520_rag_globals.up,
    down: migration_20260520_rag_globals.down,
    name: '20260520_rag_globals',
  },
  {
    up: migration_20260520_163000_rag_tables.up,
    down: migration_20260520_163000_rag_tables.down,
    name: '20260520_163000_rag_tables',
  },
];
