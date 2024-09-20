import type { ReactElement } from "react";

export { getStaticProps } from "@/pages/resume/resume.ssg";
import { BaseLayout } from "@/shared/components";

import { Resume } from "./Resume";
import { ResumeLayout } from "./ResumeLayout";

import type { ResumeType } from "@/features/resume/types/resume";
import type { NextPageWithLayout } from "@/pages/_app.page";

type ResumePageProps = {
  resume: ResumeType;
};

const ResumePage: NextPageWithLayout<ResumePageProps> = ({ resume }) => {
  return <Resume resume={resume} />;
};

ResumePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseLayout>
      <ResumeLayout>{page}</ResumeLayout>
    </BaseLayout>
  );
};

export default ResumePage;
