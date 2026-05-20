import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Test 1: raw SQL to check table + columns
    let tableInfo: unknown = null
    try {
      const result = await (payload.db as any).drizzle.execute(
        `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'atlas_config' ORDER BY ordinal_position`
      )
      tableInfo = result.rows ?? result
    } catch (e: any) {
      tableInfo = { error: e.message }
    }

    // Test 2: try findGlobal
    let globalResult: unknown = null
    try {
      globalResult = await payload.findGlobal({ slug: "atlas-config" } as any)
    } catch (e: any) {
      globalResult = { error: e.message }
    }

    return NextResponse.json({ tableInfo, globalResult })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
