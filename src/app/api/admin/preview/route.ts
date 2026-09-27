import { type NextRequest, NextResponse } from "next/server";
import { hasSameOrigin, verifyAdmin } from "@/libs/cms/auth";
import markdownToHtml from "@/libs/markdown/markdownToHtml";

export async function POST(request: NextRequest) {
  if ((await verifyAdmin(request.headers)) === null) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const value: unknown = await request.json().catch(() => null);
  const body =
    typeof value === "object" &&
    value !== null &&
    "body" in value &&
    typeof value.body === "string"
      ? value.body
      : "";

  if (body.length > 200_000) {
    return NextResponse.json({ error: "本文が長すぎます。" }, { status: 413 });
  }

  return NextResponse.json({ html: await markdownToHtml(body) });
}
