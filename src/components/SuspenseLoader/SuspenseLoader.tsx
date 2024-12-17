import { type ReactNode, Suspense } from "react";

import styles from "./SuspenseLoader.module.css";

import { Spinner } from "@/components/Spinner";

export const SuspenseLoader = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};
