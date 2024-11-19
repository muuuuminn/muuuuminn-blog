"use client";

import { format, formatDistance } from "date-fns";
import { ja } from "date-fns/locale";
import { memo } from "react";

import { VisuallyHiddenElement } from "@/components/VisuallyHiddenElement";
import { useDictionary } from "@/libs/i18n/useDictionary";
import { Text } from "@/libs/radix/typography/Text";

import type { DictionaryKeys, LocalesType } from "@/libs/i18n/useDictionary";
import type { TextProps } from "@/libs/radix/typography/Text";
import type { FC } from "react";

const DATE_FORMAT = "yyyy/M/d";

const getRelativeDate = (
  date: string,
  d: DictionaryKeys,
  locale: LocalesType,
) => {
  const isInvalidDate = Number.isNaN(new Date(date).getTime());

  if (isInvalidDate) {
    return "";
  }

  const options = locale === "en" ? {} : { locale: ja };

  const now = new Date();
  const parsedDate = Date.parse(date);
  const time = formatDistance(now, parsedDate);

  if (time.indexOf("less than") !== -1) {
    return d.DATE_TIME.JUST_NOW;
  }
  if (time.indexOf("month") !== -1 || time.indexOf("year") !== -1) {
    return format(parsedDate, DATE_FORMAT, options);
  }
  return `${formatDistance(now, parsedDate, options)}${d.DATE_TIME.AGO}`;
};

type PostDateProps = {
  date: string;
} & TextProps;

const _PostDate: FC<PostDateProps> = ({ date, ...rest }) => {
  const { d } = useDictionary();
  const relativeDate = getRelativeDate(date, d, "ja");

  return (
    <Text {...rest} color={"gray"} highContrast>
      <VisuallyHiddenElement>投稿日：</VisuallyHiddenElement>
      <time dateTime={date} style={{ fontSize: "14px" }}>
        {relativeDate}
      </time>
    </Text>
  );
};

export const PostDate = memo(_PostDate);
