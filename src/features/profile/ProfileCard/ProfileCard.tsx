import {
  CodeIcon,
  GitHubLogoIcon,
  GlobeIcon,
  HeartIcon,
  StarIcon,
} from "@radix-ui/react-icons";

import styles from "./ProfileCard.module.css";

import { Box } from "@/libs/radix/layout/Box";
import { Grid } from "@/libs/radix/layout/Grid";
import { HStack, VStack } from "@/libs/radix/layout/Stack";
import { Avatar } from "./Avatar";
import { SocialLink } from "./SocialLink";

export const ProfileCard = () => {
  return (
    <Box className={styles.container} p="1">
      <Box className={styles.title} p="1">
        ブログ運営者
      </Box>
      <VStack gap="3">
        <VStack align="center" gap="3">
          <HStack align="center" justify="center" wrap="wrap" gap="2">
            <Avatar
              src="/images/akira_face.jpeg"
              alt="正面を向く猫のあきらくんの画像"
            />
            <div className={styles.name}>muuuuminn</div>
          </HStack>
          <VStack gap="1" className={styles.detail}>
            <div className={styles.detailItem}>
              <div className={styles.detailContent}>
                <HStack gap="1" align="center" className={styles.detailLabel}>
                  <StarIcon />
                  経歴:
                </HStack>
                <span className={styles.detailValue}>SE:1年半 → FE:5年</span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailContent}>
                <HStack gap="1" align="center" className={styles.detailLabel}>
                  <CodeIcon />
                  スキル:
                </HStack>
                <span className={styles.detailValue}>
                  Next.js, TypeScript, React, Notion
                </span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailContent}>
                <HStack gap="1" align="center" className={styles.detailLabel}>
                  <HeartIcon />
                  趣味:
                </HStack>
                <span className={styles.detailValue}>
                  ゲーム, 手品, 開発, コレクション, 映画
                </span>
              </div>
            </div>
          </VStack>
        </VStack>

        <HStack
          gap="3"
          justify="center"
          p="1"
          wrap="wrap"
          className={styles.footer}
        >
          <SocialLink
            href="https://github.com/muuuuminn"
            icon={<GitHubLogoIcon width={24} height={24} />}
            title="GitHub"
          />
          <SocialLink
            href="https://muuuuminn.com"
            icon={<GlobeIcon width={24} height={24} />}
            title="ブログ"
          />{" "}
        </HStack>
      </VStack>
    </Box>
  );
};

/**
 * 内容
 * 近江宏樹（おうみ ひろき）
 * 経歴
 * 2017-2018: 1年半、SierでSE
 * 2019-2024: 5年、WEB系企業でフロントエンドエンジニア
 * スキル
 * Next.js, TypeScript, React, Notion
 * 趣味
 * ゲーム, 手品, 開発, コレクション, 映画
 * リンク
 * GitHub https://github.com/muuuuminn
 * ブログ https://muuuuminn.com
 */
