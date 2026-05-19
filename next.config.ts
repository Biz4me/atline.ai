import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next'

const nextConfig: NextConfig = {}

export default withPayload(nextConfig)
