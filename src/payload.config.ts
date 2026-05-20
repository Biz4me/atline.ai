import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Modules } from './collections/Modules'
import { Lecons } from './collections/Lecons'
import { Prospects } from './collections/Prospects'
import { Scripts } from './collections/Scripts'
import { Conversations } from './collections/Conversations'
import { SocietesMlm } from './collections/SocietesMlm'
import { RagDocuments } from './collections/RagDocuments'
import { RagTags } from './collections/RagTags'
import { AtlasConfig } from './globals/AtlasConfig'
import { MarklineConfig } from './globals/MarklineConfig'
import { ProlineConfig } from './globals/ProlineConfig'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Modules,
    Lecons,
    Prospects,
    Scripts,
    Conversations,
    SocietesMlm,
    RagDocuments,
    RagTags,
  ],
  globals: [
    AtlasConfig,
    MarklineConfig,
    ProlineConfig,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
