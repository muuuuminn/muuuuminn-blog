import type locales from "@/libs/i18n/locales";

export type LocalesType = keyof typeof locales;
export type Locales = (typeof locales)[LocalesType];
