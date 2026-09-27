export const CMS_POST_STATUSES = ["draft", "published", "archived"] as const;

export type CmsPostStatus = (typeof CMS_POST_STATUSES)[number];

export type CmsPostRecord = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  coverImage: string;
  ogImageUrl: string;
  category: string;
  tags: string[];
  body: string;
  status: CmsPostStatus;
  createdAt: string;
  updatedAt: string;
};

export type CmsPostInput = Omit<CmsPostRecord, "createdAt" | "updatedAt">;
