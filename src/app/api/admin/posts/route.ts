import { type NextRequest, NextResponse } from "next/server";
import { hasSameOrigin, verifyAdmin } from "@/libs/cms/auth";
import { GithubCmsError, saveGithubPost } from "@/libs/cms/github";
import posts from "@/libs/cms/posts-index.generated.json";
import type { CmsPostSummary } from "@/libs/cms/types";
import { validateCmsPostInput } from "@/libs/cms/validation";

export const dynamic = "force-dynamic";

async function isAuthorized(request: NextRequest): Promise<boolean> {
  return (await verifyAdmin(request.headers)) !== null;
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(
    { posts: posts as CmsPostSummary[] },
    { headers: { "cache-control": "private, max-age=60" } },
  );
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const result = validateCmsPostInput(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const saved = await saveGithubPost(result.data, "create");
    return NextResponse.json(
      { post: result.data, commitUrl: saved.commitUrl },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to save GitHub post", error);
    return NextResponse.json(
      { error: "記事を保存できませんでした。" },
      { status: error instanceof GithubCmsError ? error.status : 500 },
    );
  }
}
