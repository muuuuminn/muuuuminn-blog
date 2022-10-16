import zennMarkdown2Html from "zenn-markdown-html";

export default function markdownToHtml(markdown: string) {
  const result = zennMarkdown2Html(markdown);
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
