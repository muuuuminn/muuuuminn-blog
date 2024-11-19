import type { TagType } from "../tag/types";

export const fireClickTagTrigger = (tag: TagType) => {
  window.dataLayer.push({
    event: "click_tag",
    click_tag_trigger: tag.name,
  });
};
