import type { ReactElement } from "react";

export { getStaticProps } from "@/pages/policy/policy.ssg";
import { BaseLayout } from "@/shared/components";

import { Policy } from "./Policy";
import { PolicyLayout } from "./PolicyLayout";

import type { PolicyType } from "@/features/policy/types";
import type { NextPageWithLayout } from "@/pages/_app.page";

type PolicyPageProps = {
  policy: PolicyType;
};

const PolicyPage: NextPageWithLayout<PolicyPageProps> = ({ policy }) => {
  return <Policy policy={policy} />;
};

PolicyPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseLayout>
      <PolicyLayout>{page}</PolicyLayout>
    </BaseLayout>
  );
};

export default PolicyPage;
