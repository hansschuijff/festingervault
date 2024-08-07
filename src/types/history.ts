import { CollectionResponse } from "./api";
import { DemoContentType, PostItemType, PostMediaType } from "./item";

export type HistoryItemType = {
  id: number;
  type: "download" | "install" | "update" | "download_additional";
  media?: PostMediaType & DemoContentType;
  item: PostItemType;
  created: number;
};
export type HistoryCollectionType = CollectionResponse<HistoryItemType>;
