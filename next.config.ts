tee ~/workspace/atline-v2/next.config.ts << 'ENDOFFILE'
import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next'

const nextConfig: NextConfig = {}

export default withPayload(nextConfig)
ENDOFFILE
git add next.config.ts && git revert --continue --no-edit && git push origin main
