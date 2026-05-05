import { type ReactNode, Suspense } from "react";
import { Spinner } from "@/components/Spinner";
import styles from "./SuspenseLoader.module.css";

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
