import withPWA from 'next-pwa'
import { withPayload } from '@payloadcms/next'

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})({})

export default withPayload(nextConfig)
