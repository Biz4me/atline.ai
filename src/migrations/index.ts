import * as migration_20260518_084119_initial from './20260518_084119_initial';
import * as migration_20260519_085421 from './20260519_085421';
import * as migration_20260519_102408 from './20260519_102408';
import * as migration_20260519_133320 from './20260519_133320';
import * as migration_20260519_164020_add_phone_avatar from './20260519_164020_add_phone_avatar';
import * as migration_20260520_163000_rag_tables from './20260520_163000_rag_tables';
import * as migration_20260520_180000_gamification from './20260520_180000_gamification';
import * as migration_20260520_190000_seed_atlas_prompt from './20260520_190000_seed_atlas_prompt';
import * as migration_20260520_200000_update_atlas_prompt_v2 from './20260520_200000_update_atlas_prompt_v2';
import * as migration_20260520_210000_atlas_voice_mode from './20260520_210000_atlas_voice_mode';
import * as migration_20260520_220000_atlas_clickable_links from './20260520_220000_atlas_clickable_links';
import * as migration_20260520_230000_conversations_v2 from './20260520_230000_conversations_v2';
import * as migration_20260520_240000_rag_tags from './20260520_240000_rag_tags';
import * as migration_20260520_rag_globals from './20260520_rag_globals';
import * as migration_20260521_000000_rag_locked_docs from './20260521_000000_rag_locked_docs';
import * as migration_20260521_130946 from './20260521_130946';
import * as migration_20260522_scripts_library from './20260522_scripts_library';
import * as migration_20260522_revenue_tracking from './20260522_revenue_tracking';
import * as migration_20260522_user_public_profile from './20260522_user_public_profile';

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
    name: '20260519_164020_add_phone_avatar',
  },
  {
    up: migration_20260520_163000_rag_tables.up,
    down: migration_20260520_163000_rag_tables.down,
    name: '20260520_163000_rag_tables',
  },
  {
    up: migration_20260520_180000_gamification.up,
    down: migration_20260520_180000_gamification.down,
    name: '20260520_180000_gamification',
  },
  {
    up: migration_20260520_190000_seed_atlas_prompt.up,
    down: migration_20260520_190000_seed_atlas_prompt.down,
    name: '20260520_190000_seed_atlas_prompt',
  },
  {
    up: migration_20260520_200000_update_atlas_prompt_v2.up,
    down: migration_20260520_200000_update_atlas_prompt_v2.down,
    name: '20260520_200000_update_atlas_prompt_v2',
  },
  {
    up: migration_20260520_210000_atlas_voice_mode.up,
    down: migration_20260520_210000_atlas_voice_mode.down,
    name: '20260520_210000_atlas_voice_mode',
  },
  {
    up: migration_20260520_220000_atlas_clickable_links.up,
    down: migration_20260520_220000_atlas_clickable_links.down,
    name: '20260520_220000_atlas_clickable_links',
  },
  {
    up: migration_20260520_230000_conversations_v2.up,
    down: migration_20260520_230000_conversations_v2.down,
    name: '20260520_230000_conversations_v2',
  },
  {
    up: migration_20260520_240000_rag_tags.up,
    down: migration_20260520_240000_rag_tags.down,
    name: '20260520_240000_rag_tags',
  },
  {
    up: migration_20260520_rag_globals.up,
    down: migration_20260520_rag_globals.down,
    name: '20260520_rag_globals',
  },
  {
    up: migration_20260521_000000_rag_locked_docs.up,
    down: migration_20260521_000000_rag_locked_docs.down,
    name: '20260521_000000_rag_locked_docs',
  },
  {
    up: migration_20260521_130946.up,
    down: migration_20260521_130946.down,
    name: '20260521_130946'
  },
  {
    up: migration_20260522_scripts_library.up,
    down: migration_20260522_scripts_library.down,
    name: '20260522_scripts_library',
  },
  {
    up: migration_20260522_revenue_tracking.up,
    down: migration_20260522_revenue_tracking.down,
    name: '20260522_revenue_tracking',
  },
  {
    up: migration_20260522_user_public_profile.up,
    down: migration_20260522_user_public_profile.down,
    name: '20260522_user_public_profile',
  },
];
