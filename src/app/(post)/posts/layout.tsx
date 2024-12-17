import { ProfileCard } from "@/features/profile/ProfileCard";
import { VStack } from "@/libs/radix/layout/Stack";
import type { FC, ReactNode } from "react";

type PostsLayoutProps = {
  children: ReactNode;
};

const PostsLayout: FC<PostsLayoutProps> = ({ children }) => {
  return (
    <VStack asChild gap="6">
      <main>
        {children}
        <ProfileCard />
      </main>
    </VStack>
  );
};

export default PostsLayout;
