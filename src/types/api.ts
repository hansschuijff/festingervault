import { ItemTypeEnum } from "@/zod/post-item";
import { z } from "zod";

type MetaType = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};
export type CollectionResponse<ResponseDataType> = {
  data: ResponseDataType[];
  meta?: MetaType;
};
export type PostItemType = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  image: string;
  type: z.infer<typeof ItemTypeEnum>;
  author: string;
  category: string;
  updated: number;
  created: number;
  version: string;
  owned: boolean;
  access?: "gold" | "bronze" | "silver";
  installed_version?: string;
};
export type PostItemCollectionResponse = CollectionResponse<PostItemType>;
export type ItemStatsResponse = {
  total: number;
  themes: number;
  plugins: number;
  kits: number;
};
