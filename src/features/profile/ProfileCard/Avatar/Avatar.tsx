import * as OriginAvatar from "@radix-ui/react-avatar";

import styles from "./Avatar.module.css";

export const Avatar = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <OriginAvatar.Root className={styles.root}>
      <OriginAvatar.Image className={styles.image} src={src} alt={alt} />
      <OriginAvatar.Fallback className={styles.fallback} delayMs={600}>
        {alt.slice(0, 1)}
      </OriginAvatar.Fallback>
    </OriginAvatar.Root>
  );
};
