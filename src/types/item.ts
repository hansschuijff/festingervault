import { z } from "zod";
import {  CollectionResponse } from "./api";
import { EnumAccessLevel, EnumItemSlug, EnumItemType } from "@/zod/item";
type TVirusTotal = {
  filename: string;
  hash: string;
  result: string;
  stats: Record<string, number>;
  updated: number;
};
type TTerm={
	id:number;
	name:string;
	slug:string;
	taxonomy:string;
}
export type TItemTypeEnum=z.infer<typeof EnumItemType>
export type TItemTypeSlugEnum=z.infer<typeof EnumItemSlug>
export type TItemAccessLevelEnum=z.infer<typeof EnumAccessLevel>
export type TPostItem<Ex extends TItemTypeEnum = never> = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  image: string;
  thumbnail: string;
  type: Exclude<TItemTypeEnum, Ex>;
  author: string;
  category: string;
	terms:TTerm[],
  updated: number;
  created: number;
  version: string;
  owned: boolean;
  access?: TItemAccessLevelEnum;
  installed_version?: string;
  additional_content_count?: number;
  download_count?: number;
  install_count?: number;
  media_count?: number;
  preview?: string;
  support_url?: string;
  virus_total?: TVirusTotal;
	path?:string;
	install_dir?:string;
	collections?:number[];
};
export type TPostMedia = {
  id: number;
  filename: string;
  version: string;
  slug: string;
  size: number;
  updated: number;
};
export type TDemoContent = {
  id: number;
  type: string;
  title: string;
  updated: number;
};
export type TPostItemCollection = CollectionResponse<TPostItem>;
export type TPostChangelogCollection = CollectionResponse<TPostMedia>;
export type TDemoContentCollection = CollectionResponse<TDemoContent>;
export type ItemStatsResponse = {
  total: number;
  themes: number;
  plugins: number;
  kits: number;
};
export type TThemePluginItem = TPostItem<"elementor-template-kits">;
