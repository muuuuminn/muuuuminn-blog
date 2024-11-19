import "zenn-content-css";
import "@/libs/markdown/prism-override-style.css";

import type { FC } from "react";

type RichMarkdownContentProps = { html: string };

export const RichMarkdownContent: FC<RichMarkdownContentProps> = (props) => {
  const { html } = props;
  return (
    <div
      className="znc"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};
