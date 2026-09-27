import type { Metadata } from "next";
import type { ReactNode } from "react";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "CMS | muuuuminn blog",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.identity}>
          <span aria-hidden="true" className={styles.statusDot} />
          Cloudflare Access
        </div>
      </header>
      {children}
    </section>
  );
}
