import "server-only";

import zennMarkdown2Html from "zenn-markdown-html";

export default async function markdownToHtml(markdown: string) {
  const result = await zennMarkdown2Html(markdown, {
    embedOrigin: "https://embed.zenn.studio",
  });
  return result.toString();
}

// old version
// import { remark } from "remark";
// import html from "remark-html";
// import remarkPrism from "remark-prism";

// export default async function markdownToHtml(markdown: string) {
//   const result = await remark()
//     .use(html, { sanitize: false })
//     .use(remarkPrism, { plugins: ["line-numbers"] })
//     .process(markdown);
//   return result.toString();
// }
