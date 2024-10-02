import type { FC } from "react";

import { Title } from "@mantine/core";

import { PostDate } from "@/features/post/components";
import { useTranslation } from "@/libs/i18n";
import { Box, HStack, Stack } from "@/libs/mantine/layout";
import { BasicSeo, RichMarkdownContent } from "@/shared/components";

import type { ResumeType } from "@/features/resume/types/resume";
import type { LocalesType } from "@/libs/i18n";
import type { BasicSeoProps } from "@/shared/components";

type ResumeProps = {
  resume: ResumeType;
  locale: LocalesType;
};

export const Resume: FC<ResumeProps> = ({ resume, locale }) => {
  const { t } = useTranslation();
  const seo: BasicSeoProps = {
    title: t.PAGE.RESUME,
    description: t.DESCRIPTION.RESUME,
    path: "/resume",
  };

  return (
    <>
      <BasicSeo {...seo} />
      <Box>
        <Stack>
          <HStack spacing={16}>
            <PostDate date={resume.date} fz={"sm"} />
          </HStack>
          <Stack align={"center"} justify={"center"}>
            <Title fw={"bold"} fz={"lg"}>
              {resume.title}
            </Title>
          </Stack>
        </Stack>
        {resume.content && (
          <Box mt={16} pl={8} pr={4}>
            <RichMarkdownContent html={resume.content} />
          </Box>
        )}
      </Box>
    </>
  );
};
