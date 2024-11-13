import "server-only";

type LocalesType = keyof typeof dictionaries;
// type DictionaryKeys = (typeof dictionaries)[LocalesType];

const dictionaries = {
  ja: () => import("./locales/ja").then((module) => module.default),
  en: () => import("./locales/en").then((module) => module.default),
};

export const getDictionary = async (locale: LocalesType = "ja") => dictionaries[locale]();
