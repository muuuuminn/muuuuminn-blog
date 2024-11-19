import { useParams } from "next/navigation";

import en from "@/libs/i18n/locales/en";
import ja from "@/libs/i18n/locales/ja";

export type LocalesType = "ja" | "en";
export type DictionaryKeys = typeof ja | typeof en;

export const useDictionary = () => {
  const { locale = "ja" } = useParams<{
    locale: LocalesType | string[] | undefined;
  }>();

  const d = locale && locale === "en" ? en : ja;

  return { locale, d };
};
