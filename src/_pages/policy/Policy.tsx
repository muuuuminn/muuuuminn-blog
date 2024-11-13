import type { FC } from "react";

import { useTranslation } from "@/libs/i18n";
import { Box } from "@/libs/mantine/layout";
import { BasicSeo, RichMarkdownContent } from "@/shared/components";

import type { PolicyType } from "@/features/policy/types";
import type { BasicSeoProps} from "@/shared/components";

type PolicyProps = {
  policy: PolicyType;
};

export const Policy: FC<PolicyProps> = ({ policy }) => {
  const { t } = useTranslation();
  const seo: BasicSeoProps = {
    title: t.PAGE.POLICY,
    description: t.DESCRIPTION.POLICY,
    path: "/policy",
  };

  return (
    <>
      <BasicSeo {...seo} />
      <Box>
        <RichMarkdownContent html={policy.content} />
      </Box>
    </>
  );
};
