import { NextRequest, NextResponse } from "next/server";
import { addReflection, getReflections } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ reflections: await getReflections() });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) return NextResponse.json({ error: "متن یادداشت خالی است." }, { status: 400 });
    if (text.length > 2000) return NextResponse.json({ error: "یادداشت نباید بیشتر از ۲۰۰۰ حرف باشد." }, { status: 400 });
    const reflection = await addReflection(text);
    return NextResponse.json({ reflection }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "ذخیره‌سازی انجام نشد." }, { status: 500 });
  }
}
