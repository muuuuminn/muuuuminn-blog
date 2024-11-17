import type { FC } from "react";
import { memo } from "react";

import { formatDistance, format } from "date-fns";
import { ja } from "date-fns/locale";

import { getDictionary } from "@/libs/i18n";
import { Text } from "@/libs/radix/typography/Text";
import { VisuallyHiddenElement } from "@/components/VisuallyHiddenElement";

import type { LocalesType, DictionaryKeys } from "@/libs/i18n";
import type { TextProps } from "@/libs/radix/typography/Text";

const DATE_FORMAT = "yyyy/M/d";

const getRelativeDate = (date: string, d: DictionaryKeys, locale: LocalesType) => {
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
  } else if (time.indexOf("month") !== -1 || time.indexOf("year") !== -1) {
    return format(parsedDate, DATE_FORMAT, options);
  } else {
    return `${formatDistance(now, parsedDate, options)}${d.DATE_TIME.AGO}`;
  }
};

type PostDateProps = {
  date: string;
} & TextProps;

const _PostDate: FC<PostDateProps> = async ({ date, ...rest }) => {
  const d = await getDictionary();
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
