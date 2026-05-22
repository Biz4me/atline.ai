import { redirect } from "next/navigation"

interface Props {
  params: Promise<{ code: string }>
}

export default async function InvitePage({ params }: Props) {
  const { code } = await params
  // Redirect to signup with referral code pre-filled
  redirect(`/signup?ref=${encodeURIComponent(code.toUpperCase())}`)
}
