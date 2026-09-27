import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { verifyAdmin } from "@/libs/cms/auth";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "CMS | muuuuminn blog",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const identity = await verifyAdmin(await headers());

  if (!identity) {
    return (
      <section className={styles.denied}>
        <p className={styles.eyebrow}>403</p>
        <h1>管理画面にアクセスできません</h1>
        <p>Cloudflare Accessでohmiとして認証してください。</p>
      </section>
    );
  }

  return (
    <section className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.identity}>
          <span aria-hidden="true" className={styles.statusDot} />
          {identity.email}
        </div>
      </header>
      {children}
    </section>
  );
}
