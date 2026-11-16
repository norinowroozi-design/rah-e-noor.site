import { NextResponse } from "next/server";
import { deleteReflection } from "@/lib/storage";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const deleted = await deleteReflection(id);
  if (!deleted) return NextResponse.json({ error: "یادداشت پیدا نشد." }, { status: 404 });
  return NextResponse.json({ success: true });
}
