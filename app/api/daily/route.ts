import { NextResponse } from "next/server";
import { dailyVerses, wisdoms } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const day = Math.floor(Date.now() / 86_400_000);
  return NextResponse.json({
    verse: dailyVerses[day % dailyVerses.length],
    wisdom: wisdoms[day % wisdoms.length],
    date: new Date().toISOString().slice(0, 10)
  });
}
