import { type NextRequest, NextResponse } from "next/server";
import { hasSameOrigin, verifyAdmin } from "@/libs/cms/auth";
import {
  GithubCmsError,
  getGithubPost,
  saveGithubPost,
} from "@/libs/cms/github";
import { validateCmsPostInput } from "@/libs/cms/validation";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

async function isAuthorized(request: NextRequest): Promise<boolean> {
  return (await verifyAdmin(request.headers)) !== null;
}

export async function GET(request: NextRequest, context: RouteContext) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { slug } = await context.params;

  try {
    const post = await getGithubPost(slug);
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Failed to load GitHub post", error);
    return NextResponse.json(
      { error: "記事を読み込めませんでした。" },
      { status: error instanceof GithubCmsError ? error.status : 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const { slug } = await context.params;
  const result = validateCmsPostInput(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  if (result.data.slug !== slug) {
    return NextResponse.json(
      { error: "既存記事のスラッグは変更できません。" },
      { status: 400 },
    );
  }

  try {
    const saved = await saveGithubPost(result.data);
    return NextResponse.json({ post: result.data, commitUrl: saved.commitUrl });
  } catch (error) {
    console.error("Failed to update GitHub post", error);
    return NextResponse.json(
      { error: "記事を保存できませんでした。" },
      { status: error instanceof GithubCmsError ? error.status : 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const { slug } = await context.params;

  try {
    const post = await getGithubPost(slug);
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const saved = await saveGithubPost({
      slug: post.slug,
      title: post.title,
      description: post.description,
      publishedAt: post.publishedAt,
      coverImage: post.coverImage,
      ogImageUrl: post.ogImageUrl,
      category: post.category,
      tags: post.tags,
      body: post.body,
      status: "archived",
    });
    return NextResponse.json({ ok: true, commitUrl: saved.commitUrl });
  } catch (error) {
    console.error("Failed to archive GitHub post", error);
    return NextResponse.json(
      { error: "記事を非公開にできませんでした。" },
      { status: error instanceof GithubCmsError ? error.status : 500 },
    );
  }
}
