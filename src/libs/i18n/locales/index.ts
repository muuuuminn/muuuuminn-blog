const COMMON_I18N = {
  COPYRIGHT: "© 2022 muuuuminn blog. All rights reserved.",
} as const;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ja: {
    SITE_NAME: "muuuuminn blog",
    PAGE: {
      POSTS: "投稿一覧",
      POLICY: "プライバシーポリシー",
      ABOUT_ME: "自己紹介",
      RSS: "RSS",
      CONTACT: "お問い合わせ",
      COFFEE: "おひねり",
      WISH_LIST: "欲しいものリスト",
      RESUME: "経歴",
    },
    DESCRIPTION: {
      POSTS: "muuuuminnによる投稿一覧ページです。",
      POLICY: "muuuuminn blogのプライバシーポリシーを載せたページです",
      RESUME: "muuuuminn の経歴が載っているページです",
    },
    ALT: {
      SITE_LOGO: "サイトロゴ",
      THUMBNAIL_OF: "のサムネイル",
    },
    ARIA_LABEL: {
      TOGGLE_APPEARANCE_BUTTON: "テーマ切り替え",
      MENU_BUTTON: "メニューの選択肢",
    },
    DATE_TIME: {
      JUST_NOW: "たった今",
      AGO: "前",
    },
    COMPONENTS: {
      TAG: {
        PLACEHOLDER: "すべての",
        LABEL: "タグで絞り込み",
      },
      RELATED_POST_AREA: {
        TITLE: "関連する投稿があります",
      },
    },
    ...COMMON_I18N,
  },
  en: {
    SITE_NAME: "muuuuminn blog",
    PAGE: {
      POSTS: "Posts",
      POLICY: "Privacy policy",
      ABOUT_ME: "About me",
      RSS: "RSS",
      CONTACT: "Contact",
      COFFEE: "Buy me a coffee",
      WISH_LIST: "Wish list",
      RESUME: "Resume",
    },
    DESCRIPTION: {
      POSTS: "This page shows a post written by muuuuminn.",
      POLICY: "This page shows a privacy policy.",
      RESUME: "This page contains muuuuminn's resume and career history.",
    },
    ALT: {
      SITE_LOGO: "Site logo",
      THUMBNAIL_OF: "'s thumbnail",
    },
    ARIA_LABEL: {
      TOGGLE_APPEARANCE_BUTTON: "Toggle appearance",
      MENU_BUTTON: "Menu options",
    },
    DATE_TIME: {
      JUST_NOW: "Just now",
      AGO: " ago",
    },
    COMPONENTS: {
      TAG: {
        PLACEHOLDER: "All",
        LABEL: "tag filters posts.",
      },
      RELATED_POST_AREA: {
        TITLE: "There are some related posts",
      },
    },
    ...COMMON_I18N,
  },
} as const;
