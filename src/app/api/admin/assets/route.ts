import { getCloudflareContext } from "@opennextjs/cloudflare";
import { type NextRequest, NextResponse } from "next/server";
import { hasSameOrigin, verifyAdmin } from "@/libs/cms/auth";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

type AssetEnv = CloudflareEnv & {
  CMS_ASSETS?: R2Bucket;
  CMS_ASSET_BASE_URL?: string;
};

function extensionFor(file: File): string {
  const fromName = file.name
    .toLowerCase()
    .match(/\.(avif|gif|jpe?g|png|webp)$/);
  if (fromName) return fromName[1] === "jpeg" ? "jpg" : fromName[1];
  return file.type.split("/")[1] || "bin";
}

export async function POST(request: NextRequest) {
  if ((await verifyAdmin(request.headers)) === null) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const slug = formData.get("slug");
  if (!(file instanceof File) || typeof slug !== "string") {
    return NextResponse.json(
      { error: "画像とスラッグが必要です。" },
      { status: 400 },
    );
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json(
      { error: "先に有効なスラッグを入力してください。" },
      { status: 400 },
    );
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "対応していない画像形式です。" },
      { status: 415 },
    );
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { error: "画像は10MB以下にしてください。" },
      { status: 413 },
    );
  }

  const context = await getCloudflareContext({ async: true });
  const env = context.env as AssetEnv;
  const baseUrl = (env.CMS_ASSET_BASE_URL || "").replace(/\/$/, "");
  if (!env.CMS_ASSETS || !baseUrl) {
    return NextResponse.json(
      { error: "R2画像ストレージが設定されていません。" },
      { status: 503 },
    );
  }

  const key = `post/${slug}/${crypto.randomUUID()}.${extensionFor(file)}`;
  await env.CMS_ASSETS.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  return NextResponse.json({ url: `${baseUrl}/${key}` }, { status: 201 });
}
