const COMMON_I18N = {
  COPYRIGHT: "© 2022 muuuuminn ブログ. All rights reserved.",
} as const;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ja: {
    SITE_NAME: "muuuuminn ブログ",
    PAGE: {
      HOME: "ホーム",
      POLICY: "プライバシーポリシー",
      ABOUT_ME: "自己紹介",
    },
    ALT: {
      SITE_LOGO: "サイトロゴ",
    },
    ARIA_LABEL: {
      TOGGLE_APPEARANCE_BUTTON: "テーマ切り替え",
      MENU_BUTTON: "メニューの選択肢",
    },
    SUFFIX: {
      DATE_TIME: {
        JUST_NOW: "たった今",
        AGO: "前",
      },
    },
    ...COMMON_I18N,
  },
  en: {
    SITE_NAME: "muuuuminn blog",
    PAGE: {
      HOME: "Home",
      POLICY: "Privacy policy",
      ABOUT_ME: "About me",
    },
    ALT: {
      SITE_LOGO: "Site logo",
    },
    ARIA_LABEL: {
      TOGGLE_APPEARANCE_BUTTON: "Toggle appearance",
      MENU_BUTTON: "Menu options",
    },
    SUFFIX: {
      DATE_TIME: {
        JUST_NOW: "Just now",
        AGO: " ago",
      },
    },
    ...COMMON_I18N,
  },
} as const;
